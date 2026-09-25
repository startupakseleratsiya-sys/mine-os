import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { LEGACY_COURSE_REDIRECTS, getChapter, lessonTest, passMarkFor } from "@/content/courses";
import { toPublic } from "@/lib/learning-path";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, courseUnlocked, getLessonProgress, lessonUnlocked } from "@/lib/progress";
import { LessonView } from "@/features/lesson/lesson-view";
import audio from "@/content/cp3p/audio.json";

type Params = { params: Promise<{ course: string; chapter: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course, chapter } = await params;
  const found = getChapter(course, chapter);
  return { title: found ? found.chapter.title : "Lesson not found" };
}

/** Tabiiy ovozli yozuvlar (scripts/generate-lesson-audio.mjs → publish_lesson_audio.py) — faqat to'liq yuklangan bo'lsa. */
function recordedAudio(lesson: { id: string; slides: unknown[]; sections: unknown[] }) {
  const m = (audio as Record<string, { slides?: number; parts?: number; published?: boolean }>)[lesson.id];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!m?.published || !url) return undefined;
  const base = `${url.replace(/\/$/, "")}/storage/v1/object/public/lesson-audio/${lesson.id}`;
  return {
    slides: m.slides === lesson.slides.length ? base : undefined,
    // Audio dars bo'limlari: sections + misol + tuzoqlar + xulosa (lesson-view listenParts bilan bir xil).
    parts: m.parts === lesson.sections.length + 3 ? base : undefined,
  };
}

export default async function StudyPage({ params }: Params) {
  const { course: courseSlug, chapter: chapterId } = await params;
  if (LEGACY_COURSE_REDIRECTS[courseSlug]) permanentRedirect(`/courses/${LEGACY_COURSE_REDIRECTS[courseSlug]}`);
  const found = getChapter(courseSlug, chapterId);
  if (!found) permanentRedirect(`/courses/${courseSlug}`);
  const { course, chapter, index, next } = found;

  const user = await getCurrentUser();
  const rows = user ? await getLessonProgress(user.id) : [];
  const cp = courseProgress(rows, course);

  // Ketma-ket yo'l: oldingi dars testi topshirilmagan bo'lsa, bu dars yopiq.
  if (!lessonUnlocked(rows, course, index)) {
    const target = courseUnlocked(rows, course) ? cp.nextChapter : null;
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
        <Lock className="mx-auto size-10 text-[#65736d]" />
        <h1 className="mt-4 text-2xl font-semibold">This lesson is locked</h1>
        <p className="mt-2 text-[#65736d]">{courseUnlocked(rows, course) ? "Pass the test of the previous lesson (80%) to open it." : "Finish CP3P Foundation first — it is required for this level, just like the real exam."}</p>
        <Link href={target ? `/study/${course.slug}/${target.id}` : `/courses/${course.requires ?? course.slug}`} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#163e32] px-6 font-semibold text-white">
          {target ? `Continue: ${target.title}` : "Go to CP3P Foundation"}
        </Link>
        {!user && <p className="mt-4 text-sm"><Link href={`/sign-in?next=/study/${course.slug}/${chapter.id}`} className="font-semibold underline">Sign in</Link> to keep your progress.</p>}
      </div>
    );
  }

  const items = lessonTest(course, chapter.id);
  return (
    <LessonView
      key={chapter.id}
      courseSlug={course.slug}
      courseTitle={course.shortTitle}
      lesson={chapter}
      index={index}
      total={course.chapters.length}
      completed={cp.completedIds.has(chapter.id)}
      items={toPublic(items)}
      passMark={passMarkFor(items.length)}
      nextHref={next ? `/study/${course.slug}/${next.id}` : null}
      finalHref={`/courses/${course.slug}#final`}
      signedIn={Boolean(user)}
      audio={recordedAudio(chapter)}
    />
  );
}
