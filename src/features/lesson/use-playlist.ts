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
 * O'rin saqlanadi: brauzerda (localStorage) va kirgan foydalanuvchida serverda (/api/media-position).
 * Darsga qaytganda — sahifa ochilishi bilan pleyer o'sha joyda turadi (boshidan ham, oxiridan ham emas),
 * foydalanuvchi o'zi boshqa joyga o'tkazmaguncha. Ikki nusxadan yangirog'i olinadi (boshqa qurilma).
 * Dars oxirigacha ko'rilsa — o'rin o'chiriladi.
 */

type Pos = { i: number; off: number };
/** Saqlangan o'rin; at — qachon saqlangani (ms), qaysi nusxa yangi ekanini aniqlash uchun. */
export type SavedPos = Pos & { at: number };

const SERVER_EVERY_MS = 15_000;

/** ~150 so'z/daqiqa — taxminiy davomiylik (soniya). */
const estimate = (text: string) => Math.max(1.5, text.length / 14.5);

export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function readPos(key: string): SavedPos | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as SavedPos;
    return Number.isFinite(p?.i) && Number.isFinite(p?.off) ? { i: p.i, off: p.off, at: Number(p.at) || 0 } : null;
  } catch {
    return null;
  }
}

function writePos(key: string, pos: Pos | null) {
  try {
    if (pos) window.localStorage.setItem(key, JSON.stringify({ i: pos.i, off: pos.off, at: Date.now() }));
    else window.localStorage.removeItem(key);
  } catch {
    /* maxfiy rejim — saqlamasak ham ishlayveradi */
  }
}

type Options = {
  groups: string[][];
  urls?: string[];
  storageKey: string;
  active: boolean;
  title: string;
  /** Serverda saqlangan o'rin (kirgan foydalanuvchi). */
  initial?: SavedPos | null;
  /** Berilsa — o'rin serverga ham yoziladi (boshqa qurilmada davom). */
  sync?: { lessonId: string; kind: "video" | "audio" };
  /** Yozuvlarning aniq davomiyliklari (audio.json) — vaqt chizig'i darhol aniq. */
  knownDurations?: number[];
};

export function usePlaylist({ groups, urls, storageKey, active, title, initial, sync, knownDurations }: Options) {
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
  const [durations, setDurations] = useState<(number | null)[]>(() =>
    Array.from({ length: n }, (_, i) => (recorded && knownDurations?.length === n ? knownDurations[i] : null)),
  );

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
    if (!recorded || !wanted || !urls || knownDurations?.length === n) return;
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
  }, [recorded, wanted, urls, knownDurations, n]);

  // ---- O'rinni saqlash ----
  const lastSentRef = useRef(0);
  const syncRef = useRef(sync);
  useEffect(() => {
    syncRef.current = sync;
  });
  const post = useCallback((body: Record<string, unknown>, beacon = false) => {
    const target = syncRef.current;
    if (!target) return;
    const data = JSON.stringify({ ...target, ...body });
    try {
      if (beacon && navigator.sendBeacon) navigator.sendBeacon("/api/media-position", new Blob([data], { type: "application/json" }));
      else void fetch("/api/media-position", { method: "POST", body: data, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
    } catch {
      /* saqlanmasa ham pleyer ishlayveradi */
    }
  }, []);
  /** Brauzerga doim; serverga — darhol (pauza, sudrash) yoki 15 s da bir marta (o'ynayotganda). */
  const persist = useCallback(
    (p: Pos | null, immediate: boolean, beacon = false) => {
      writePos(storageKey, p);
      if (!immediate && Date.now() - lastSentRef.current < SERVER_EVERY_MS) return;
      lastSentRef.current = Date.now();
      post(p ? { part: p.i, offset: Math.min(3599, Math.max(0, Math.round(p.off * 10) / 10)) } : { clear: true }, beacon);
    },
    [post, storageKey],
  );

  // Sahifa ochilganda — saqlangan joyga qo'yish (pauzada). Brauzer va server nusxasidan yangirog'i.
  const restoredRef = useRef(false);
  useEffect(() => {
    // Faqat bir marta: sahifa server tomonidan qayta chizilsa (initial yangi obyekt) o'rin orqaga sakramasin.
    if (restoredRef.current) return;
    restoredRef.current = true;
    const local = readPos(storageKey);
    const best = [local, initial ?? null].filter((x): x is SavedPos => Boolean(x) && x!.i < n).sort((a, b) => b.at - a.at)[0];
    if (!best) return;
    // localStorage — tashqi manba, faqat mount'dan keyin o'qiladi (SSR bilan mos kelishi uchun).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPos({ i: best.i, off: best.off });
    setStarted(true);
  }, [storageKey, initial, n, setPos]);

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
    persist(null, true);
  }, [setPos, persist]);

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
    markPlayed();
    narrator.speak(groups[i], {
      rate: rateRef.current,
      start: Math.floor(off),
      onSentence: (s) => setPos({ i, off: s }),
      onDone: () => (i + 1 < n ? load(i + 1, 0, true) : finish()),
    });
  };

  const playedRef = useRef(false);
  const start = (a: HTMLAudioElement) => {
    markPlayed();
    setClipPlaying(true);
    setFailed(false);
    void a.play().catch((e: unknown) => {
      // src almashganda oldingi play() AbortError bilan tugaydi — bu xato emas.
      if ((e as { name?: string })?.name === "AbortError") return;
      setClipPlaying(false);
      setFailed(true);
    });
  };

  /** Birinchi tinglash — analitika uchun bir marta. */
  const markPlayed = () => {
    if (playedRef.current) return;
    playedRef.current = true;
    post({ played: true });
  };

  const pause = () => {
    if (recorded) {
      audioRef.current?.pause();
      setClipPlaying(false);
    } else narrator.stop();
    persist(posRef.current, true);
  };

  const play = () => {
    if (ended) return load(0, 0, true);
    if (!started) return load(0, 0, true);
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
        persist(posRef.current, true);
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
    // Foydalanuvchi o'zi joyni o'zgartirdi — darhol saqlanadi.
    persist(posRef.current, true);
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

  // Sahifadan chiqishda (ilova ichida boshqa sahifaga o'tish) — o'rinni saqlash va ovozni to'xtatish.
  const liveRef = useRef({ started, ended, persist });
  useEffect(() => {
    liveRef.current = { started, ended, persist };
  });
  useEffect(
    () => () => {
      const live = liveRef.current;
      if (live.started && !live.ended) live.persist(posRef.current, true, true);
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
    const id = window.setInterval(() => persist(posRef.current, false), 5000);
    return () => window.clearInterval(id);
  }, [playing, persist]);
  // Tab yopilsa / telefon boshqa ilovaga o'tsa — oxirgi soniyalar ham yo'qolmasin (sendBeacon).
  useEffect(() => {
    const save = () => {
      const live = liveRef.current;
      if (live.started && !live.ended) live.persist(posRef.current, true, true);
    };
    const onVis = () => document.visibilityState === "hidden" && save();
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

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
