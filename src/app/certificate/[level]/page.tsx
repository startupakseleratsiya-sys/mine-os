import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Award } from "lucide-react";
import { COURSES } from "@/content/courses";
import { getCurrentUser, getProfile } from "@/services/user-service";
import { getExamHistory } from "@/lib/exam-data";
import { courseProgress, getLessonProgress } from "@/lib/progress";
import { PrintButton } from "./print-button";

export const metadata = { title: "Certificate of completion" };

/**
 * Finora yakunlash sertifikati: daraja kursi + rasmiy formatdagi simulyatsiyadan o'tgan bo'lsa beriladi.
 * Bu APMG sertifikati EMAS — sahifada aniq yozilgan.
 */
export default async function CertificatePage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const course = COURSES.find((c) => c.level === level);
  if (!course) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/certificate/${level}`);
  const [profile, history, rows] = await Promise.all([getProfile(user.id), getExamHistory(user.id, `cp3p-${level}`), getLessonProgress(user.id)]);
  const passed = history.attempts.filter((a) => a.mode === "mock" && a.passed);
  // Sertifikat faqat: hamma dars testi topshirilgan + rasmiy formatdagi simulyatsiyadan o'tilgan.
  if (!passed.length || courseProgress(rows, course).percent < 100) redirect(`/courses/${course.slug}#final`);
  const best = passed.reduce((b, a) => (a.score / a.total > b.score / b.total ? a : b));
  const first = passed[passed.length - 1];
  const name = profile?.full_name?.trim() || user.email?.split("@")[0] || "Learner";
  const date = new Date(first.finished_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const id = first.id.slice(0, 8).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 print:p-0">
      <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#65736d] hover:text-[#163e32] print:hidden"><ArrowLeft className="size-4" />{course.shortTitle}</Link>
      <article className="mt-6 rounded-[28px] border-8 border-double border-[#163e32] bg-white p-8 text-center sm:p-14 print:mt-0 print:rounded-none">
        <Award className="mx-auto size-14 text-amber-500" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#527264]">Finora · Certificate of completion</p>
        <p className="mt-8 text-sm text-[#65736d]">This certifies that</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">{name}</p>
        <p className="mx-auto mt-6 max-w-xl leading-7 text-[#52665e]">
          completed all {course.chapters.length} lessons of the <span className="font-semibold text-[#13251f]">{course.title}</span> preparation course, passing every lesson test at 80% or more, and passed a full exam simulation in the official APMG format.
        </p>
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm">
          <div><p className="text-[#65736d]">Best simulation</p><p className="text-lg font-semibold">{best.score}/{best.total}</p></div>
          <div><p className="text-[#65736d]">Date</p><p className="text-lg font-semibold">{date}</p></div>
          <div><p className="text-[#65736d]">ID</p><p className="font-mono text-lg font-semibold">{id}</p></div>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-[11px] leading-5 text-[#65736d]">Based on the PPP Guide 2026. This is a Finora course certificate, not the APMG CP3P certification, which is awarded only by APMG International after its official exam.</p>
      </article>
      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <PrintButton />
        <Link href={course.finalExamHref} className="inline-flex min-h-12 items-center rounded-xl border border-[#13251f]/15 bg-white px-6 font-semibold">Practise another simulation</Link>
      </div>
    </div>
  );
}
