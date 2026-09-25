"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { submitLessonTest, type TestResult } from "@/app/actions/progress";
import type { TestItem } from "@/content/courses";

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

/**
 * Dars testi: bittadan savol, javobdan keyin darhol izoh (retrieval practice + zudlik bilan feedback).
 * Har urinishda savollar va variantlar tartibi aralashtiriladi. ≥80% → keyingi dars ochiladi.
 */
export function LessonTest({ courseSlug, lessonId, items, passMark, nextHref, finalHref, signedIn, onRestudy }: {
  courseSlug: string;
  lessonId: string;
  items: TestItem[];
  passMark: number;
  nextHref: string | null;
  finalHref: string;
  signedIn: boolean;
  onRestudy: () => void;
}) {
  const [attempt, setAttempt] = useState(1);
  const order = useMemo(() => shuffle(items.map((_, i) => i), attempt * 7919).map((i) => ({ item: items[i], opts: shuffle([0, 1, 2, 3], attempt * 31 + i) })), [items, attempt]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [pending, startTransition] = useTransition();

  const cur = order[idx];
  const chosen = cur ? answers[cur.item.key] : undefined;
  const revealed = chosen !== undefined && chosen !== null;
  const correctSoFar = order.filter((o) => answers[o.item.key] === o.item.q.answer).length;

  const submit = () =>
    startTransition(async () => {
      setResult(await submitLessonTest({ courseSlug, lessonId, answers }));
    });

  const retry = () => {
    setAttempt((a) => a + 1);
    setIdx(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    if (!result.ok) {
      return (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-sm">
          <p className="font-semibold">Could not check the test: {result.error}</p>
          {!signedIn && <Link href="/sign-in" className="mt-3 inline-block font-semibold underline">Sign in</Link>}
        </div>
      );
    }
    const pct = Math.round((result.correct / result.total) * 100);
    return (
      <div className={`rounded-3xl p-6 sm:p-10 ${result.passed ? "bg-[#163e32] text-white" : "border border-red-200 bg-red-50"}`}>
        {result.passed ? <Trophy className="size-10" /> : <XCircle className="size-10 text-red-600" />}
        <p className="mt-4 text-5xl font-semibold">{result.correct}/{result.total}</p>
        <p className="mt-2 text-lg font-medium">{result.passed ? "Passed — the next lesson is unlocked." : `Not yet. You need ${result.passMark}/${result.total} (80%).`}</p>
        <p className="mt-1 text-sm opacity-80">{pct}% correct{result.passed && !result.saved ? " · progress could not be saved, please retry" : ""}</p>
        {!result.passed && <p className="mt-4 max-w-lg text-sm text-[#52665e]">Re-read the sections behind the questions you missed (the explanations point to them), then take the test again. Questions and options are shuffled each time.</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {result.passed ? (
            <Link href={nextHref ?? finalHref} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#163e32]">{nextHref ? "Next lesson" : "Go to the final exam"}<ArrowRight className="size-4" /></Link>
          ) : (
            <>
              <button type="button" onClick={onRestudy} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Re-read the lesson</button>
              <button type="button" onClick={retry} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#13251f]/15 bg-white px-6 font-semibold"><RotateCcw className="size-4" />Retry the test</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!cur) return null;
  const q = cur.item.q;
  const last = idx === order.length - 1;
  return (
    <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Question {idx + 1} of {order.length}{cur.item.review ? <span className="ml-2 rounded-full bg-[#f3f1eb] px-2 py-0.5 text-xs font-semibold text-[#527264]">review from an earlier lesson</span> : null}</span>
        <span className="text-[#65736d]">{correctSoFar} correct · pass {passMark}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9ebe7]"><div className="h-full rounded-full bg-[#28634f]" style={{ width: `${(idx / order.length) * 100}%` }} /></div>
      <p className="mt-6 whitespace-pre-line text-lg leading-8">{q.question}</p>
      <div className="mt-5 space-y-2.5">
        {cur.opts.map((orig, pos) => {
          const isKey = orig === q.answer;
          const isChosen = chosen === orig;
          const tone = !revealed ? "border-[#13251f]/12 hover:bg-[#f7f6f1]" : isKey ? "border-[#28634f]/50 bg-[#e7ece6]" : isChosen ? "border-red-300 bg-red-50" : "border-[#13251f]/8 opacity-70";
          return (
            <button key={orig} type="button" disabled={revealed} onClick={() => setAnswers((a) => ({ ...a, [cur.item.key]: orig }))} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-[15px] leading-6 ${tone}`}>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f3f1eb] text-sm font-semibold">{LETTERS[pos]}</span>
              <span className="pt-0.5">{q.options[orig]}</span>
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${chosen === q.answer ? "bg-[#f3f7f3]" : "bg-red-50/60"}`}>
          <p className="flex items-center gap-1.5 font-semibold">{chosen === q.answer ? <CheckCircle2 className="size-4 text-[#28634f]" /> : <XCircle className="size-4 text-red-600" />}{chosen === q.answer ? "Correct" : "Not quite"}</p>
          <p className="mt-1 text-[#52665e]">{q.explanation}</p>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        {revealed && (last ? (
          <button type="button" onClick={submit} disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white disabled:opacity-60">{pending ? "Checking…" : "See my result"}</button>
        ) : (
          <button type="button" onClick={() => setIdx((i) => i + 1)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Next question<ArrowRight className="size-4" /></button>
        ))}
      </div>
    </div>
  );
}
