"use client";

import { useMemo, useRef, type KeyboardEvent } from "react";
import { Maximize2, Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward } from "lucide-react";
import type { Lesson } from "@/content/cp3p/types";
import { splitSentences } from "./narrator";
import { formatTime, usePlaylist, type Playlist, type SavedPos } from "./use-playlist";

const RATES = [0.85, 1, 1.15, 1.3, 1.5];

/** Klaviatura: Space/K — play/pauza, ←/J — 10 s orqaga, →/L — 10 s oldinga. */
function onPlayerKey(e: KeyboardEvent<HTMLElement>, p: Playlist) {
  const tag = (e.target as HTMLElement).tagName;
  if (tag === "INPUT") return; // vaqt chizig'i strelkalarni o'zi boshqaradi
  if ((e.key === " " && e.target === e.currentTarget) || e.key === "k") {
    e.preventDefault();
    p.toggle();
  } else if (e.key === "ArrowLeft" || e.key === "j") {
    e.preventDefault();
    p.skip(-10);
  } else if (e.key === "ArrowRight" || e.key === "l") {
    e.preventDefault();
    p.skip(10);
  }
}

/** Butun dars bo'yicha bitta vaqt chizig'i: sudrab o'tkazish, bo'lak chegaralari belgilangan. */
function Timeline({ p, dark }: { p: Playlist; dark?: boolean }) {
  const max = Math.max(p.total, 1);
  const value = Math.min(p.current, max);
  return (
    <div className="flex items-center gap-3 text-xs tabular-nums">
      <span className={dark ? "text-white/70" : "text-[#65736d]"}>{formatTime(p.current)}</span>
      <div className="relative flex flex-1 items-center">
        <input
          type="range"
          min={0}
          max={max}
          step={0.5}
          value={value}
          onChange={(e) => p.seek(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${formatTime(p.current)} of ${formatTime(p.total)}`}
          className={`seek-range w-full ${dark ? "seek-dark" : ""}`}
          style={{ ["--fill" as string]: `${(value / max) * 100}%` }}
        />
        {/* Bo'lak (slayd/bo'lim) chegaralari */}
        {p.offsets.slice(1, -1).map((o, i) => (
          <span key={i} aria-hidden className={`pointer-events-none absolute top-1/2 h-2 w-0.5 -translate-y-1/2 ${dark ? "bg-[#0f2a22]" : "bg-white"}`} style={{ left: `${(o / max) * 100}%` }} />
        ))}
      </div>
      <span className={dark ? "text-white/70" : "text-[#65736d]"}>{p.recorded ? "" : "≈ "}{formatTime(p.total)}</span>
    </div>
  );
}

function SpeedPicker({ p, dark }: { p: Playlist; dark?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {RATES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => p.setRate(r)}
          aria-pressed={p.rate === r}
          className={`rounded-lg px-1.5 py-1 text-xs font-semibold ${p.rate === r ? (dark ? "bg-white/20" : "bg-[#e7ece6]") : dark ? "text-white/60 hover:text-white" : "text-[#65736d] hover:text-[#163e32]"}`}
        >
          {r}×
        </button>
      ))}
    </div>
  );
}

function SkipButton({ p, delta, dark }: { p: Playlist; delta: number; dark?: boolean }) {
  const Icon = delta < 0 ? RotateCcw : RotateCw;
  return (
    <button type="button" onClick={() => p.skip(delta)} aria-label={delta < 0 ? "Back 10 seconds" : "Forward 10 seconds"} className={`relative grid size-10 place-items-center rounded-full ${dark ? "hover:bg-white/10" : "border border-[#13251f]/10 hover:bg-[#f7f6f1]"}`}>
      <Icon className="size-5" />
      <span className="absolute text-[8px] font-bold">10</span>
    </button>
  );
}

/**
 * Video dars: darsning slaydlari + ovozli tushuntirish (subtitr bilan).
 * audioBase berilsa — tabiiy ovozli yozuv; aks holda brauzer ovozi.
 */
type Resume = { initial?: SavedPos | null; sync?: boolean; durations?: number[] };

export function VideoLesson({ lesson, number, audioBase, active = true, initial, sync, durations }: { lesson: Lesson; number: number; audioBase?: string; active?: boolean } & Resume) {
  const slides = lesson.slides;
  const groups = useMemo(() => slides.map((s) => splitSentences(s.narration)), [slides]);
  const urls = useMemo(() => (audioBase ? slides.map((_, i) => `${audioBase}/${i + 1}.mp3`) : undefined), [audioBase, slides]);
  const p = usePlaylist({ groups, urls, storageKey: `finora:pos:video:${lesson.id}`, active, title: lesson.title, initial, sync: sync ? { lessonId: lesson.id, kind: "video" } : undefined, knownDurations: durations });
  const boxRef = useRef<HTMLDivElement>(null);
  const s = slides[p.index];
  const sentence = p.activeSentence >= 0 ? groups[p.index][p.activeSentence] : null;
  // Punktlar ovoz bilan birga ketma-ket paydo bo'ladi.
  const shownPoints = p.started ? Math.max(1, Math.ceil(Math.max(p.within, 0.01) * s.points.length)) : s.points.length;

  return (
    <div ref={boxRef} tabIndex={0} onKeyDown={(e) => onPlayerKey(e, p)} className="overflow-hidden rounded-3xl bg-[#0f2a22] text-white outline-none focus-visible:ring-4 focus-visible:ring-[#9fd3b8]/60">
      {/* Slaydni bosish — play/pauza (odatiy video kabi). */}
      <div onClick={() => p.supported && p.toggle()} className="flex min-h-[300px] cursor-pointer select-none flex-col gap-4 p-5 sm:aspect-video sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Lesson {number} · slide {p.index + 1}/{slides.length}</p>
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-4xl">{s.title}</h3>
          <ul className="mt-5 space-y-2.5 sm:mt-7">
            {s.points.map((pt, i) => (
              <li key={`${p.index}-${i}`} className={`flex gap-3 text-[15px] leading-snug transition-opacity duration-500 sm:text-xl ${i < shownPoints ? "opacity-100" : "opacity-0"}`}>
                <span className="mt-2 size-2 shrink-0 rounded-full bg-[#9fd3b8]" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
        {sentence && <p className="rounded-xl bg-black/45 px-4 py-2 text-center text-sm leading-6 sm:text-base">{sentence}</p>}
      </div>

      <div className="space-y-2 px-3 pt-2 sm:px-4">
        <Timeline p={p} dark />
        {/* Slaydlar — istalganiga bir bosishda o'tish */}
        <div className="flex gap-1" role="group" aria-label="Slides">
          {slides.map((sl, i) => (
            <button key={i} type="button" onClick={() => p.goTo(i)} title={sl.title} aria-label={`Slide ${i + 1}: ${sl.title}`} aria-current={i === p.index ? "step" : undefined} className="group flex h-5 flex-1 items-center">
              <span className={`h-1.5 w-full rounded-full transition-colors ${i === p.index ? "bg-[#9fd3b8]" : i < p.index ? "bg-white/45" : "bg-white/15 group-hover:bg-white/30"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 p-2 sm:gap-2 sm:p-3">
        <button type="button" onClick={() => p.goTo(p.index - 1)} aria-label="Previous slide" className="grid size-10 place-items-center rounded-full hover:bg-white/10"><SkipBack className="size-5" /></button>
        <SkipButton p={p} delta={-10} dark />
        <button type="button" onClick={p.toggle} disabled={!p.supported} aria-label={p.playing ? "Pause" : "Play"} className="grid size-12 place-items-center rounded-full bg-white text-[#0f2a22] disabled:opacity-40">{p.playing ? <Pause className="size-5" /> : <Play className="size-5" />}</button>
        <SkipButton p={p} delta={10} dark />
        <button type="button" onClick={() => p.goTo(p.index + 1)} aria-label="Next slide" className="grid size-10 place-items-center rounded-full hover:bg-white/10"><SkipForward className="size-5" /></button>
        <div className="ml-auto flex items-center gap-1">
          <SpeedPicker p={p} dark />
          <button type="button" onClick={() => boxRef.current?.requestFullscreen?.()} aria-label="Full screen" className="grid size-9 place-items-center rounded-full hover:bg-white/10"><Maximize2 className="size-4" /></button>
        </div>
      </div>
      {!p.supported && <p className="px-4 pb-4 text-xs text-white/60">Your browser has no speech voice. You can still step through the slides.</p>}
      {p.failed && <p role="alert" className="px-4 pb-4 text-sm text-amber-200">The audio could not load. Check your connection and press Play again.</p>}
      {p.ended && <p className="px-4 pb-4 text-sm text-white/70">Lesson video finished — press Play to watch it again, or scroll down for the text and the test.</p>}
      {!p.playing && p.started && !p.ended && <p className="px-4 pb-3 text-xs text-white/50">Paused at {formatTime(p.current)} — press Play to continue from here. Keys: ← → skip 10 s, space pauses.</p>}
    </div>
  );
}

/** Butun darsni ovozda o'qib berish (audio dars) — vaqt chizig'i, ±10 s, istalgan bo'limga o'tish. */
export function ListenLesson({ lessonId, title, parts, audioBase, active = true, initial, sync, durations }: { lessonId: string; title: string; parts: { heading: string; text: string }[]; audioBase?: string; active?: boolean } & Resume) {
  const groups = useMemo(() => parts.map((pt) => [pt.heading + ".", ...splitSentences(pt.text)]), [parts]);
  const urls = useMemo(() => (audioBase ? parts.map((_, i) => `${audioBase}/p${i + 1}.mp3`) : undefined), [audioBase, parts]);
  const p = usePlaylist({ groups, urls, storageKey: `finora:pos:audio:${lessonId}`, active, title, initial, sync: sync ? { lessonId, kind: "audio" } : undefined, knownDurations: durations });

  return (
    <div tabIndex={0} onKeyDown={(e) => onPlayerKey(e, p)} className="rounded-3xl border border-[#13251f]/10 bg-white p-5 outline-none focus-visible:ring-4 focus-visible:ring-[#9fd3b8]/60">
      <div className="flex flex-wrap items-center gap-2">
        <SkipButton p={p} delta={-10} />
        <button type="button" disabled={!p.supported} onClick={p.toggle} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 font-semibold text-white disabled:opacity-40">
          {p.playing ? <><Pause className="size-4" />Pause</> : <><Play className="size-4" />{p.started ? "Continue listening" : "Listen to the lesson"}</>}
        </button>
        <SkipButton p={p} delta={10} />
        <div className="ml-auto"><SpeedPicker p={p} /></div>
      </div>
      <div className="mt-4"><Timeline p={p} /></div>
      {!p.playing && p.started && !p.ended && <p className="mt-2 text-xs text-[#65736d]">You stopped at {formatTime(p.current)} — press “Continue listening” to carry on from there.</p>}
      <ol className="mt-4 space-y-1 text-sm">
        {parts.map((pt, i) => (
          <li key={i}>
            <button type="button" onClick={() => p.goTo(i, true)} disabled={!p.supported} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left ${p.started && p.index === i ? "bg-[#e7ece6] font-semibold" : "hover:bg-[#f7f6f1]"}`}>
              <span>{/^\d/.test(pt.heading) ? pt.heading : `${i + 1}. ${pt.heading}`}</span>
              <span className="shrink-0 text-xs tabular-nums text-[#65736d]">{formatTime(p.offsets[i])}</span>
            </button>
          </li>
        ))}
      </ol>
      {!p.supported && <p className="mt-3 text-xs text-[#65736d]">Your browser has no speech voice. Try Chrome, Edge or Safari.</p>}
      {p.failed && <p role="alert" className="mt-3 text-sm text-amber-700">The audio could not load. Check your connection and press Play again.</p>}
    </div>
  );
}
