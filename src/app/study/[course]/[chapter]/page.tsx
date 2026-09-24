import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapter } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, getLessonProgress } from "@/lib/progress";
import { StudyView } from "./study-view";

type Params = { params: Promise<{ course: string; chapter: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { course, chapter } = await params;
  const found = getChapter(course, chapter);
  return { title: found ? found.chapter.title : "Bob topilmadi" };
}

// Next 15+: `params` Promise. Kontent kodda, progress bazadan.
export default async function StudyPage({ params }: Params) {
  const { course: courseSlug, chapter: chapterId } = await params;
  const found = getChapter(courseSlug, chapterId);
  if (!found) notFound();

  const user = await getCurrentUser();
  const rows = user ? await getLessonProgress(user.id) : [];
  const cp = courseProgress(rows, found.course);

  return (
    <StudyView
      key={`${courseSlug}/${chapterId}`}
      courseSlug={found.course.slug}
      courseTitle={found.course.shortTitle}
      chapter={found.chapter}
      sourceNote={found.course.sourceNote}
      signedIn={Boolean(user)}
      modules={found.course.modules}
      index={found.index}
      total={found.course.chapters.length}
      prev={found.prev ? { id: found.prev.id, title: found.prev.title } : null}
      next={found.next ? { id: found.next.id, title: found.next.title } : null}
      initialCompleted={cp.completedIds.has(found.chapter.id)}
      completedIds={[...cp.completedIds]}
      chapters={found.course.chapters.map((ch) => ({ id: ch.id, title: ch.title, minutes: ch.minutes }))}
    />
  );
}
