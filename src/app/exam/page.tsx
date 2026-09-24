import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";
import { EXAMS, GUIDE_EDITION } from "@/content/exam";
import { getCurrentUser } from "@/services/user-service";
import { getExamHistory } from "@/lib/exam-data";
import { readiness } from "@/lib/exam";

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
  const history = await getExamHistory(user.id, "cp3p-foundation");
  const ready = readiness(foundation.spec, foundation.bank, history.answers);
  const mocks = history.attempts.filter((a) => a.mode === "mock");
  const best = mocks.reduce((m, a) => Math.max(m, a.score), 0);

  return (
    <SectionShell eyebrow="CP3P exam prep" title="Pass the CP3P certification, level by level." description={`Original practice questions and timed mocks in the exact APMG format, based on the ${GUIDE_EDITION} — the edition used for English exams from 1 December 2026.`}>
      <div className="grid gap-5 md:grid-cols-3">
        {LEVELS.map((level) => {
          const active = level.slug in EXAMS;
          return (
            <article key={level.slug} className={`flex flex-col rounded-3xl border p-6 ${active ? "border-[#13251f]/10 bg-white" : "border-dashed border-[#13251f]/15 bg-[#f8f7f2]"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">CP3P {level.name}</p>
              <h2 className="mt-3 text-xl font-semibold">{level.scope}</h2>
              <p className="mt-2 text-sm leading-6 text-[#65736d]">{level.format}</p>
              {active ? (
                <>
                  <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-[#f3f1eb] p-3"><dt className="text-[#65736d]">Questions</dt><dd className="text-lg font-semibold">{foundation.bank.length}</dd></div>
                    <div className="rounded-2xl bg-[#f3f1eb] p-3"><dt className="text-[#65736d]">Best mock</dt><dd className="text-lg font-semibold">{mocks.length ? `${best}/50` : "—"}</dd></div>
                  </dl>
                  <p className="mt-4 text-sm"><span className="font-semibold">{STATUS_LABEL[ready.status]}</span>{ready.predicted !== null ? <span className="text-[#65736d]"> · predicted {Math.round(ready.predicted * 100)}%</span> : null}</p>
                  <Link href={`/exam/${level.slug}`} className="mt-6 inline-flex min-h-12 items-center justify-between rounded-xl bg-[#163e32] px-5 font-semibold text-white hover:bg-[#0e3026]">Open {level.name}<ArrowRight className="size-4" /></Link>
                </>
              ) : (
                <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#65736d]"><Lock className="size-4" />Scenario mocks coming next. Study the chapters in the course meanwhile.</p>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-10 max-w-3xl text-xs leading-5 text-[#65736d]">Finora is an independent study aid. Questions are original and written by Finora from the PPP Guide (© 2026 AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group, CC BY 3.0 IGO). They are not official APMG exam questions, and Finora is not affiliated with APMG International. CP3P is a certification of APMG International.</p>
    </SectionShell>
  );
}
