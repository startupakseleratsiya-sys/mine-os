"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNarrator } from "./narrator";

/**
 * Dars pleyeri uchun umumiy «playlist»: bo'laklar (slaydlar yoki audio bo'limlar) ketma-ket o'ynaydi,
 * lekin foydalanuvchi uchun bu BITTA vaqt chizig'i — istalgan joyga sudrab o'tish, ±10 soniya, bo'lakka sakrash.
 *
 * Ikki rejim:
 *  - yozuv (urls berilgan): har bo'lak — MP3; o'rin = soniya. Davomiylik metadata'dan olinadi,
 *    yuklanguncha matn uzunligidan taxminlanadi (chizig'i darhol ishlaydi).
 *  - brauzer ovozi (Web Speech): o'rin = gap raqami; vaqt gap uzunligidan taxminlanadi.
 *
 * O'rin localStorage'da saqlanadi (storageKey) — darsga qaytganda shu joydan davom etadi.
 */

type Pos = { i: number; off: number };

/** ~150 so'z/daqiqa — taxminiy davomiylik (soniya). */
const estimate = (text: string) => Math.max(1.5, text.length / 14.5);

export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function readPos(key: string): Pos | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as Pos;
    return Number.isFinite(p?.i) && Number.isFinite(p?.off) ? p : null;
  } catch {
    return null;
  }
}

function writePos(key: string, pos: Pos | null) {
  try {
    if (pos) window.localStorage.setItem(key, JSON.stringify(pos));
    else window.localStorage.removeItem(key);
  } catch {
    /* maxfiy rejim — saqlamasak ham ishlayveradi */
  }
}

export function usePlaylist({ groups, urls, storageKey, active, title }: { groups: string[][]; urls?: string[]; storageKey: string; active: boolean; title: string }) {
  const narrator = useNarrator();
  const recorded = Boolean(urls?.length);
  const supported = recorded || narrator.supported;
  const n = groups.length;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [clipPlaying, setClipPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pos, setPosState] = useState<Pos>({ i: 0, off: 0 });
  const posRef = useRef<Pos>({ i: 0, off: 0 });
  // started: pozitsiya bor (o'ynayapti yoki pauzada). ended: oxirigacha ko'rildi.
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rate, setRateState] = useState(1);
  const rateRef = useRef(1);
  const [durations, setDurations] = useState<(number | null)[]>(() => Array(n).fill(null));

  const playing = recorded ? clipPlaying : narrator.speaking;

  const setPos = useCallback((p: Pos) => {
    posRef.current = p;
    setPosState(p);
  }, []);

  // Gap bo'yicha taxminiy vaqtlar (Web Speech rejimi va subtitr uchun).
  const sentenceTimes = useMemo(() => groups.map((g) => g.map(estimate)), [groups]);
  const lengths = useMemo(
    () => groups.map((_, i) => durations[i] ?? sentenceTimes[i].reduce((a, b) => a + b, 0)),
    [groups, durations, sentenceTimes],
  );
  const offsets = useMemo(() => lengths.reduce<number[]>((acc, l, i) => [...acc, (acc[i] ?? 0) + l], [0]), [lengths]);
  const total = offsets[n] ?? 0;

  /** Bo'lak ichidagi o'rin → soniya (bo'lak boshidan). */
  const offSeconds = useCallback(
    (p: Pos) => (recorded ? p.off : sentenceTimes[p.i]?.slice(0, p.off).reduce((a, b) => a + b, 0) ?? 0),
    [recorded, sentenceTimes],
  );
  const current = Math.min(total, (offsets[pos.i] ?? 0) + offSeconds(pos));

  // Yozuv davomiyliklari — faqat pleyer birinchi marta ko'ringanda (bekor trafik yo'q).
  const [wanted, setWanted] = useState(active);
  if (active && !wanted) setWanted(true);
  useEffect(() => {
    if (!recorded || !wanted || !urls) return;
    const probes = urls.map((url, i) => {
      const a = new Audio();
      a.preload = "metadata";
      a.onloadedmetadata = () => {
        if (Number.isFinite(a.duration)) setDurations((d) => d.map((v, k) => (k === i ? a.duration : v)));
      };
      a.src = url;
      return a;
    });
    return () => probes.forEach((a) => a.removeAttribute("src"));
  }, [recorded, wanted, urls]);

  const audio = () => {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  };

  const finish = useCallback(() => {
    setClipPlaying(false);
    audioRef.current?.removeAttribute("src");
    setStarted(false);
    setEnded(true);
    setPos({ i: 0, off: 0 });
    writePos(storageKey, null);
  }, [setPos, storageKey]);

  /** i-bo'lakni off joyidan yuklash; autoplay=false bo'lsa — pauzada turadi (sudrab qo'yilganda). */
  const load = (i: number, off: number, autoplay: boolean) => {
    setEnded(false);
    setStarted(true);
    setPos({ i, off });
    if (recorded && urls) {
      const a = audio();
      a.pause();
      a.setAttribute("src", urls[i]);
      a.defaultPlaybackRate = rateRef.current;
      a.playbackRate = rateRef.current;
      a.onloadedmetadata = () => {
        if (off > 0) a.currentTime = Math.min(off, Math.max(0, a.duration - 0.25));
        if (Number.isFinite(a.duration)) setDurations((d) => (d[i] === a.duration ? d : d.map((v, k) => (k === i ? a.duration : v))));
      };
      a.ontimeupdate = () => setPos({ i, off: a.currentTime });
      a.onended = () => (i + 1 < n ? load(i + 1, 0, true) : finish());
      a.onerror = () => {
        setClipPlaying(false);
        setFailed(true);
      };
      if (autoplay) start(a);
      else setClipPlaying(false);
      return;
    }
    narrator.stop();
    if (!autoplay) return;
    narrator.speak(groups[i], {
      rate: rateRef.current,
      start: Math.floor(off),
      onSentence: (s) => setPos({ i, off: s }),
      onDone: () => (i + 1 < n ? load(i + 1, 0, true) : finish()),
    });
  };

  const start = (a: HTMLAudioElement) => {
    setClipPlaying(true);
    setFailed(false);
    void a.play().catch((e: unknown) => {
      // src almashganda oldingi play() AbortError bilan tugaydi — bu xato emas.
      if ((e as { name?: string })?.name === "AbortError") return;
      setClipPlaying(false);
      setFailed(true);
    });
  };

  const pause = () => {
    if (recorded) {
      audioRef.current?.pause();
      setClipPlaying(false);
    } else narrator.stop();
    writePos(storageKey, posRef.current);
  };

  const play = () => {
    if (ended) return load(0, 0, true);
    if (!started) {
      // Darsga qaytganda — oldin to'xtagan joydan (localStorage).
      const saved = readPos(storageKey);
      return saved && saved.i < n ? load(saved.i, saved.off, true) : load(0, 0, true);
    }
    const p = posRef.current;
    const a = audioRef.current;
    if (recorded && a?.getAttribute("src") && !a.ended) return start(a);
    load(p.i, p.off, true);
  };

  const toggle = () => (playing ? pause() : play());

  /** Umumiy vaqt chizig'ida t soniyaga o'tish. O'ynayotgan bo'lsa — o'ynashda davom etadi, pauzada — pauzada qoladi. */
  const seek = (t: number) => {
    const target = Math.max(0, Math.min(total - 0.3, t));
    let i = 0;
    while (i < n - 1 && offsets[i + 1] <= target) i++;
    const within = target - offsets[i];
    const keepPlaying = playing;
    if (recorded) {
      const a = audioRef.current;
      if (i === posRef.current.i && a?.getAttribute("src")) {
        a.currentTime = within;
        setPos({ i, off: within });
        setEnded(false);
        return;
      }
      load(i, within, keepPlaying);
    } else {
      // Gap chegarasiga yaxlitlanadi.
      let s = 0;
      let acc = 0;
      while (s < sentenceTimes[i].length - 1 && acc + sentenceTimes[i][s] <= within) acc += sentenceTimes[i][s++];
      load(i, s, keepPlaying);
    }
    if (!keepPlaying) writePos(storageKey, posRef.current);
  };

  const skip = (delta: number) => {
    if (!recorded) {
      // Web Speech'da vaqt taxminiy — bitta gapga oldinga/orqaga.
      const p = posRef.current;
      const s = p.off + (delta > 0 ? 1 : -1);
      if (s >= 0 && s < groups[p.i].length) return load(p.i, s, playing);
      const i = Math.max(0, Math.min(n - 1, p.i + (delta > 0 ? 1 : -1)));
      return load(i, delta > 0 || i === p.i ? 0 : groups[i].length - 1, playing);
    }
    seek(current + delta);
  };

  /** i-bo'lak boshiga o'tish; autoplay berilmasa — hozirgi holat (o'ynayotgan bo'lsa o'ynaydi). */
  const goTo = (i: number, autoplay = playing) => {
    load(Math.max(0, Math.min(n - 1, i)), 0, autoplay);
  };

  const setRate = (r: number) => {
    setRateState(r);
    rateRef.current = r;
    const a = audioRef.current;
    if (recorded && a) {
      a.defaultPlaybackRate = r;
      a.playbackRate = r;
    } else if (!recorded && narrator.speaking) load(posRef.current.i, posRef.current.off, true);
  };

  // Tab almashganda (Video ↔ Audio) — pauza, o'rin saqlanadi.
  const pauseRef = useRef(pause);
  const handlersRef = useRef({ play, pause, skip, goTo });
  useEffect(() => {
    pauseRef.current = pause;
    handlersRef.current = { play, pause, skip, goTo };
  });
  useEffect(() => {
    if (!active && playing) pauseRef.current();
  }, [active, playing]);

  // Sahifadan chiqishda o'rinni saqlash va ovozni to'xtatish.
  useEffect(
    () => () => {
      const a = audioRef.current;
      if (a) {
        a.onended = null;
        a.ontimeupdate = null;
        a.pause();
        a.removeAttribute("src");
      }
    },
    [],
  );
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => writePos(storageKey, posRef.current), 5000);
    return () => window.clearInterval(id);
  }, [playing, storageKey]);

  // Telefon qulf ekrani / quloqchin tugmalari (Media Session API).
  useEffect(() => {
    if (!active || !playing || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      ms.metadata = new MediaMetadata({ title, artist: "Finora · CP3P" });
      ms.setActionHandler("play", () => handlersRef.current.play());
      ms.setActionHandler("pause", () => handlersRef.current.pause());
      ms.setActionHandler("seekbackward", () => handlersRef.current.skip(-10));
      ms.setActionHandler("seekforward", () => handlersRef.current.skip(10));
      ms.setActionHandler("previoustrack", () => handlersRef.current.goTo(posRef.current.i - 1));
      ms.setActionHandler("nexttrack", () => handlersRef.current.goTo(posRef.current.i + 1));
    } catch {
      /* eski brauzer */
    }
  }, [active, playing, title]);

  // Joriy bo'lak ichidagi ulush (0..1) va faol gap — subtitr va slayd punktlari uchun.
  const len = lengths[pos.i] || 1;
  const within = recorded ? Math.min(1, pos.off / len) : (pos.off + 1) / Math.max(groups[pos.i]?.length ?? 1, 1);
  const count = Math.max(groups[pos.i]?.length ?? 1, 1);
  const activeSentence = !started ? -1 : recorded ? Math.min(count - 1, Math.floor(within * count)) : Math.floor(pos.off);

  return {
    supported,
    recorded,
    playing,
    started,
    ended,
    failed,
    rate,
    index: pos.i,
    within,
    activeSentence,
    current,
    total,
    offsets,
    play,
    pause,
    toggle,
    seek,
    skip,
    goTo,
    setRate,
  };
}

export type Playlist = ReturnType<typeof usePlaylist>;
