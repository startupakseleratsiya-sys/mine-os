import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";
import { GUIDE_EDITION } from "@/content/exam";
import type { ScenarioExam } from "@/content/exam/scenario";
import { getExamHistory } from "@/lib/exam-data";
import { readiness } from "@/lib/exam";
import { flattenLines, lineKey } from "@/lib/scenario";
import { formatDate } from "@/lib/utils";

const STATUS = {
  ready: { label: "Ready to book the exam", tone: "bg-[#163e32] text-white", tip: "Your recent accuracy is 70% or more in every syllabus area. Keep one full paper a week until exam day." },
  almost: { label: "Almost ready", tone: "bg-amber-50 text-amber-900 border border-amber-200", tip: "You would probably pass today, but with little margin. Practise the weakest area below, then sit a full paper under time." },
  "not-ready": { label: "Keep practising", tone: "bg-red-50 text-red-900 border border-red-200", tip: "Work through one question at a time and read every explanation. Re-read the Guide sections they cite." },
  "not-enough-data": { label: "Not enough data yet", tone: "bg-white border border-[#13251f]/10", tip: "Answer at least one full question (20 lines) in every syllabus area to get a reliable readiness score." },
} as const;

const TECHNIQUE = [
  ["Read the scenario first", "Spend about 5 minutes on the scenario, then about 35 minutes per question. Leave 5 minutes spare."],
  ["Use extra facts only where told", "Additional information belongs to one question only. If a part does not mention the scenario, answer from the question alone."],
  ["should / must / will", "“Should” asks you to judge good practice for this scenario; “must” is mandatory; “will” and “is” state facts."],
  ["“True statements”", "When a part says the statements are true, do not test their truth — only decide where each one belongs."],
  ["Multiple response", "Always select exactly 2. One or three selections score zero, even if one is right."],
  ["Open book, closed clock", "Check the Guide once or twice for a specific point. More than that costs marks through time."],
] as const;

export async function ScenarioLevelPage({ exam, userId, courseSlug }: { exam: ScenarioExam; userId: string; courseSlug: string }) {
  const { spec, papers } = exam;
  const history = await getExamHistory(userId, `cp3p-${spec.slug}`);
  const allLines = papers.flatMap((p) => flattenLines(p).map((l) => ({ id: lineKey(p.id, l.line.id), area: l.question.area })));
  const pseudoSpec = { questions: spec.marks, passMark: spec.passMark, areas: spec.areas.map((a) => ({ ...a, mockCount: spec.marks / spec.areas.length })) };
  const ready = readiness(pseudoSpec, allLines, history.answers, 40, 10);
  const status = STATUS[ready.status];
  const mocks = history.attempts.filter((a) => a.mode === "mock");
  const lastByLine = new Map<string, boolean>();
  for (const a of history.answers) if (!lastByLine.has(a.question_id)) lastByLine.set(a.question_id, a.correct);

  return (
    <SectionShell
      eyebrow={`CP3P · ${GUIDE_EDITION}`}
      title={`${spec.title} exam prep`}
      description={`Scenario-based papers in the official format: 4 questions × 20 marks, ${spec.minutes} minutes (+${spec.extraMinutes} for non-native speakers), open book, pass mark ${spec.passMark}/${spec.marks}. Practise one question at a time, then sit full papers under time.`}
    >
      {!history.storageReady && (
        <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Results storage is being set up — you can practise, but scores are not saved yet.</p>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className={`rounded-3xl p-6 sm:p-8 ${status.tone}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Readiness</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{status.label}</p>
          {ready.predicted !== null && <p className="mt-2 text-lg">Predicted score: {Math.round(ready.predicted * spec.marks)}/{spec.marks} ({Math.round(ready.predicted * 100)}%)</p>}
          <p className="mt-4 max-w-md text-sm opacity-80">{status.tip}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {ready.perArea.map((a) => (
              <li key={a.id} className="rounded-2xl bg-black/5 px-3 py-2 text-sm">
                <span className="font-semibold">{a.id}</span> {a.accuracy === null ? <span className="opacity-70">— not started</span> : <span>{Math.round(a.accuracy * 100)}% <span className="opacity-70">({a.answered} lines)</span></span>}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-semibold"><Timer className="size-4" />How to pass the scenario exam</p>
          <dl className="mt-4 space-y-3 text-sm">
            {TECHNIQUE.map(([t, d]) => (
              <div key={t}><dt className="font-semibold">{t}</dt><dd className="text-[#65736d]">{d}</dd></div>
            ))}
          </dl>
          <Link href={`/courses/${courseSlug}`} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#163e32] hover:underline">Study the chapters first<ArrowRight className="size-4" /></Link>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Practice papers</h2>
        <p className="mt-2 text-sm text-[#65736d]">Each paper has its own scenario. Start with single questions (instant explanations), then sit an unseen paper as a full timed mock.</p>
        <ul className="mt-6 space-y-5">
          {papers.map((p) => {
            const keys = flattenLines(p).map((l) => lineKey(p.id, l.line.id));
            const done = keys.filter((k) => lastByLine.has(k));
            const right = done.filter((k) => lastByLine.get(k)).length;
            return (
              <li key={p.id} className="rounded-3xl border border-[#13251f]/10 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">{p.sector}</p>
                    <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-[#65736d]">{done.length ? `${done.length}/80 lines attempted · ${Math.round((right / done.length) * 100)}% correct on last attempt` : "Not attempted yet — keep one paper unseen for a full mock."}</p>
                  </div>
                  <Link href={`/exam/${spec.slug}/paper/${p.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#163e32] px-5 text-sm font-semibold text-white hover:bg-[#0e3026]">Full mock · {spec.minutes} min<ArrowRight className="size-4" /></Link>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {p.questions.map((q) => (
                    <Link key={q.number} href={`/exam/${spec.slug}/paper/${p.id}?q=${q.number}`} className="rounded-2xl border border-[#13251f]/10 p-3 text-sm hover:bg-[#f7f6f1]">
                      <span className="block text-xs font-semibold text-[#527264]">Practise Q{q.number} · {q.area}</span>
                      <span className="mt-0.5 block font-medium">{q.title}</span>
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Mock history</h2>
        {mocks.length === 0 ? (
          <p className="mt-3 text-sm text-[#65736d]">No full papers yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-3xl border border-[#13251f]/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#13251f]/10 text-[#65736d]"><tr><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Score</th><th className="px-5 py-3 font-medium">Result</th><th className="px-5 py-3 font-medium">By area</th><th className="px-5 py-3 font-medium">Time used</th></tr></thead>
              <tbody>
                {mocks.slice(0, 10).map((a) => (
                  <tr key={a.id} className="border-b border-[#13251f]/5 last:border-0">
                    <td className="px-5 py-3">{formatDate(a.finished_at)}</td>
                    <td className="px-5 py-3 font-semibold">{a.score}/{a.total}</td>
                    <td className="px-5 py-3">{a.passed ? <span className="font-semibold text-[#28634f]">Pass</span> : <span className="font-semibold text-red-700">Fail</span>}</td>
                    <td className="px-5 py-3 text-[#65736d]">{Object.entries(a.area_scores ?? {}).map(([k, v]) => `${k} ${v.correct}/${v.total}`).join(" · ")}</td>
                    <td className="px-5 py-3">{a.duration_seconds ? `${Math.round(a.duration_seconds / 60)} min` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="mt-10 max-w-3xl text-xs leading-5 text-[#65736d]">Papers are original Finora practice material written from the PPP Guide 2026 (© AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group, CC BY 3.0 IGO). Scenarios, countries and organisations are fictional. Not official APMG questions; Finora is not affiliated with APMG International.</p>
    </SectionShell>
  );
}
