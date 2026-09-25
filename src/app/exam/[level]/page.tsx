import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Timer } from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";
import { getExam, GUIDE_EDITION } from "@/content/exam";
import { getCurrentUser } from "@/services/user-service";
import { getExamHistory } from "@/lib/exam-data";
import { readiness } from "@/lib/exam";
import { formatDate } from "@/lib/utils";
import { getScenarioExam } from "@/content/exam/scenario";
import { ScenarioLevelPage } from "@/features/exam/scenario-level";

type Params = { params: Promise<{ level: string }> };

export async function generateMetadata({ params }: Params) {
  const { level } = await params;
  const spec = getExam(level)?.spec ?? getScenarioExam(level)?.spec;
  return { title: spec ? `${spec.title} prep` : "Exam not found" };
}

const STATUS = {
  ready: { label: "Ready to book the exam", tone: "bg-[#163e32] text-white", tip: "Your recent accuracy is 70% or more in every area. Keep one mock a week until exam day." },
  almost: { label: "Almost ready", tone: "bg-amber-50 text-amber-900 border border-amber-200", tip: "You would probably pass today, but with little margin. Practise your weakest areas below." },
  "not-ready": { label: "Keep practising", tone: "bg-red-50 text-red-900 border border-red-200", tip: "Focus on the weakest areas below, then take a full mock." },
  "not-enough-data": { label: "Not enough data yet", tone: "bg-white border border-[#13251f]/10", tip: "Answer at least 8 questions in every area (practice or mocks) to get a reliable readiness score." },
} as const;

export default async function ExamLevelPage({ params }: Params) {
  const { level } = await params;
  const scenario = getScenarioExam(level);
  const exam = getExam(level);
  if (!exam && !scenario) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/exam/${level}`);
  if (scenario) return <ScenarioLevelPage exam={scenario} userId={user.id} courseSlug={`cp3p-${level}`} />;
  if (!exam) notFound();
  const { spec, bank } = exam;
  const history = await getExamHistory(user.id, `cp3p-${spec.slug}`);
  const ready = readiness(spec, bank, history.answers);
  const status = STATUS[ready.status];
  const mocks = history.attempts.filter((a) => a.mode === "mock");

  return (
    <SectionShell eyebrow={`CP3P · ${GUIDE_EDITION}`} title={`${spec.title} exam prep`} description={`${spec.questions} multiple-choice questions in ${spec.minutes} minutes, ${spec.closedBook ? "closed book" : "open book"}, pass mark ${spec.passMark}/${spec.questions}. Practise by area, then prove it with timed mocks.`}>
      {!history.storageReady && (
        <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Results storage is being set up — you can practise, but scores are not saved yet.</p>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className={`rounded-3xl p-6 sm:p-8 ${status.tone}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Readiness</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{status.label}</p>
          {ready.predicted !== null && <p className="mt-2 text-lg">Predicted score: {Math.round(ready.predicted * spec.questions)}/{spec.questions} ({Math.round(ready.predicted * 100)}%)</p>}
          <p className="mt-4 max-w-md text-sm opacity-80">{status.tip}</p>
        </section>
        <section className="flex flex-col justify-between rounded-3xl border border-[#13251f]/10 bg-white p-6 sm:p-8">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold"><Timer className="size-4" />Full mock exam</p>
            <p className="mt-2 text-sm leading-6 text-[#65736d]">{spec.questions} new questions balanced across every area, {spec.minutes} minutes (+{spec.extraMinutes} if English is not your first language), scored like the real exam.</p>
          </div>
          <div className="mt-6 grid gap-2">
            <Link href={`/exam/${spec.slug}/mock`} className="inline-flex min-h-12 items-center justify-between rounded-xl bg-[#163e32] px-5 font-semibold text-white hover:bg-[#0e3026]">Start a mock<ArrowRight className="size-4" /></Link>
            <Link href="/exam/flashcards" className="inline-flex min-h-12 items-center justify-between rounded-xl border border-[#13251f]/15 px-5 font-semibold hover:bg-[#f7f6f1]">Glossary flashcards<ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Practise by area</h2>
        <p className="mt-2 text-sm text-[#65736d]">Short sets with instant feedback on every option. Weakest areas first.</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {[...ready.perArea]
            .sort((a, b) => (a.accuracy ?? -1) - (b.accuracy ?? -1))
            .map((area) => {
              const meta = spec.areas.find((a) => a.id === area.id)!;
              const count = bank.filter((q) => q.area === area.id).length;
              const pct = area.accuracy === null ? null : Math.round(area.accuracy * 100);
              return (
                <li key={area.id} className="flex flex-col rounded-3xl border border-[#13251f]/10 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{meta.title}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${pct === null ? "bg-[#f3f1eb] text-[#65736d]" : pct >= 70 ? "bg-[#e7ece6] text-[#28634f]" : pct >= 50 ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-700"}`}>{pct === null ? "new" : `${pct}%`}</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#65736d]">{meta.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[#65736d]">{count} questions · {area.answered} answered recently</span>
                    <Link href={`/exam/${spec.slug}/practice?area=${area.id}`} className="inline-flex items-center gap-1 font-semibold text-[#163e32] hover:underline">Practise<ArrowRight className="size-4" /></Link>
                  </div>
                </li>
              );
            })}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Mock history</h2>
        {mocks.length === 0 ? (
          <p className="mt-3 text-sm text-[#65736d]">No mocks yet. Take your first one when you have practised each area once.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-3xl border border-[#13251f]/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#13251f]/10 text-[#65736d]"><tr><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Score</th><th className="px-5 py-3 font-medium">Result</th><th className="px-5 py-3 font-medium">Time used</th></tr></thead>
              <tbody>
                {mocks.slice(0, 10).map((a) => (
                  <tr key={a.id} className="border-b border-[#13251f]/5 last:border-0">
                    <td className="px-5 py-3">{formatDate(a.finished_at)}</td>
                    <td className="px-5 py-3 font-semibold">{a.score}/{a.total}</td>
                    <td className="px-5 py-3">{a.passed ? <span className="font-semibold text-[#28634f]">Pass</span> : <span className="font-semibold text-red-700">Fail</span>}</td>
                    <td className="px-5 py-3">{a.duration_seconds ? `${Math.round(a.duration_seconds / 60)} min` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </SectionShell>
  );
}
