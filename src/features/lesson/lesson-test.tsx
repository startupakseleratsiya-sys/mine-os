"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, RotateCcw, Trophy, XCircle } from "lucide-react";
import { checkAnswer, finishReview, submitLessonTest, type TestResult } from "@/app/actions/progress";
import type { PublicItem } from "@/lib/learning-path";

const LETTERS = ["A", "B", "C", "D"];

function shuffle<T>(a: T[], seed: number) {
  const out = [...a];
  let s = seed >>> 0 || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type Feedback = { chosen: number; correct: boolean; answer: number; explanation: string };

/**
 * Test: bittadan savol; javob serverda tekshiriladi va darhol izoh chiqadi (retrieval practice + feedback).
 * Kalitlar brauzerga oldindan yuborilmaydi. Har urinishda savollar va variantlar tartibi aralashtiriladi.
 * mode="lesson": ≥80% → keyingi dars ochiladi. mode="review": xatolar daftari.
 */
export function LessonTest({ mode = "lesson", courseSlug, lessonId, items, passMark, nextHref, finalHref, onRestudy }: {
  mode?: "lesson" | "review";
  courseSlug: string;
  lessonId?: string;
  items: PublicItem[];
  passMark: number;
  nextHref?: string | null;
  finalHref?: string;
  onRestudy?: () => void;
}) {
  const [attempt, setAttempt] = useState(1);
  const order = useMemo(() => shuffle(items.map((_, i) => i), attempt * 7919).map((i) => ({ item: items[i], opts: shuffle([0, 1, 2, 3], attempt * 31 + i) })), [items, attempt]);
  const [idx, setIdx] = useState(0);
  const [fb, setFb] = useState<Record<string, Feedback>>({});
  const [error, setError] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [checking, startCheck] = useTransition();
  const [pending, startTransition] = useTransition();

  const cur = order[idx];
  const f = cur ? fb[cur.item.key] : undefined;
  const correctSoFar = Object.values(fb).filter((x) => x.correct).length;

  const choose = (orig: number) => {
    if (f || checking) return;
    setError("");
    startCheck(async () => {
      const r = await checkAnswer({ courseSlug, key: cur.item.key, chosen: orig });
      if (r.ok) setFb((m) => ({ ...m, [cur.item.key]: { chosen: orig, correct: r.correct, answer: r.answer, explanation: r.explanation } }));
      else setError(r.error);
    });
  };

  const submit = () =>
    startTransition(async () => {
      const answers = Object.fromEntries(Object.entries(fb).map(([k, v]) => [k, v.chosen]));
      setResult(mode === "lesson" && lessonId ? await submitLessonTest({ courseSlug, lessonId, answers }) : await finishReview({ courseSlug, answers }));
    });

  const retry = () => {
    setAttempt((a) => a + 1);
    setIdx(0);
    setFb({});
    setResult(null);
  };

  if (result) {
    if (!result.ok) return <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-sm font-semibold">Could not check the test: {result.error}</div>;
    const pct = Math.round((result.correct / Math.max(result.total, 1)) * 100);
    if (mode === "review") {
      return (
        <div className="rounded-3xl bg-[#163e32] p-6 text-white sm:p-10">
          <Trophy className="size-10" />
          <p className="mt-4 text-5xl font-semibold">{result.correct}/{result.total}</p>
          <p className="mt-2 text-lg font-medium">{result.correct === result.total ? "All fixed — these questions leave your mistakes list." : "Correct ones leave your list; the rest will come back next time."}</p>
          <Link href={`/courses/${courseSlug}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#163e32]">Back to the course<ArrowRight className="size-4" /></Link>
        </div>
      );
    }
    return (
      <div className={`rounded-3xl p-6 sm:p-10 ${result.passed ? "bg-[#163e32] text-white" : "border border-red-200 bg-red-50"}`}>
        {result.passed ? <Trophy className="size-10" /> : <XCircle className="size-10 text-red-600" />}
        <p className="mt-4 text-5xl font-semibold">{result.correct}/{result.total}</p>
        <p className="mt-2 text-lg font-medium">{result.passed ? "Passed — the next lesson is unlocked." : `Not yet. You need ${result.passMark}/${result.total} (80%).`}</p>
        <p className="mt-1 text-sm opacity-80">{pct}% correct{result.passed && !result.saved ? " · progress could not be saved, please retry" : ""}</p>
        {!result.passed && <p className="mt-4 max-w-lg text-sm text-[#52665e]">Re-read the sections behind the questions you missed (the explanations point to them), then take the test again. Questions and options are shuffled each time.</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {result.passed ? (
            <Link href={nextHref ?? finalHref ?? `/courses/${courseSlug}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#163e32]">{nextHref ? "Next lesson" : "Go to the final exam"}<ArrowRight className="size-4" /></Link>
          ) : (
            <>
              {onRestudy && <button type="button" onClick={onRestudy} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Re-read the lesson</button>}
              <button type="button" onClick={retry} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#13251f]/15 bg-white px-6 font-semibold"><RotateCcw className="size-4" />Retry the test</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!cur) return null;
  const last = idx === order.length - 1;
  return (
    <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold">Question {idx + 1} of {order.length}{cur.item.review ? <span className="ml-2 rounded-full bg-[#f3f1eb] px-2 py-0.5 text-xs font-semibold text-[#527264]">review from an earlier lesson</span> : null}</span>
        <span className="text-[#65736d]">{correctSoFar} correct{mode === "lesson" ? ` · pass ${passMark}` : ""}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9ebe7]"><div className="h-full rounded-full bg-[#28634f]" style={{ width: `${(idx / order.length) * 100}%` }} /></div>
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
      {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
      {f && (
        <div className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${f.correct ? "bg-[#f3f7f3]" : "bg-red-50/60"}`}>
          <p className="flex items-center gap-1.5 font-semibold">{f.correct ? <CheckCircle2 className="size-4 text-[#28634f]" /> : <XCircle className="size-4 text-red-600" />}{f.correct ? "Correct" : "Not quite"}</p>
          <p className="mt-1 text-[#52665e]">{f.explanation}</p>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        {f && (last ? (
          <button type="button" onClick={submit} disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white disabled:opacity-60">{pending ? "Checking…" : "See my result"}</button>
        ) : (
          <button type="button" onClick={() => setIdx((i) => i + 1)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Next question<ArrowRight className="size-4" /></button>
        ))}
      </div>
    </div>
  );
}
