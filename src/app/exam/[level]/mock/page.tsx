import { notFound, redirect } from "next/navigation";
import { SectionShell } from "@/components/layouts/section-shell";
import { getExam } from "@/content/exam";
import { getCurrentUser } from "@/services/user-service";
import { createClient } from "@/lib/supabase-server";
import { newSeed } from "@/lib/exam";
import { publicQuestion } from "@/lib/exam-public";
import { MockExamClient } from "@/features/exam/mock-exam-client";
import type { MockResume } from "@/features/exam/mock-exam";

type Params = { params: Promise<{ level: string }>; searchParams: Promise<{ seed?: string }> };

export const metadata = { title: "Mock exam" };

/** Tugallanmagan mock (vaqti hali tugamagan) — qaysi havola orqali kelinsa ham shu davom etadi. */
async function findOpenMock(userId: string, exam: NonNullable<ReturnType<typeof getExam>>): Promise<MockResume | undefined> {
  const supabase = await createClient();
  const { data: open } = await supabase
    .from("exam_attempts")
    .select("id, started_at, area_scores")
    .eq("user_id", userId)
    .eq("exam", `cp3p-${exam.spec.slug}`)
    .eq("mode", "mock")
    .is("passed", null)
    .order("started_at", { ascending: false })
    .limit(1);
  const row = open?.[0] as { id: string; started_at: string; area_scores: { ids?: string[]; endsAt?: number } } | undefined;
  if (!row || !Array.isArray(row.area_scores?.ids) || Number(row.area_scores.endsAt) <= Date.now()) return undefined;
  const byId = new Map(exam.bank.map((q) => [q.id, q]));
  const questions = row.area_scores.ids.map((id) => byId.get(id)).filter((q): q is NonNullable<typeof q> => Boolean(q)).map(publicQuestion);
  return { attemptId: row.id, questions, startedAt: row.started_at, endsAt: Number(row.area_scores.endsAt) };
}

function pickSeed(param: string | undefined) {
  const n = Number(param);
  return Number.isInteger(n) && n > 0 ? n : newSeed();
}

export default async function MockPage({ params, searchParams }: Params) {
  const { level } = await params;
  const exam = getExam(level);
  if (!exam) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/exam/${level}/mock`);

  const resume = await findOpenMock(user.id, exam);

  // Redirect qilinmaydi: topshirilgach server sahifani qayta chizganda (urinish yopilgan, URL'da seed yo'q)
  // yangi mockka o'tib ketib, natija ekrandan yo'qolib qolardi. Savollarni baribir server startMock'da tanlaydi.
  const seed = pickSeed((await searchParams).seed);
  const areaTitles = Object.fromEntries(exam.spec.areas.map((a) => [a.id, a.title]));

  return (
    <SectionShell eyebrow={`${exam.spec.title} · mock exam`} title="Exam conditions: timed, no notes." description="Answer every question — there is no penalty for a wrong answer. Flag anything you want to revisit and use the navigator to jump back.">
      <MockExamClient spec={exam.spec} seed={seed} areaTitles={areaTitles} resume={resume} />
    </SectionShell>
  );
}
