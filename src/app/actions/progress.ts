"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getChapter, getCourse, lessonTest, passMarkFor } from "@/content/courses";
import { findQuestion, mistakes, type PublicItem } from "@/lib/learning-path";
import { getLessonAnswers, getLessonProgress, lessonUnlocked } from "@/lib/progress";

/**
 * Dars testi — server boshqaradigan urinish (attempt):
 *  1) startTest: urinish ochiladi (exam_attempts, passed = null), savol kalitlari urinishda saqlanadi;
 *  2) checkAnswer: har savolga FAQAT BIRINCHI javob yoziladi (keyin o'zgarmaydi), kalit shundan keyin ochiladi;
 *  3) finishTest: ball bazadagi birinchi javoblardan hisoblanadi — brauzer yuborgan ro'yxatga ishonilmaydi.
 * Yozish faqat service-role mijoz bilan (00003: foydalanuvchi bu jadvallarga o'zi yoza olmaydi).
 */

const REVIEW_SET = 10;
const answersExam = (courseSlug: string) => `lessons:${courseSlug}`;

type Attempt = { id: string; user_id: string; exam: string; passed: boolean | null; started_at: string | null; area_scores: { keys?: string[]; course?: string; kind?: "lesson" | "review" } };

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user, db: createAdminClient() ?? supabase };
}

export type StartResult = { ok: true; attemptId: string; items: PublicItem[] } | { ok: false; error: string };

const StartSchema = z.object({ courseSlug: z.string().max(40), lessonId: z.string().max(80).optional(), kind: z.enum(["lesson", "review"]) });

export async function startTest(input: z.infer<typeof StartSchema>): Promise<StartResult> {
  const parsed = StartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { courseSlug, lessonId, kind } = parsed.data;
  const course = getCourse(courseSlug);
  if (!course) return { ok: false, error: "Course not found." };
  const { user, db } = await currentUser();
  if (!user) return { ok: false, error: "Sign in to take the test." };

  let keys: string[];
  if (kind === "lesson") {
    const found = lessonId ? getChapter(courseSlug, lessonId) : undefined;
    if (!found) return { ok: false, error: "Lesson not found." };
    if (!lessonUnlocked(await getLessonProgress(user.id), found.course, found.index)) return { ok: false, error: "Finish the previous lesson first." };
    keys = lessonTest(found.course, found.chapter.id).map((it) => it.key);
  } else {
    keys = mistakes(await getLessonAnswers(user.id, course.slug)).filter((k) => findQuestion(course, k)).slice(0, REVIEW_SET);
    if (!keys.length) return { ok: false, error: "Nothing to review." };
  }

  const { data, error } = await db
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      exam: kind === "lesson" ? `lesson:${lessonId}` : `review:${course.slug}`,
      mode: "practice",
      score: 0,
      total: keys.length,
      passed: null,
      started_at: new Date().toISOString(),
      area_scores: { keys, course: course.slug, kind },
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("startTest:", error?.message);
    return { ok: false, error: "Could not start the test. Please try again." };
  }
  const items = keys.map((key) => {
    const q = findQuestion(course, key)!.q;
    return { key, question: q.question, options: q.options, review: kind === "review" };
  });
  return { ok: true, attemptId: data.id, items };
}

/** Urinishni tekshirib yuklaydi: egasi shu user, hali ochiq (passed = null). */
async function openAttempt(db: NonNullable<Awaited<ReturnType<typeof currentUser>>["db"]>, attemptId: string, userId: string) {
  const { data } = await db.from("exam_attempts").select("id, user_id, exam, passed, started_at, area_scores").eq("id", attemptId).maybeSingle();
  const a = data as Attempt | null;
  if (!a || a.user_id !== userId || !Array.isArray(a.area_scores?.keys) || !a.area_scores.course) return null;
  return a;
}

export type CheckResult = { ok: true; correct: boolean; answer: number; explanation: string; chosen: number } | { ok: false; error: string };

const CheckSchema = z.object({ attemptId: z.string().uuid(), key: z.string().max(90), chosen: z.number().int().min(0).max(3) });

export async function checkAnswer(input: z.infer<typeof CheckSchema>): Promise<CheckResult> {
  const parsed = CheckSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid answer." };
  const { attemptId, key, chosen } = parsed.data;
  const { user, db } = await currentUser();
  if (!user) return { ok: false, error: "Sign in to take the test." };
  const attempt = await openAttempt(db, attemptId, user.id);
  if (!attempt) return { ok: false, error: "This test session has expired. Please start the test again." };
  if (attempt.passed !== null) return { ok: false, error: "This test is already finished." };
  if (!attempt.area_scores.keys!.includes(key)) return { ok: false, error: "Question not found." };
  const course = getCourse(attempt.area_scores.course!);
  const found = course && findQuestion(course, key);
  if (!found) return { ok: false, error: "Question not found." };

  // Birinchi javob — yakuniy. Qayta yuborilsa, avvalgi javob qaytariladi (o'zgartirib bo'lmaydi).
  const { data: prev } = await db.from("exam_answers").select("chosen").eq("attempt_id", attemptId).eq("question_id", key).order("answered_at").limit(1);
  const first = (prev?.[0] as { chosen: number | null } | undefined)?.chosen;
  const final = typeof first === "number" ? first : chosen;
  if (typeof first !== "number") {
    const { error } = await db.from("exam_answers").insert({ user_id: user.id, attempt_id: attemptId, exam: answersExam(course.slug), question_id: key, chosen, correct: chosen === found.q.answer });
    if (error) {
      console.error("checkAnswer insert:", error.message);
      return { ok: false, error: "Could not save your answer. Please try again." };
    }
  }
  return { ok: true, correct: final === found.q.answer, answer: found.q.answer, explanation: found.q.explanation, chosen: final };
}

export type TestResult =
  | { ok: true; correct: number; total: number; answered: number; passed: boolean; passMark: number; saved: boolean }
  | { ok: false; error: string };

export async function finishTest(input: { attemptId: string }): Promise<TestResult> {
  const attemptId = z.string().uuid().safeParse(input?.attemptId);
  if (!attemptId.success) return { ok: false, error: "Invalid request." };
  const { user, db } = await currentUser();
  if (!user) return { ok: false, error: "Your session has expired — sign in again, then press “Try again”." };
  const attempt = await openAttempt(db, attemptId.data, user.id);
  if (!attempt) return { ok: false, error: "This test session has expired. Please start the test again." };
  const keys = attempt.area_scores.keys!;
  const course = getCourse(attempt.area_scores.course!)!;
  const kind = attempt.area_scores.kind ?? "lesson";

  // Ball — bazadagi har savolga birinchi javob bo'yicha.
  const { data: rows } = await db.from("exam_answers").select("question_id, chosen, answered_at").eq("attempt_id", attempt.id).order("answered_at");
  const first = new Map<string, number | null>();
  for (const r of (rows ?? []) as { question_id: string; chosen: number | null }[]) if (!first.has(r.question_id)) first.set(r.question_id, r.chosen);
  const correct = keys.filter((k) => first.get(k) === findQuestion(course, k)?.q.answer).length;
  const total = keys.length;
  const passMark = kind === "lesson" ? passMarkFor(total) : total;
  const passed = correct >= passMark;

  if (attempt.passed === null) {
    const started = attempt.started_at ? Date.parse(attempt.started_at) : Date.now();
    const { error } = await db
      .from("exam_attempts")
      .update({ score: correct, passed, finished_at: new Date().toISOString(), duration_seconds: Math.min(Math.round((Date.now() - started) / 1000), 6 * 3600) })
      .eq("id", attempt.id)
      .is("passed", null);
    if (error) console.error("finishTest update:", error.message);
  }

  let saved = true;
  if (kind === "lesson" && passed) {
    const lessonId = attempt.exam.slice("lesson:".length);
    const { error } = await db
      .from("lesson_progress")
      .upsert({ user_id: user.id, course_slug: course.slug, chapter_id: lessonId, completed_at: new Date().toISOString() }, { onConflict: "user_id,course_slug,chapter_id" });
    if (error) {
      console.error("lesson_progress yozishda xato:", error.message);
      saved = false;
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`);
  return { ok: true, correct, total, answered: first.size, passed, passMark, saved };
}
