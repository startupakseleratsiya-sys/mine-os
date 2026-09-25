import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCourse } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { getLessonAnswers } from "@/lib/progress";
import { findQuestion, mistakes } from "@/lib/learning-path";
import { LessonTest } from "@/features/lesson/lesson-test";

export const metadata = { title: "Review my mistakes" };

const SET = 10;

/** Xatolar daftari: oxirgi javobi noto'g'ri savollar (eng eskisi birinchi), 10 tadan. */
export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/courses/${slug}/review`);
  const count = mistakes(await getLessonAnswers(user.id, course.slug)).filter((k) => findQuestion(course, k)).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#65736d] hover:text-[#163e32]"><ArrowLeft className="size-4" />{course.shortTitle}</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Review my mistakes</h1>
      <p className="mt-2 text-[#52665e]">{count ? `${count} question${count > 1 ? "s" : ""} to fix${count > SET ? ` — ${SET} at a time` : ""}. Answer from memory; the ones you get right leave the list.` : "Nothing to review — every question you missed is now fixed."}</p>
      <div className="mt-8">
        {count ? <LessonTest mode="review" courseSlug={course.slug} passMark={Math.min(count, SET)} /> : <Link href={`/courses/${course.slug}`} className="inline-flex min-h-12 items-center rounded-xl bg-[#163e32] px-6 font-semibold text-white">Back to the course</Link>}
      </div>
    </div>
  );
}
