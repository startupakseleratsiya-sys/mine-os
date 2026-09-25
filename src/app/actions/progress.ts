"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { getChapter, lessonTest, passMarkFor } from "@/content/courses";
import { getLessonProgress, lessonUnlocked } from "@/lib/progress";

export type TestResult =
  | { ok: true; correct: number; total: number; passed: boolean; passMark: number; saved: boolean }
  | { ok: false; error: string };

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
