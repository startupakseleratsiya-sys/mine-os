import { notFound, redirect } from "next/navigation";
import { SectionShell } from "@/components/layouts/section-shell";
import { getExam } from "@/content/exam";
import { getCurrentUser } from "@/services/user-service";
import { getExamHistory } from "@/lib/exam-data";
import { seededRandom, timeSeed, type ExamQuestion } from "@/lib/exam";
import { Practice } from "@/features/exam/practice";

type Params = { params: Promise<{ level: string }>; searchParams: Promise<{ area?: string }> };

export const metadata = { title: "Practice" };

const SET_SIZE = 10;

export default async function PracticePage({ params, searchParams }: Params) {
  const { level } = await params;
  const exam = getExam(level);
  if (!exam) notFound();
  const { area: areaId } = await searchParams;
  const area = exam.spec.areas.find((a) => a.id === areaId);
  if (!area) redirect(`/exam/${level}`);
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/exam/${level}/practice?area=${area.id}`);

  // Tanlash tartibi: hali ko'rilmagan → oxirgi marta xato qilingan → qolganlari (eng uzoq ko'rilmagan birinchi).
  const history = await getExamHistory(user.id, `cp3p-${exam.spec.slug}`);
  const last = new Map<string, { correct: boolean; at: string }>();
  for (const a of history.answers) if (!last.has(a.question_id)) last.set(a.question_id, { correct: a.correct, at: a.answered_at });
  const rand = seededRandom(timeSeed());
  const pool = exam.bank.filter((q) => q.area === area.id);
  const rank = (q: ExamQuestion) => {
    const l = last.get(q.id);
    if (!l) return 0 + rand();
    if (!l.correct) return 1 + rand();
    return 2 + (Date.parse(l.at) / 1e13);
  };
  const questions = [...pool].sort((a, b) => rank(a) - rank(b)).slice(0, SET_SIZE);

  return (
    <SectionShell eyebrow={`${exam.spec.title} · practice`} title={area.title} description={`${area.description} Unseen and previously missed questions come first.`}>
      <Practice spec={exam.spec} questions={questions} title={area.title} />
    </SectionShell>
  );
}
