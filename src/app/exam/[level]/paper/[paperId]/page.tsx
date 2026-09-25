import { notFound, redirect } from "next/navigation";
import { SectionShell } from "@/components/layouts/section-shell";
import { getPaper } from "@/content/exam/scenario";
import { getCurrentUser } from "@/services/user-service";
import { ScenarioExamClient } from "@/features/exam/mock-exam-client";
import { publicPaper } from "@/lib/exam-public";

type Params = { params: Promise<{ level: string; paperId: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Params) {
  const { level, paperId } = await params;
  const found = getPaper(level, paperId);
  return { title: found ? `${found.spec.title} · ${found.paper.title}` : "Paper not found" };
}

export default async function PaperPage({ params, searchParams }: Params) {
  const { level, paperId } = await params;
  const found = getPaper(level, paperId);
  if (!found) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/exam/${level}/paper/${paperId}`);
  const { spec, paper } = found;

  // ?q=N — bitta savol mashqi; aks holda to'liq mock.
  const { q } = await searchParams;
  const n = Number(q);
  const practice = Number.isInteger(n) && n >= 1 && n <= 4;
  const question = practice ? paper.questions.find((x) => x.number === n) : undefined;

  return (
    <SectionShell
      eyebrow={`${spec.title} · ${practice ? `practice question ${n}` : "full mock"}`}
      title={practice && question ? `Q${n} · ${question.area} — ${question.title}` : paper.title}
      description={practice ? "One exam question (20 marks) with the paper's scenario. Check your answers at the end to see every explanation." : "Exam conditions: one scenario, four questions, timed. Your own annotated PPP Guide is allowed."}
    >
      {/* Javob kalitlari va izohlar brauzerga yuborilmaydi — topshirilgach serverdan keladi. */}
      <ScenarioExamClient spec={spec} paper={publicPaper(paper)} mode={practice ? "practice" : "mock"} questionNumbers={practice ? [n] : [1, 2, 3, 4]} />
    </SectionShell>
  );
}
