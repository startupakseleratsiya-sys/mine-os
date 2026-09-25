"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { Lesson } from "@/content/cp3p/types";
import { splitSentences, useNarrator } from "./narrator";

const RATES = [0.85, 1, 1.15, 1.3];

/**
 * Video dars: darsning slaydlari + ovozli tushuntirish (subtitr bilan). Har slayd tugagach keyingisiga o'tadi.
 * Og'ir video fayl yo'q — sahifa tez ochiladi, oflayn ovoz brauzerda.
 */
export function VideoLesson({ lesson, number, recorded = false }: { lesson: Lesson; number: number; recorded?: boolean }) {
  const narrator = useNarrator();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  // Komponent yopilsa (boshqa tab/dars) MP3 to'xtasin.
  useEffect(() => () => {
    const a = audioRef.current;
    if (a) {
      a.onended = null;
      a.pause();
      a.removeAttribute("src");
    }
  }, []);
  // Yozib olingan MP3 bo'lsa (scripts/generate-lesson-audio.mjs) — o'sha; aks holda brauzer ovozi.
  const supported = recorded || narrator.supported;
  const speaking = recorded ? audioPlaying : narrator.speaking;
  const stop = () => {
    if (recorded) {
      audioRef.current?.pause();
      setAudioPlaying(false);
    } else narrator.stop();
  };
  const [slide, setSlide] = useState(0);
  const [sentence, setSentence] = useState(-1);
  const [rate, setRate] = useState(1);
  const boxRef = useRef<HTMLDivElement>(null);
  const slides = lesson.slides;
  const sentences = useMemo(() => slides.map((s) => splitSentences(s.narration)), [slides]);
  const s = slides[slide];
  // Punktlar gaplar bilan birga ketma-ket paydo bo'ladi.
  const shownPoints = !recorded && (speaking || sentence >= 0) ? Math.max(1, Math.ceil(((sentence + 1) / Math.max(sentences[slide].length, 1)) * s.points.length)) : s.points.length;

  const play = (from: number, r = rate) => {
    setSlide(from);
    setSentence(-1);
    if (recorded) {
      if (!audioRef.current) audioRef.current = new Audio();
      const a = audioRef.current;
      a.setAttribute("src", `/audio/${lesson.id}/${from + 1}.mp3`);
      a.defaultPlaybackRate = r;
      a.onended = () => {
        if (from + 1 < slides.length) play(from + 1, r);
        else setAudioPlaying(false);
      };
      a.onerror = () => setAudioPlaying(false);
      setAudioPlaying(true);
      void a.play().catch((e: unknown) => {
        // src almashganda oldingi play() AbortError bilan tugaydi — bu xato emas.
        if ((e as { name?: string })?.name !== "AbortError") setAudioPlaying(false);
      });
      return;
    }
    narrator.speak(sentences[from], {
      rate: r,
      onSentence: setSentence,
      onDone: () => {
        if (from + 1 < slides.length) play(from + 1, r);
        else setSentence(-1);
      },
    });
  };
  const go = (to: number) => {
    const t = Math.max(0, Math.min(slides.length - 1, to));
    if (speaking) play(t);
    else {
      setSlide(t);
      setSentence(-1);
    }
  };

  return (
    <div ref={boxRef} className="overflow-hidden rounded-3xl bg-[#0f2a22] text-white">
      <div className="flex min-h-[300px] flex-col gap-4 p-5 sm:aspect-video sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Lesson {number} · {slide + 1}/{slides.length}</p>
        <div className="flex flex-1 flex-col justify-center">
        <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-4xl">{s.title}</h3>
        <ul className="mt-5 space-y-2.5 sm:mt-7">
          {s.points.map((p, i) => (
            <li key={`${slide}-${i}`} className={`flex gap-3 text-[15px] leading-snug transition-opacity duration-500 sm:text-xl ${i < shownPoints ? "opacity-100" : "opacity-0"}`}>
              <span className="mt-2 size-2 shrink-0 rounded-full bg-[#9fd3b8]" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        </div>
        {recorded && speaking && <p className="max-h-24 overflow-y-auto rounded-xl bg-black/45 px-4 py-2 text-center text-sm leading-6">{s.narration}</p>}
        {!recorded && sentence >= 0 && <p className="rounded-xl bg-black/45 px-4 py-2 text-center text-sm leading-6 sm:text-base">{sentences[slide][sentence]}</p>}
      </div>
      <div className="h-1 bg-white/10"><div className="h-full bg-[#9fd3b8] transition-all" style={{ width: `${((slide + (sentence + 1) / Math.max(sentences[slide].length, 1)) / slides.length) * 100}%` }} /></div>
      <div className="flex flex-wrap items-center gap-2 p-3">
        <button type="button" onClick={() => go(slide - 1)} aria-label="Previous slide" className="grid size-10 place-items-center rounded-full hover:bg-white/10"><SkipBack className="size-5" /></button>
        {speaking ? (
          <button type="button" onClick={stop} aria-label="Pause" className="grid size-12 place-items-center rounded-full bg-white text-[#0f2a22]"><Pause className="size-5" /></button>
        ) : (
          <button type="button" onClick={() => play(slide)} disabled={!supported} aria-label="Play" className="grid size-12 place-items-center rounded-full bg-white text-[#0f2a22] disabled:opacity-40"><Play className="size-5" /></button>
        )}
        <button type="button" onClick={() => go(slide + 1)} aria-label="Next slide" className="grid size-10 place-items-center rounded-full hover:bg-white/10"><SkipForward className="size-5" /></button>
        <div className="ml-auto flex items-center gap-1">
          {RATES.map((r) => (
            <button key={r} type="button" onClick={() => { setRate(r); if (speaking) play(slide, r); }} className={`rounded-lg px-2 py-1 text-xs font-semibold ${rate === r ? "bg-white/20" : "text-white/60 hover:text-white"}`}>{r}×</button>
          ))}
          <button type="button" onClick={() => boxRef.current?.requestFullscreen?.()} aria-label="Full screen" className="ml-1 grid size-9 place-items-center rounded-full hover:bg-white/10"><Maximize2 className="size-4" /></button>
        </div>
      </div>
      {!supported && <p className="px-4 pb-4 text-xs text-white/60">Your browser has no speech voice. You can still step through the slides.</p>}
    </div>
  );
}

/** Butun darsni ovozda o'qib berish (audio dars) — matn bo'limlari ketma-ket. */
export function ListenLesson({ parts }: { parts: { heading: string; text: string }[] }) {
  const { supported, speaking, speak, stop } = useNarrator();
  const [current, setCurrent] = useState(-1);
  const [rate, setRate] = useState(1);
  const all = useMemo(() => parts.flatMap((p, pi) => [p.heading + ".", ...splitSentences(p.text)].map((t) => ({ t, pi }))), [parts]);
  const [pos, setPos] = useState(0);

  const start = (from: number, r = rate) => {
    speak(all.map((x) => x.t), {
      rate: r,
      start: from,
      onSentence: (i) => {
        setPos(i);
        setCurrent(all[i].pi);
      },
      onDone: () => {
        setCurrent(-1);
        setPos(0);
      },
    });
  };
  const jump = (partIndex: number) => start(Math.max(0, all.findIndex((x) => x.pi === partIndex)));

  return (
    <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        {speaking ? (
          <button type="button" onClick={stop} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 font-semibold text-white"><Pause className="size-4" />Pause</button>
        ) : (
          <button type="button" disabled={!supported} onClick={() => start(pos)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 font-semibold text-white disabled:opacity-40"><Play className="size-4" />{pos > 0 ? "Continue listening" : "Listen to the lesson"}</button>
        )}
        <div className="flex items-center gap-1">
          {RATES.map((r) => (
            <button key={r} type="button" onClick={() => { setRate(r); if (speaking) start(pos, r); }} className={`rounded-lg px-2 py-1 text-xs font-semibold ${rate === r ? "bg-[#e7ece6]" : "text-[#65736d]"}`}>{r}×</button>
          ))}
        </div>
      </div>
      <ol className="mt-4 space-y-1 text-sm">
        {parts.map((p, i) => (
          <li key={i}>
            <button type="button" onClick={() => jump(i)} disabled={!supported} className={`w-full rounded-lg px-3 py-2 text-left ${current === i ? "bg-[#e7ece6] font-semibold" : "hover:bg-[#f7f6f1]"}`}>{i + 1}. {p.heading}</button>
          </li>
        ))}
      </ol>
      {!supported && <p className="mt-3 text-xs text-[#65736d]">Your browser has no speech voice. Try Chrome, Edge or Safari.</p>}
    </div>
  );
}
