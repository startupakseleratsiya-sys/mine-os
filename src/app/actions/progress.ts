"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { getChapter, getCourse, lessonTest, passMarkFor } from "@/content/courses";
import { findQuestion } from "@/lib/learning-path";
import { getLessonProgress, lessonUnlocked } from "@/lib/progress";

export type TestResult =
  | { ok: true; correct: number; total: number; passed: boolean; passMark: number; saved: boolean }
  | { ok: false; error: string };

export type CheckResult = { ok: true; correct: boolean; answer: number; explanation: string } | { ok: false; error: string };

/** Dars savollari javoblari shu nom bilan saqlanadi (xatolar daftari va tayyorlik uchun). */
const answersExam = (courseSlug: string) => `lessons:${courseSlug}`;

const CheckSchema = z.object({
  courseSlug: z.string().max(40),
  key: z.string().max(90),
  chosen: z.number().int().min(0).max(3),
});

/**
 * Bitta javobni tekshiradi (kalit brauzerga oldindan yuborilmaydi) va natijani yozib qo'yadi.
 * Faqat foydalanuvchiga ochiq darslarning savollari tekshiriladi.
 */
export async function checkAnswer(input: z.infer<typeof CheckSchema>): Promise<CheckResult> {
  const parsed = CheckSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid answer." };
  const { courseSlug, key, chosen } = parsed.data;
  const course = getCourse(courseSlug);
  const found = course && findQuestion(course, key);
  if (!course || !found) return { ok: false, error: "Question not found." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to take the test." };
  const rows = await getLessonProgress(user.id);
  const lessonIndex = course.chapters.findIndex((l) => l.id === found.lessonId);
  // Takrorlash savollari oldingi darslardan — ular ham ochiq; yopiq dars savolini tekshirib bo'lmaydi.
  if (!lessonUnlocked(rows, course, lessonIndex)) return { ok: false, error: "This lesson is locked." };

  const correct = chosen === found.q.answer;
  const { error } = await supabase.from("exam_answers").insert({ user_id: user.id, exam: answersExam(courseSlug), question_id: key, chosen, correct });
  if (error) console.error("exam_answers (lesson) yozishda xato:", error.message);
  return { ok: true, correct, answer: found.q.answer, explanation: found.q.explanation };
}

const Schema = z.object({
  courseSlug: z.string().max(40),
  lessonId: z.string().max(80),
  /** savol kaliti (lessonId#i) → tanlangan variantning ASL indeksi */
  answers: z.record(z.string().max(90), z.number().int().min(0).max(3).nullable()),
});

/**
 * Dars testini topshirish. Ball serverda kalit bilan hisoblanadi; ≥80% bo'lsa dars tugatilgan deb yoziladi
 * va keyingi dars ochiladi. Yopiq darsni (oldingisi topshirilmagan) topshirib bo'lmaydi.
 */
export async function submitLessonTest(input: z.infer<typeof Schema>): Promise<TestResult> {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid test data." };
  const { courseSlug, lessonId, answers } = parsed.data;
  const found = getChapter(courseSlug, lessonId);
  if (!found) return { ok: false, error: "Lesson not found." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to save your progress." };

  const rows = await getLessonProgress(user.id);
  if (!lessonUnlocked(rows, found.course, found.index)) return { ok: false, error: "Finish the previous lesson first." };

  const items = lessonTest(found.course, lessonId);
  const correct = items.filter((it) => answers[it.key] === it.q.answer).length;
  const total = items.length;
  const passMark = passMarkFor(total);
  const passed = correct >= passMark;

  // Statistika uchun urinish (jadval bo'lmasa ham test ishlaydi).
  const { error: attemptError } = await supabase.from("exam_attempts").insert({
    user_id: user.id,
    exam: `lesson:${lessonId}`,
    mode: "practice",
    score: correct,
    total,
    passed,
    area_scores: {},
  });
  if (attemptError) console.error("lesson test attempt yozishda xato:", attemptError.message);

  let saved = true;
  if (passed) {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({ user_id: user.id, course_slug: courseSlug, chapter_id: lessonId, completed_at: new Date().toISOString() }, { onConflict: "user_id,course_slug,chapter_id" });
    if (error) {
      console.error("lesson_progress yozishda xato:", error.message);
      saved = false;
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseSlug}`);
  return { ok: true, correct, total, passed, passMark, saved };
}

/** Xatolar takrorlash sessiyasi yakuni — javoblar checkAnswer'da allaqachon yozilgan, faqat ballni qaytaradi. */
export async function finishReview(input: { courseSlug: string; answers: Record<string, number | null> }): Promise<TestResult> {
  const course = getCourse(input.courseSlug);
  if (!course) return { ok: false, error: "Course not found." };
  const keys = Object.keys(input.answers).slice(0, 50);
  const correct = keys.filter((k) => findQuestion(course, k)?.q.answer === input.answers[k]).length;
  revalidatePath(`/courses/${course.slug}`);
  return { ok: true, correct, total: keys.length, passed: correct === keys.length, passMark: keys.length, saved: true };
}
