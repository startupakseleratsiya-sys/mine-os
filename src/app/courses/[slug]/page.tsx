import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Flag, Lock, Play } from "lucide-react";
import { LEGACY_COURSE_REDIRECTS, courseMinutes, formatMinutes, getCourse } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, courseUnlocked, getLessonProgress } from "@/lib/progress";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return { title: course ? course.shortTitle : "Course not found" };
}

/** Kurs = o'yinsimon yo'l: tugatilgan ✓ → joriy ▶ → yopiq 🔒 → yakuniy imtihon 🏁. */
export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  if (LEGACY_COURSE_REDIRECTS[slug]) permanentRedirect(`/courses/${LEGACY_COURSE_REDIRECTS[slug]}`);
  const course = getCourse(slug);
  if (!course) notFound();
  const user = await getCurrentUser();
  const rows = user ? await getLessonProgress(user.id) : [];
  const cp = courseProgress(rows, course);
  const open = courseUnlocked(rows, course);
  const currentId = open ? cp.nextChapter?.id ?? null : null;
  const allDone = cp.total > 0 && cp.completed === cp.total;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#65736d] hover:text-[#163e32]"><ArrowLeft className="size-4" />All courses</Link>
      <p className="mt-6 text-4xl">{course.emoji}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
      <p className="mt-3 leading-7 text-[#52665e]">{course.description}</p>
      <p className="mt-2 text-sm text-[#65736d]">{cp.total} lessons · {formatMinutes(courseMinutes(course))} · {course.exam}</p>

      <div className="mt-6 rounded-2xl bg-white p-4">
        <div className="flex justify-between text-sm font-semibold"><span>{cp.completed}/{cp.total} lessons passed</span><span>{cp.percent}%</span></div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e9ebe7]"><div className="h-full rounded-full bg-[#28634f]" style={{ width: `${cp.percent}%` }} /></div>
      </div>

      {!open && (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This level opens after you finish <Link href="/courses/cp3p-foundation" className="font-semibold underline">CP3P Foundation</Link> — the real exam also requires Foundation first.
        </p>
      )}

      <ol className="relative mt-8 space-y-3 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:bg-[#dfe3dd]">
        {course.chapters.map((ch, i) => {
          const done = cp.completedIds.has(ch.id);
          const current = ch.id === currentId;
          const locked = !done && !current;
          const body = (
            <>
              <span className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-4 border-[#F5F4EE] text-sm font-bold ${done ? "bg-[#28634f] text-white" : current ? "bg-[#163e32] text-white ring-4 ring-[#9fd3b8]/50" : "bg-[#e9ebe7] text-[#8a968f]"}`}>
                {done ? <CheckCircle2 className="size-6" /> : current ? <Play className="size-5" /> : <Lock className="size-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#65736d]">Lesson {i + 1} · {ch.minutes} min</span>
                <span className={`mt-0.5 block font-semibold leading-snug ${locked ? "text-[#8a968f]" : ""}`}>{ch.title}</span>
                {current && <span className="mt-1 block text-sm font-semibold text-[#28634f]">{cp.completed ? "Continue here" : "Start here"} →</span>}
              </span>
            </>
          );
          return (
            <li key={ch.id}>
              {locked ? (
                <div className="flex items-center gap-4 rounded-2xl p-1.5">{body}</div>
              ) : (
                <Link href={`/study/${course.slug}/${ch.id}`} className={`flex items-center gap-4 rounded-2xl p-1.5 ${current ? "bg-white shadow-sm" : "hover:bg-white"}`}>{body}</Link>
              )}
            </li>
          );
        })}
        <li id="final">
          {allDone ? (
            <Link href={course.finalExamHref} className="flex items-center gap-4 rounded-2xl bg-[#163e32] p-1.5 text-white">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-4 border-[#F5F4EE] bg-amber-400 text-[#163e32]"><Flag className="size-6" /></span>
              <span><span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Final step</span><span className="block font-semibold">Exam simulation — official format, timed</span></span>
            </Link>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl p-1.5">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-4 border-[#F5F4EE] bg-[#e9ebe7] text-[#8a968f]"><Flag className="size-6" /></span>
              <span><span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#65736d]">Final step</span><span className="block font-semibold text-[#8a968f]">Exam simulation — opens after the last lesson</span></span>
            </div>
          )}
        </li>
      </ol>

      {!user && <p className="mt-8 rounded-2xl bg-white p-4 text-sm"><Link href={`/sign-in?next=/courses/${course.slug}`} className="font-semibold underline">Sign in</Link> to save your progress and unlock lessons.</p>}
      <p className="mt-10 text-xs leading-5 text-[#65736d]">Lessons are Finora&apos;s own adaptation of the PPP Guide 2026 (© AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group, CC BY 3.0 IGO). Not affiliated with APMG International.</p>
    </div>
  );
}
