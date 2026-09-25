import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";
import { COURSES, courseMinutes, formatMinutes } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, courseUnlocked, getLessonProgress } from "@/lib/progress";

export const metadata = { title: "Courses" };

/** Uchta CP3P bosqichi — boshqa kurs yo'q. */
export default async function CoursesPage() {
  const user = await getCurrentUser();
  const rows = user ? await getLessonProgress(user.id) : [];
  return (
    <SectionShell eyebrow="CP3P certification" title="Three levels. One clear path." description="Each lesson has a video, audio and text, then a short test. Score 80% to unlock the next lesson. Finish a level to open its exam simulation.">
      <ul className="grid gap-5 md:grid-cols-3">
        {COURSES.map((course, i) => {
          const cp = courseProgress(rows, course);
          const open = courseUnlocked(rows, course);
          const href = open && cp.nextChapter ? `/study/${course.slug}/${cp.nextChapter.id}` : `/courses/${course.slug}`;
          return (
            <li key={course.slug} className="flex flex-col rounded-3xl border border-[#13251f]/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">Level {i + 1}</p>
              <p className="mt-3 text-3xl">{course.emoji}</p>
              <h2 className="mt-2 text-xl font-semibold">{course.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#65736d]">{course.description}</p>
              <p className="mt-4 text-xs text-[#65736d]">{course.chapters.length} lessons · {formatMinutes(courseMinutes(course))}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9ebe7]"><div className="h-full rounded-full bg-[#28634f]" style={{ width: `${cp.percent}%` }} /></div>
              <p className="mt-1.5 text-xs font-semibold">{cp.completed}/{cp.total} passed</p>
              <Link href={`/courses/${course.slug}`} className="mt-4 text-sm font-semibold text-[#163e32] hover:underline">See all lessons</Link>
              <Link href={href} className={`mt-3 inline-flex min-h-12 items-center justify-between rounded-xl px-5 font-semibold ${open ? "bg-[#163e32] text-white hover:bg-[#0e3026]" : "border border-[#13251f]/15 text-[#65736d]"}`}>
                {open ? (cp.completed ? "Continue" : "Start") : "Opens after Foundation"}
                {open ? <ArrowRight className="size-4" /> : <Lock className="size-4" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
