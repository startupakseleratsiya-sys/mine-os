import { notFound, redirect } from "next/navigation";
import { SectionShell } from "@/components/layouts/section-shell";
import { getExam } from "@/content/exam";
import { getCurrentUser } from "@/services/user-service";
import { getExamHistory } from "@/lib/exam-data";
import { buildMock, newSeed } from "@/lib/exam";
import { MockExamClient } from "@/features/exam/mock-exam-client";

type Params = { params: Promise<{ level: string }>; searchParams: Promise<{ seed?: string }> };

export const metadata = { title: "Mock exam" };

export default async function MockPage({ params, searchParams }: Params) {
  const { level } = await params;
  const exam = getExam(level);
  if (!exam) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/exam/${level}/mock`);

  // Seed URL'da turadi: sahifa yangilansa ham xuddi shu mock qaytadi (localStorage holati unga bog'langan).
  const { seed: seedParam } = await searchParams;
  const seed = Number(seedParam);
  if (!Number.isInteger(seed) || seed <= 0) redirect(`/exam/${level}/mock?seed=${newSeed()}`);

  const history = await getExamHistory(user.id, `cp3p-${exam.spec.slug}`);
  const seen = new Set(history.answers.map((a) => a.question_id));
  const questions = buildMock(exam.spec, exam.bank, seed, seen);
  const areaTitles = Object.fromEntries(exam.spec.areas.map((a) => [a.id, a.title]));

  return (
    <SectionShell eyebrow={`${exam.spec.title} · mock exam`} title="Exam conditions: timed, no notes." description="Answer every question — there is no penalty for a wrong answer. Flag anything you want to revisit and use the navigator to jump back.">
      <MockExamClient spec={exam.spec} questions={questions} seed={seed} areaTitles={areaTitles} />
    </SectionShell>
  );
}
