"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { saveExamAttempt } from "@/app/actions/exam";
import type { ExamQuestion, ExamSpec } from "@/lib/exam";

const LETTERS = ["A", "B", "C", "D", "E"];

/** Mashq: bittadan savol, darhol javob va har bir variant izohi (retrieval practice + zudlik bilan feedback). */
export function Practice({ spec, questions, title }: { spec: ExamSpec; questions: ExamQuestion[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<(number | null)[]>(() => questions.map(() => null));
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();

  const answeredCount = chosen.filter((c) => c !== null).length;
  const correctCount = chosen.filter((c, i) => c === questions[i].answer).length;

  function finish() {
    setDone(true);
    const items = questions.map((q, i) => ({ questionId: q.id, chosen: chosen[i] })).filter((it) => it.chosen !== null);
    if (!items.length) return;
    startTransition(async () => {
      const res = await saveExamAttempt({ exam: spec.slug, mode: "practice", items });
      setSaved(res.ok ? "saved" : "error");
    });
  }

  if (!questions.length) {
    return <p className="rounded-3xl border border-[#13251f]/10 bg-white p-6 text-sm">No questions in this area yet.</p>;
  }

  if (done) {
    const pct = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
    return (
      <div className="rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">Practice complete</p>
        <p className="mt-3 text-5xl font-semibold">{correctCount}/{answeredCount}</p>
        <p className="mt-2 text-[#65736d]">{pct}% correct in {title}{pending ? " · saving…" : saved === "saved" ? " · saved to your results" : saved === "error" ? " · could not save" : ""}</p>
        <p className="mt-4 max-w-xl text-sm text-[#65736d]">{pct >= 70 ? "Strong. Mix this area into a full mock next." : "Re-read the Guide sections cited in the explanations, then practise this area again tomorrow — spacing your practice makes it stick."}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/exam/${spec.slug}`} className="inline-flex min-h-12 items-center rounded-xl bg-[#163e32] px-6 font-semibold text-white">Back to {spec.title}</Link>
          <Link href={`/exam/${spec.slug}/mock`} className="inline-flex min-h-12 items-center rounded-xl border border-[#13251f]/15 px-6 font-semibold">Take a full mock</Link>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const answer = chosen[index];
  const revealed = answer !== null;
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-[#13251f]/10 bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{title} · {index + 1}/{questions.length}</span>
        <span className="text-[#65736d]">{correctCount}/{answeredCount} correct</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9ebe7]"><div style={{ width: `${((index + (revealed ? 1 : 0)) / questions.length) * 100}%` }} className="h-full rounded-full bg-[#28634f]" /></div>
      <p className="mt-6 whitespace-pre-line text-lg leading-8">{q.stem}</p>
      <ul className="mt-6 space-y-3">
        {q.options.map((opt, oi) => {
          const isAnswer = oi === q.answer;
          const isChosen = oi === answer;
          const tone = !revealed ? "border-[#13251f]/12 hover:bg-[#f7f6f1]" : isAnswer ? "border-[#28634f] bg-[#e7ece6]" : isChosen ? "border-red-300 bg-red-50" : "border-[#13251f]/10 opacity-70";
          return (
            <li key={oi}>
              <button type="button" disabled={revealed} onClick={() => setChosen((c) => c.map((v, i) => (i === index ? oi : v)))} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left text-[15px] leading-6 ${tone}`}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f3f1eb] text-sm font-semibold">{LETTERS[oi]}</span>
                <span className="pt-0.5">
                  {opt}
                  {revealed && (isAnswer || isChosen) && <span className="mt-2 block text-sm text-[#52665e]">{q.rationale[oi]}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className={`inline-flex items-center gap-2 text-sm font-semibold ${answer === q.answer ? "text-[#28634f]" : "text-red-700"}`}>
            {answer === q.answer ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {answer === q.answer ? "Correct" : "Incorrect"} · <span className="font-normal text-[#65736d]">{q.ref}</span>
          </p>
          {index < questions.length - 1 ? (
            <button type="button" onClick={() => setIndex((i) => i + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 text-sm font-semibold text-white">Next question<ArrowRight className="size-4" /></button>
          ) : (
            <button type="button" onClick={finish} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 text-sm font-semibold text-white">See my score</button>
          )}
        </div>
      )}
      {!revealed && answeredCount > 0 && (
        <button type="button" onClick={finish} className="mt-6 text-sm font-semibold text-[#65736d] underline underline-offset-4">End practice now</button>
      )}
    </div>
  );
}
