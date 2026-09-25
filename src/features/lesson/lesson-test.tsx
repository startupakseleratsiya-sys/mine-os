"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, LoaderCircle, RotateCcw, Star, Trophy, XCircle } from "lucide-react";
import { checkAnswer, finishTest, startTest, type TestResult } from "@/app/actions/progress";
import type { PublicItem } from "@/lib/learning-path";
import { XP, starsFor } from "@/lib/gamification";
import { Confetti } from "./confetti";

const LETTERS = ["A", "B", "C", "D"];

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0;
  return h || 1;
}

function shuffle<T>(a: T[], seed: number) {
  const out = [...a];
  let s = seed >>> 0 || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type Feedback = { chosen: number; correct: boolean; answer: number; explanation: string };
type Session = { attemptId: string; items: PublicItem[]; idx: number; fb: Record<string, Feedback>; streak: number };

/**
 * Test (dars testi yoki xatolar takrori). Server urinish ochadi; har savolga birinchi javob yakuniy;
 * ball serverda bazadagi javoblardan hisoblanadi. Tartib har urinishda tasodifiy (urinish id'sidan).
 * Holat localStorage'da — sahifa yangilansa yoki «Re-read» bosilsa ham shu joydan davom etadi.
 */
export function LessonTest({ mode = "lesson", courseSlug, lessonId, passMark, nextHref, finalHref, onRestudy }: {
  mode?: "lesson" | "review";
  courseSlug: string;
  lessonId?: string;
  passMark: number;
  nextHref?: string | null;
  finalHref?: string;
  onRestudy?: () => void;
}) {
  const storeKey = `finora-test-${courseSlug}-${mode === "lesson" ? lessonId : "review"}`;
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      const s = raw ? (JSON.parse(raw) as Session) : null;
      return s?.attemptId && Array.isArray(s.items) && s.items.length ? s : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [checking, startCheck] = useTransition();
  const [pending, startTransition] = useTransition();
  const [starting, startStarting] = useTransition();

  const save = useCallback((s: Session | null) => {
    try {
      if (s) localStorage.setItem(storeKey, JSON.stringify(s));
      else localStorage.removeItem(storeKey);
    } catch {
      /* saqlab bo'lmasa ham test davom etadi */
    }
  }, [storeKey]);

  const begin = useCallback(() => {
    setError("");
    setResult(null);
    startStarting(async () => {
      const r = await startTest({ courseSlug, lessonId, kind: mode });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      const s = { attemptId: r.attemptId, items: r.items, idx: 0, fb: {}, streak: 0 };
      save(s);
      setSession(s);
    });
  }, [courseSlug, lessonId, mode, save]);

  // Saqlangan urinish bo'lmasa — yangisini ochamiz (komponent faqat «Start» bosilganda mount bo'ladi).
  const autoStarted = useRef(false);
  useEffect(() => {
    if (session || autoStarted.current) return;
    autoStarted.current = true;
    begin();
  }, [session, begin]);

  const update = (patch: Partial<Session>) =>
    setSession((s) => {
      if (!s) return s;
      const next = { ...s, ...patch };
      save(next);
      return next;
    });

  const order = useMemo(() => {
    if (!session) return [];
    const seed = hash(session.attemptId);
    return shuffle(session.items.map((_, i) => i), seed).map((i) => ({ item: session.items[i], opts: shuffle([0, 1, 2, 3], seed + i * 7919) }));
  }, [session]);

  if (!session) {
    return (
      <div className="rounded-3xl border border-[#13251f]/10 bg-white p-6 text-sm">
        {starting || !error ? (
          <p className="inline-flex items-center gap-2 text-[#65736d]"><LoaderCircle className="size-4 animate-spin" />Preparing your test…</p>
        ) : (
          <>
            <p className="font-semibold text-red-700">{error}</p>
            <button type="button" onClick={begin} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 font-semibold text-white"><RotateCcw className="size-4" />Try again</button>
          </>
        )}
      </div>
    );
  }

  const { idx, fb, streak } = session;
  const cur = order[Math.min(idx, order.length - 1)];
  const f = cur ? fb[cur.item.key] : undefined;
  const correctSoFar = Object.values(fb).filter((x) => x.correct).length;
  const answeredCount = Object.keys(fb).length;

  const choose = (orig: number) => {
    if (f || checking) return;
    setError("");
    startCheck(async () => {
      const r = await checkAnswer({ attemptId: session.attemptId, key: cur.item.key, chosen: orig });
      if (r.ok) {
        const entry = { chosen: r.chosen, correct: r.correct, answer: r.answer, explanation: r.explanation };
        update({ fb: { ...fb, [cur.item.key]: entry }, streak: r.correct ? streak + 1 : 0 });
      } else setError(r.error);
    });
  };

  const submit = () => {
    if (pending) return;
    startTransition(async () => {
      const r = await finishTest({ attemptId: session.attemptId });
      if (r.ok) save(null);
      setResult(r);
    });
  };

  const restart = () => {
    save(null);
    setSession(null);
    autoStarted.current = true;
    begin();
  };

  if (result) {
    if (!result.ok) {
      return (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-sm">
          <p className="font-semibold">Could not check the test: {result.error}</p>
          <p className="mt-1 text-[#65736d]">Your answers are kept.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setResult(null)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 font-semibold text-white">Try again</button>
            <Link href={`/sign-in?next=${encodeURIComponent(lessonId ? `/study/${courseSlug}/${lessonId}` : `/courses/${courseSlug}/review`)}`} className="inline-flex min-h-11 items-center rounded-xl border border-[#13251f]/15 bg-white px-5 font-semibold">Sign in again</Link>
          </div>
        </div>
      );
    }
    if (mode === "review") {
      return (
        <div className="relative overflow-hidden rounded-3xl bg-[#163e32] p-6 text-white sm:p-10">
          {result.correct === result.total && <Confetti />}
          <Trophy className="size-10 text-amber-300" />
          <p className="mt-4 text-5xl font-semibold">{result.correct}/{result.total}</p>
          <p className="mt-2 text-lg font-medium">{result.correct === result.total ? "All fixed — these questions leave your mistakes list." : "Correct ones leave your list; the rest will come back next time."}</p>
          <Link href={`/courses/${courseSlug}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#163e32]">Back to the course<ArrowRight className="size-4" /></Link>
        </div>
      );
    }
    const pct = Math.round((result.correct / Math.max(result.total, 1)) * 100);
    const stars = starsFor(result.correct, result.total);
    const xp = result.correct * XP.question + (result.passed ? XP.lesson : 0);
    return (
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 ${result.passed ? "bg-[#163e32] text-white" : "border border-red-200 bg-red-50"}`}>
        {result.passed && <Confetti />}
        {result.passed ? <Trophy className="size-10 text-amber-300" /> : <XCircle className="size-10 text-red-600" />}
        {result.passed && (
          <p className="mt-4 flex gap-1" aria-label={`${stars} of 3 stars`}>
            {[1, 2, 3].map((n) => <Star key={n} className={`size-8 ${n <= stars ? "fill-amber-300 text-amber-300" : "text-white/30"}`} />)}
          </p>
        )}
        <p className="mt-4 text-5xl font-semibold">{result.correct}/{result.total}</p>
        <p className="mt-2 text-lg font-medium">{result.passed ? "Passed — the next lesson is unlocked." : `Not yet. You need ${result.passMark}/${result.total}.`}</p>
        <p className="mt-1 text-sm opacity-80">{pct}% correct{result.answered < result.total ? ` · ${result.total - result.answered} unanswered` : ""}{result.passed && !result.saved ? " · progress could not be saved, please retry" : ""}</p>
        <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${result.passed ? "bg-white/15" : "bg-white text-[#163e32]"}`}>+{xp} XP</p>
        {!result.passed && <p className="mt-4 max-w-lg text-sm text-[#52665e]">Re-read the sections behind the questions you missed (the explanations point to them), then take the test again. The order changes every time, and missed questions also wait for you in “Review my mistakes”.</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {result.passed ? (
            <Link href={nextHref ?? finalHref ?? `/courses/${courseSlug}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#163e32]">{nextHref ? "Next lesson" : "Go to the final exam"}<ArrowRight className="size-4" /></Link>
          ) : (
            <>
              {onRestudy && <button type="button" onClick={onRestudy} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Re-read the lesson</button>}
              <button type="button" onClick={restart} disabled={starting} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#13251f]/15 bg-white px-6 font-semibold disabled:opacity-60"><RotateCcw className="size-4" />Retry the test</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!cur) return null;
  const last = idx >= order.length - 1;
  return (
    <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold">Question {idx + 1} of {order.length}</span>
        <span className="flex items-center gap-3 text-[#65736d]">
          {streak >= 3 && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800"><Flame className="size-3.5" />{streak} in a row</span>}
          {correctSoFar} correct{mode === "lesson" ? ` · pass ${passMark}` : ""}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9ebe7]"><div className="h-full rounded-full bg-[#28634f] transition-all" style={{ width: `${(answeredCount / order.length) * 100}%` }} /></div>
      <p className="mt-6 whitespace-pre-line text-lg leading-8" data-testid="question">{cur.item.question}</p>
      <div className="mt-5 space-y-2.5">
        {cur.opts.map((orig, pos) => {
          const isKey = f && orig === f.answer;
          const isChosen = f?.chosen === orig;
          const tone = !f ? "border-[#13251f]/12 hover:bg-[#f7f6f1]" : isKey ? "border-[#28634f]/50 bg-[#e7ece6]" : isChosen ? "border-red-300 bg-red-50" : "border-[#13251f]/8 opacity-70";
          return (
            <button key={orig} type="button" disabled={Boolean(f) || checking} onClick={() => choose(orig)} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-[15px] leading-6 ${tone}`}>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f3f1eb] text-sm font-semibold">{LETTERS[pos]}</span>
              <span className="pt-0.5">{cur.item.options[orig]}</span>
            </button>
          );
        })}
      </div>
      {checking && <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#65736d]"><LoaderCircle className="size-4 animate-spin" />Checking…</p>}
      {error && (
        <div className="mt-4 text-sm">
          <p className="font-semibold text-red-700">{error}</p>
          {/expired|finished/.test(error) && <button type="button" onClick={restart} className="mt-2 font-semibold underline">Start the test again</button>}
        </div>
      )}
      {f && (
        <div className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${f.correct ? "bg-[#f3f7f3]" : "bg-red-50/60"}`}>
          <p className="flex items-center gap-1.5 font-semibold">{f.correct ? <CheckCircle2 className="size-4 text-[#28634f]" /> : <XCircle className="size-4 text-red-600" />}{f.correct ? "Correct" : "Not quite"}</p>
          <p className="mt-1 text-[#52665e]">{f.explanation}</p>
        </div>
      )}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" disabled={idx === 0} onClick={() => update({ idx: idx - 1 })} className="min-h-11 rounded-xl px-3 text-sm font-semibold text-[#65736d] disabled:opacity-0">← Previous</button>
        {f && (last ? (
          <button type="button" onClick={submit} disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white disabled:opacity-60">{pending ? "Checking…" : "See my result"}</button>
        ) : (
          <button type="button" onClick={() => update({ idx: idx + 1 })} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Next question<ArrowRight className="size-4" /></button>
        ))}
      </div>
    </div>
  );
}
