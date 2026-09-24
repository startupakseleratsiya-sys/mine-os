import { createClient } from "@/lib/supabase-server";
import { COURSES, TOTAL_CHAPTERS, getCourse, type Course } from "@/content/courses";
import { formatDate } from "@/lib/utils";

export type LessonProgressRow = {
  course_slug: string;
  chapter_id: string;
  completed_at: string;
};

/** Foydalanuvchining barcha tugatilgan boblari. Baza xatosida bo'sh ro'yxat (sahifa yiqilmaydi). */
export async function getLessonProgress(userId: string): Promise<LessonProgressRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("course_slug, chapter_id, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });
  if (error) {
    console.error("lesson_progress o'qishda xato:", error.message);
    return [];
  }
  return (data ?? []) as LessonProgressRow[];
}

export function courseProgress(rows: LessonProgressRow[], course: Course) {
  const completedIds = new Set(
    rows.filter((r) => r.course_slug === course.slug).map((r) => r.chapter_id)
  );
  const completed = course.chapters.filter((ch) => completedIds.has(ch.id)).length;
  const total = course.chapters.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    completedIds,
    nextChapter: course.chapters.find((ch) => !completedIds.has(ch.id)) ?? null,
  };
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Ketma-ket faol kunlar (bugun yoki kecha bilan tugaydigan). */
export function computeStreak(rows: LessonProgressRow[]) {
  const days = new Set(rows.map((r) => dayKey(new Date(r.completed_at))));
  if (days.size === 0) return 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Oxirgi 7 kun: har kuni tugatilgan boblar soni va daqiqalari. */
export function weeklyActivity(rows: LessonProgressRow[]) {
  const result: { day: string; date: string; lessons: number; minutes: number; isToday: boolean }[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const key = dayKey(d);
    const todays = rows.filter((r) => dayKey(new Date(r.completed_at)) === key);
    const minutes = todays.reduce((sum, r) => {
      const course = getCourse(r.course_slug);
      const chapter = course?.chapters.find((ch) => ch.id === r.chapter_id);
      return sum + (chapter?.minutes ?? 0);
    }, 0);
    result.push({
      day: DAY_LABELS[d.getDay()],
      date: key,
      lessons: todays.length,
      minutes,
      isToday: offset === 0,
    });
  }
  return result;
}

export function totalMinutesLearned(rows: LessonProgressRow[]) {
  return rows.reduce((sum, r) => {
    const chapter = getCourse(r.course_slug)?.chapters.find((ch) => ch.id === r.chapter_id);
    return sum + (chapter?.minutes ?? 0);
  }, 0);
}

/** Eng so'nggi faollik bo'lgan kurs; hech narsa bo'lmasa — birinchi kurs. */
export function activeCourse(rows: LessonProgressRow[]) {
  const latest = rows.find((r) => getCourse(r.course_slug));
  const course = latest ? getCourse(latest.course_slug)! : COURSES[0];
  return { course, ...courseProgress(rows, course) };
}

export function recentLessons(rows: LessonProgressRow[], limit = 5) {
  return rows
    .map((r) => {
      const course = getCourse(r.course_slug);
      const chapter = course?.chapters.find((ch) => ch.id === r.chapter_id);
      if (!course || !chapter) return null;
      return { course, chapter, completedAt: r.completed_at };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, limit);
}

export function relativeDay(iso: string) {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso, false);
}

export type Achievement = { icon: string; label: string; earned: boolean };

export function achievements(rows: LessonProgressRow[], chatCount: number): Achievement[] {
  const completedCourses = COURSES.filter((c) => courseProgress(rows, c).percent === 100).length;
  const streak = computeStreak(rows);
  return [
    { icon: "🎯", label: "Birinchi dars", earned: rows.length >= 1 },
    { icon: "🧠", label: "AI bilan suhbat", earned: chatCount >= 1 },
    { icon: "🔥", label: "3 kunlik streak", earned: streak >= 3 },
    { icon: "📚", label: "5 dars tugatildi", earned: rows.length >= 5 },
    { icon: "🏅", label: "Birinchi kurs", earned: completedCourses >= 1 },
    { icon: "💰", label: "Barcha kurslar", earned: rows.length >= TOTAL_CHAPTERS },
  ];
}
