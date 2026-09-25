"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Flag, XCircle } from "lucide-react";
import { startMock, submitMock, type SubmitMockResult } from "@/app/actions/mock";
import type { ExamQuestion, ExamSpec } from "@/lib/exam";
import type { PublicQuestion } from "@/lib/exam-public";

const LETTERS = ["A", "B", "C", "D", "E"];

type Saved = { answers: (number | null)[]; flags: boolean[] };
export type MockResume = { attemptId: string; questions: PublicQuestion[]; startedAt: string; endsAt: number };

function formatClock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Rasmiy formatdagi mock. Savollarni server tanlaydi (startMock), javob kalitlari faqat topshirilgach keladi
 * (submitMock), vaqt serverda nazorat qilinadi. Tugallanmagan mock sahifaga qayta kirilganda davom etadi (resume).
 * Javoblar localStorage'da (urinish id'si bo'yicha) — sahifa yangilansa ham yo'qolmaydi.
 */
export function MockExam({ spec, seed, areaTitles, resume }: { spec: ExamSpec; seed: number; areaTitles: Record<string, string>; resume?: MockResume }) {
  const [attempt, setAttempt] = useState<MockResume | null>(resume ?? null);
  const questions = attempt?.questions ?? [];
  const storageKey = attempt ? `finora-mock-${attempt.attemptId}` : "";
  const [phase, setPhase] = useState<"intro" | "exam" | "result">(resume ? "exam" : "intro");
  const [extra, setExtra] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(() => {
    if (!resume) return [];
    try {
      const s = JSON.parse(localStorage.getItem(`finora-mock-${resume.attemptId}`) ?? "null") as Saved | null;
      if (s?.answers?.length === resume.questions.length) return s.answers;
    } catch {
      /* e'tiborsiz */
    }
    return resume.questions.map(() => null);
  });
  const [flags, setFlags] = useState<boolean[]>(() => {
    if (!resume) return [];
    try {
      const s = JSON.parse(localStorage.getItem(`finora-mock-${resume.attemptId}`) ?? "null") as Saved | null;
      if (s?.flags?.length === resume.questions.length) return s.flags;
    } catch {
      /* e'tiborsiz */
    }
    return resume.questions.map(() => false);
  });
  const [index, setIndex] = useState(0);
  const endsAt = attempt?.endsAt ?? 0;
  const startedAt = attempt?.startedAt ?? "";
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<SubmitMockResult | null>(null);
  const [startError, setStartError] = useState("");
  const [finishedAt, setFinishedAt] = useState(0);
  const [pending, startTransition] = useTransition();
  const [starting, startStarting] = useTransition();

  useEffect(() => {
    if (phase !== "exam" || !storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, flags } satisfies Saved));
    } catch {
      /* saqlab bo'lmasa ham imtihon davom etadi */
    }
  }, [phase, answers, flags, storageKey]);

  // Imtihon davomida sahifadan chiqishdan oldin ogohlantirish.
  useEffect(() => {
    if (phase !== "exam") return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  const finish = useCallback(() => {
    if (!attempt) return;
    setPhase("result");
    setConfirming(false);
    setFinishedAt(Date.now());
    startTransition(async () => {
      const res = await submitMock({ attemptId: attempt.attemptId, answers });
      setResult(res);
      if (res.ok) {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          /* e'tiborsiz */
        }
      }
    });
  }, [answers, attempt, storageKey]);

  // Taymer: har soniya yangilanadi; vaqt tugasa shu yerning o'zida topshiriladi.
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);
  useEffect(() => {
    if (phase !== "exam") return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (endsAt && t >= endsAt) finishRef.current();
    }, 1000);
    return () => clearInterval(id);
  }, [phase, endsAt]);

  const answered = answers.filter((a) => a !== null).length;

  if (phase === "intro") {
    const minutes = spec.minutes + (extra ? spec.extraMinutes : 0);
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Full mock exam</h2>
        <p className="mt-3 text-sm leading-6 text-[#65736d]">This mock follows the official {spec.title} format. Treat it like the real exam: no notes, no Guide, no breaks.</p>
        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{spec.questions}</span>multiple-choice questions</li>
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{minutes} min</span>time limit</li>
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{spec.passMark}/{spec.questions}</span>pass mark (50%)</li>
          <li className="rounded-2xl bg-[#f3f1eb] p-4"><span className="block text-2xl font-semibold">{spec.closedBook ? "Closed" : "Open"} book</span>{spec.closedBook ? "no PPP Guide allowed" : "your PPP Guide only"}</li>
        </ul>
        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-[#13251f]/10 p-4 text-sm">
          <input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} className="mt-1 size-4 accent-[#163e32]" />
          <span>
            <span className="font-semibold">English is not my first language (+{spec.extraMinutes} min)</span>
            <span className="mt-1 block text-[#65736d]">APMG gives non-native English speakers extra time. Practise with the time you will actually get.</span>
          </span>
        </label>
        {startError && <p className="mt-6 text-sm font-semibold text-red-700">{startError}</p>}
        <button
          type="button"
          disabled={starting}
          onClick={() =>
            startStarting(async () => {
              setStartError("");
              const r = await startMock({ exam: spec.slug, seed, extra });
              if (!r.ok) return setStartError(r.error);
              setAttempt({ attemptId: r.attemptId, questions: r.questions, startedAt: r.startedAt, endsAt: r.endsAt });
              setAnswers(r.questions.map(() => null));
              setFlags(r.questions.map(() => false));
              setNow(Date.now());
              setPhase("exam");
            })
          }
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white hover:bg-[#0e3026] disabled:opacity-60"
        >
          {starting ? "Preparing your mock…" : "Start the exam"} <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  if (phase === "result") {
    if (!result || !result.ok) {
      return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-10">
          {pending || !result ? (
            <p className="text-lg font-semibold">Marking your paper…</p>
          ) : (
            <>
              <p className="font-semibold text-red-700">Could not submit: {result.error}</p>
              <p className="mt-1 text-sm text-[#65736d]">Your answers are kept on this device.</p>
              <button type="button" onClick={finish} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#163e32] px-5 font-semibold text-white">Try again</button>
            </>
          )}
        </div>
      );
    }
    const pass = result.passed;
    const took = startedAt && finishedAt ? formatClock(finishedAt - new Date(startedAt).getTime()) : null;
    const reviewById = new Map(result.review.map((r) => [r.id, r]));
    return (
      <div className="space-y-8">
        <section className={`rounded-3xl p-6 sm:p-10 ${pass ? "bg-[#163e32] text-white" : "border border-[#13251f]/10 bg-white"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Result</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">{result.correct}/{result.total}</p>
          <p className="mt-2 text-lg font-medium">{pass ? "Pass — well done." : result.late ? "Submitted after the time limit, so it does not count as a pass." : `Not yet — you need ${spec.passMark} to pass.`}</p>
          <p className="mt-2 text-sm opacity-80">
            {Math.round((result.correct / result.total) * 100)}% correct{took ? ` · time used ${took}` : ""} · saved to your results
          </p>
          <p className="mt-4 max-w-xl text-sm opacity-80">Aim for 70% or more across several mocks before you book: the real exam has new questions and real pressure.</p>
        </section>

        <section className="rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold">Score by area</h3>
          <ul className="mt-5 space-y-4">
            {Object.entries(result.areas).map(([area, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <li key={area}>
                  <div className="flex justify-between text-sm"><span>{areaTitles[area] ?? area}</span><span className="font-semibold">{s.correct}/{s.total}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9ebe7]"><div style={{ width: `${pct}%` }} className={`h-full rounded-full ${pct >= 70 ? "bg-[#28634f]" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} /></div>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold">Review every question</h3>
          <ol className="mt-5 space-y-4">
            {questions.map((q, i) => {
              const r = reviewById.get(q.id);
              return r ? <ReviewItem key={q.id} n={i + 1} q={{ ...q, answer: r.answer, rationale: r.rationale }} chosen={answers[i] ?? null} /> : null;
            })}
          </ol>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href={`/exam/${spec.slug}/mock`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white">Take another mock</Link>
          <Link href={`/exam/${spec.slug}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#13251f]/15 bg-white px-6 font-semibold">Back to {spec.title}</Link>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const remaining = endsAt - now;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">Question {index + 1} of {questions.length}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono font-semibold ${remaining < 5 * 60_000 ? "bg-red-50 text-red-700" : "bg-[#f3f1eb]"}`} aria-live="off"><Clock3 className="size-4" />{formatClock(remaining)}</span>
        </div>
        <p className="mt-6 whitespace-pre-line text-lg leading-8">{q.stem}</p>
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">Answer options</legend>
          {q.options.map((opt, oi) => {
            const selected = answers[index] === oi;
            return (
              <label key={oi} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-[15px] leading-6 transition-colors ${selected ? "border-[#163e32] bg-[#e7ece6]" : "border-[#13251f]/12 hover:bg-[#f7f6f1]"}`}>
                <input type="radio" name={`q-${q.id}`} checked={selected} onChange={() => setAnswers((a) => a.map((v, i) => (i === index ? oi : v)))} className="sr-only" />
                <span className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${selected ? "bg-[#163e32] text-white" : "bg-[#f3f1eb]"}`}>{LETTERS[oi]}</span>
                <span className="pt-0.5">{opt}</span>
              </label>
            );
          })}
        </fieldset>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setFlags((f) => f.map((v, i) => (i === index ? !v : v)))} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${flags[index] ? "border-amber-400 bg-amber-50 text-amber-800" : "border-[#13251f]/15"}`}>
            <Flag className="size-4" />{flags[index] ? "Flagged" : "Flag for review"}
          </button>
          <div className="flex gap-2">
            <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#13251f]/15 px-4 text-sm font-semibold disabled:opacity-40"><ArrowLeft className="size-4" />Back</button>
            {index < questions.length - 1 ? (
              <button type="button" onClick={() => setIndex((i) => i + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-4 text-sm font-semibold text-white">Next<ArrowRight className="size-4" /></button>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-4 text-sm font-semibold text-white">Finish</button>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-[#13251f]/10 bg-white p-5">
          <p className="text-sm font-semibold">{answered}/{questions.length} answered</p>
          <div className="mt-4 grid grid-cols-8 gap-1.5 lg:grid-cols-6">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Question ${i + 1}${answers[i] !== null ? ", answered" : ""}${flags[i] ? ", flagged" : ""}`}
                className={`relative grid h-9 place-items-center rounded-lg text-xs font-semibold ${i === index ? "ring-2 ring-[#163e32]" : ""} ${answers[i] !== null ? "bg-[#163e32] text-white" : "bg-[#f3f1eb]"}`}
              >
                {i + 1}
                {flags[i] && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-500" />}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => setConfirming(true)} className="w-full rounded-xl border border-[#13251f]/15 bg-white px-4 py-3 text-sm font-semibold">Finish and submit</button>
        {confirming && (
          <div role="alertdialog" aria-labelledby="confirm-title" className="rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm">
            <p id="confirm-title" className="font-semibold">Submit your answers?</p>
            <p className="mt-2 text-[#65736d]">
              {questions.length - answered > 0 ? `${questions.length - answered} unanswered — there is no penalty for guessing, so answer every question.` : "All questions answered."}
              {flags.some(Boolean) ? ` ${flags.filter(Boolean).length} flagged.` : ""}
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={finish} className="rounded-xl bg-[#163e32] px-4 py-2 font-semibold text-white">Submit</button>
              <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border border-[#13251f]/15 bg-white px-4 py-2 font-semibold">Keep going</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export function ReviewItem({ n, q, chosen }: { n: number; q: ExamQuestion; chosen: number | null }) {
  const ok = chosen === q.answer;
  return (
    <li className="rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {ok ? <CheckCircle2 className="mt-1 size-5 shrink-0 text-[#28634f]" aria-label="Correct" /> : <XCircle className="mt-1 size-5 shrink-0 text-red-600" aria-label="Incorrect" />}
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-line font-medium leading-7">{n}. {q.stem}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {q.options.map((opt, oi) => (
              <li key={oi} className={`rounded-xl p-3 ${oi === q.answer ? "bg-[#e7ece6]" : oi === chosen ? "bg-red-50" : "bg-[#f7f6f1]"}`}>
                <p><span className="font-semibold">{LETTERS[oi]}.</span> {opt}{oi === chosen ? <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-[#65736d]">your answer</span> : null}</p>
                <p className="mt-1 text-[#52665e]">{q.rationale[oi]}</p>
              </li>
            ))}
          </ul>
          {chosen === null && <p className="mt-3 text-sm font-medium text-amber-700">Not answered.</p>}
          <p className="mt-3 text-xs text-[#65736d]">Source: {q.ref} · PPP Guide 2026</p>
        </div>
      </div>
    </li>
  );
}
