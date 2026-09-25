import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";
import { EXAMS, GUIDE_EDITION } from "@/content/exam";
import { getCurrentUser } from "@/services/user-service";
import { getExamHistory } from "@/lib/exam-data";
import { readiness } from "@/lib/exam";
import { SCENARIO_EXAMS } from "@/content/exam/scenario";
import { flattenLines, lineKey } from "@/lib/scenario";

export const metadata = { title: "CP3P exam prep" };

const LEVELS = [
  { slug: "foundation", name: "Foundation", scope: "Chapter 1 + Glossary", format: "50 multiple-choice · 40 min · closed book · pass 25/50" },
  { slug: "preparation", name: "Preparation", scope: "Chapters 2–4 + part of 5", format: "Scenario-based · 80 marks · 150 min · open book · pass 40/80" },
  { slug: "execution", name: "Execution", scope: "Chapters 5–7", format: "Scenario-based · 80 marks · 150 min · open book · pass 40/80" },
];

const STATUS_LABEL = { ready: "Ready to book", almost: "Almost ready", "not-ready": "Keep practising", "not-enough-data": "Not enough data yet" } as const;

export default async function ExamHubPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/exam");
  const foundation = EXAMS.foundation;
  const [fHistory, pHistory, eHistory] = await Promise.all([
    getExamHistory(user.id, "cp3p-foundation"),
    getExamHistory(user.id, "cp3p-preparation"),
    getExamHistory(user.id, "cp3p-execution"),
  ]);
  const summary: Record<string, { items: string; best: string; status: keyof typeof STATUS_LABEL; predicted: number | null }> = {};
  {
    const r = readiness(foundation.spec, foundation.bank, fHistory.answers);
    const mocks = fHistory.attempts.filter((a) => a.mode === "mock");
    summary.foundation = { items: `${foundation.bank.length} questions`, best: mocks.length ? `${Math.max(...mocks.map((a) => a.score))}/50` : "—", status: r.status, predicted: r.predicted };
  }
  for (const [slug, h] of [["preparation", pHistory], ["execution", eHistory]] as const) {
    const { spec, papers } = SCENARIO_EXAMS[slug];
    const lines = papers.flatMap((p) => flattenLines(p).map((l) => ({ id: lineKey(p.id, l.line.id), area: l.question.area })));
    const r = readiness({ questions: spec.marks, passMark: spec.passMark, areas: spec.areas.map((a) => ({ ...a, mockCount: spec.marks / spec.areas.length })) }, lines, h.answers, 40, 10);
    const mocks = h.attempts.filter((a) => a.mode === "mock");
    summary[slug] = { items: `${papers.length} papers · ${lines.length} marks`, best: mocks.length ? `${Math.max(...mocks.map((a) => a.score))}/80` : "—", status: r.status, predicted: r.predicted };
  }

  return (
    <SectionShell eyebrow="CP3P exam prep" title="Pass the CP3P certification, level by level." description={`Original practice questions and timed mocks in the exact APMG format, based on the ${GUIDE_EDITION} — the edition used for English exams from 1 December 2026.`}>
      <div className="grid gap-5 md:grid-cols-3">
        {LEVELS.map((level) => {
          const info = summary[level.slug];
          const active = Boolean(info);
          return (
            <article key={level.slug} className={`flex flex-col rounded-3xl border p-6 ${active ? "border-[#13251f]/10 bg-white" : "border-dashed border-[#13251f]/15 bg-[#f8f7f2]"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">CP3P {level.name}</p>
              <h2 className="mt-3 text-xl font-semibold">{level.scope}</h2>
              <p className="mt-2 text-sm leading-6 text-[#65736d]">{level.format}</p>
              {active ? (
                <>
                  <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-[#f3f1eb] p-3"><dt className="text-[#65736d]">Practice</dt><dd className="text-sm font-semibold leading-7">{info.items}</dd></div>
                    <div className="rounded-2xl bg-[#f3f1eb] p-3"><dt className="text-[#65736d]">Best mock</dt><dd className="text-lg font-semibold">{info.best}</dd></div>
                  </dl>
                  <p className="mt-4 text-sm"><span className="font-semibold">{STATUS_LABEL[info.status]}</span>{info.predicted !== null ? <span className="text-[#65736d]"> · predicted {Math.round(info.predicted * 100)}%</span> : null}</p>
                  <Link href={`/exam/${level.slug}`} className="mt-6 inline-flex min-h-12 items-center justify-between rounded-xl bg-[#163e32] px-5 font-semibold text-white hover:bg-[#0e3026]">Open {level.name}<ArrowRight className="size-4" /></Link>
                </>
              ) : (
                <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#65736d]"><Lock className="size-4" />Scenario mocks coming next. Study the chapters in the course meanwhile.</p>
              )}
            </article>
          );
        })}
      </div>
      <Link href="/exam/flashcards" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#13251f]/10 bg-white p-6 hover:bg-[#fbfaf6]">
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">Every level</span>
          <span className="mt-1 block text-lg font-semibold">Glossary and acronym flashcards</span>
          <span className="mt-1 block text-sm text-[#65736d]">Spaced repetition for the terms the exams use. Ten minutes a day.</span>
        </span>
        <ArrowRight className="size-5" />
      </Link>
      <p className="mt-10 max-w-3xl text-xs leading-5 text-[#65736d]">Finora is an independent study aid. Questions are original and written by Finora from the PPP Guide (© 2026 AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group, CC BY 3.0 IGO). They are not official APMG exam questions, and Finora is not affiliated with APMG International. CP3P is a certification of APMG International.</p>
    </SectionShell>
  );
}
