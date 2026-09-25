"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getExam } from "@/content/exam";
import { getPaper } from "@/content/exam/scenario";
import { buildMock, passed as isPassed, scoreExam } from "@/lib/exam";
import { getExamHistory } from "@/lib/exam-data";
import { flattenLines, isLineCorrect, lineKey, scenarioPassed, scorePaper } from "@/lib/scenario";
import { publicQuestion, type PublicQuestion } from "@/lib/exam-public";

/**
 * Imtihon simulyatsiyalari — server boshqaradi (sertifikat shunga tayanadi):
 *  • savollar to'plamini server tanlaydi va urinishga yozadi (brauzer tanlay olmaydi);
 *  • javob kalitlari imtihon vaqtida brauzerga yuborilmaydi, faqat topshirilgandan keyin;
 *  • vaqt serverda: muddatdan GRACE daqiqadan kech topshirilsa «o'tdi» deb hisoblanmaydi.
 */
const GRACE_MS = 3 * 60_000;

async function ctx() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, db: createAdminClient() ?? supabase };
}

type AttemptRow = { id: string; user_id: string; exam: string; mode: string; passed: boolean | null; started_at: string | null; area_scores: Record<string, unknown> };

async function loadOpen(db: Awaited<ReturnType<typeof ctx>>["db"], id: string, userId: string) {
  const { data } = await db.from("exam_attempts").select("id, user_id, exam, mode, passed, started_at, area_scores").eq("id", id).maybeSingle();
  const a = data as AttemptRow | null;
  return a && a.user_id === userId ? a : null;
}

// ─────────────────────────── Foundation mock ───────────────────────────

export type StartMockResult = { ok: true; attemptId: string; questions: PublicQuestion[]; startedAt: string; endsAt: number } | { ok: false; error: string };

export async function startMock(input: { exam: string; seed: number; extra: boolean }): Promise<StartMockResult> {
  const parsed = z.object({ exam: z.string().max(40), seed: z.number().int().positive(), extra: z.boolean() }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const exam = getExam(parsed.data.exam);
  if (!exam) return { ok: false, error: "Unknown exam." };
  const { user, db } = await ctx();
  if (!user) return { ok: false, error: "Sign in to take the mock." };
  const history = await getExamHistory(user.id, `cp3p-${exam.spec.slug}`);
  const questions = buildMock(exam.spec, exam.bank, parsed.data.seed, new Set(history.answers.map((a) => a.question_id)));
  const started = new Date();
  const endsAt = started.getTime() + (exam.spec.minutes + (parsed.data.extra ? exam.spec.extraMinutes : 0)) * 60_000;
  const { data, error } = await db
    .from("exam_attempts")
    .insert({ user_id: user.id, exam: `cp3p-${exam.spec.slug}`, mode: "mock", score: 0, total: questions.length, passed: null, started_at: started.toISOString(), area_scores: { ids: questions.map((q) => q.id), endsAt } })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "Could not start the mock. Please try again." };
  return { ok: true, attemptId: data.id, questions: questions.map(publicQuestion), startedAt: started.toISOString(), endsAt };
}

export type MockReview = { id: string; answer: number; rationale: string[] };
export type SubmitMockResult =
  | { ok: true; correct: number; total: number; passed: boolean; late: boolean; areas: Record<string, { correct: number; total: number }>; review: MockReview[] }
  | { ok: false; error: string };

export async function submitMock(input: { attemptId: string; answers: (number | null)[] }): Promise<SubmitMockResult> {
  const parsed = z.object({ attemptId: z.string().uuid(), answers: z.array(z.number().int().min(0).max(3).nullable()).max(120) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid submission." };
  const { user, db } = await ctx();
  if (!user) return { ok: false, error: "Your session has expired — sign in again, then press “Try again”." };
  const attempt = await loadOpen(db, parsed.data.attemptId, user.id);
  const exam = attempt && getExam(attempt.exam.replace(/^cp3p-/, ""));
  const ids = attempt?.area_scores.ids as string[] | undefined;
  if (!attempt || attempt.mode !== "mock" || !exam || !Array.isArray(ids)) return { ok: false, error: "Mock not found." };
  const byId = new Map(exam.bank.map((q) => [q.id, q]));
  const questions = ids.map((id) => byId.get(id)).filter((q): q is NonNullable<typeof q> => Boolean(q));
  const answers = questions.map((_, i) => parsed.data.answers[i] ?? null);
  const score = scoreExam(questions, answers);
  const late = Date.now() > Number(attempt.area_scores.endsAt ?? 0) + GRACE_MS;
  const pass = !late && isPassed(exam.spec, score.correct, score.total) && score.total === exam.spec.questions;
  const review = questions.map((q) => ({ id: q.id, answer: q.answer, rationale: q.rationale }));

  // Birinchi topshirish yakuniy: qayta yuborilsa, saqlangan natija qayta hisoblanmaydi.
  if (attempt.passed === null) {
    const started = attempt.started_at ? Date.parse(attempt.started_at) : Date.now();
    const { error } = await db
      .from("exam_attempts")
      .update({ score: score.correct, total: score.total, passed: pass, finished_at: new Date().toISOString(), duration_seconds: Math.min(Math.round((Date.now() - started) / 1000), 6 * 3600), area_scores: score.areas })
      .eq("id", attempt.id)
      .is("passed", null);
    if (error) return { ok: false, error: "Could not save your result. Please try again." };
    await db.from("exam_answers").insert(questions.map((q, i) => ({ user_id: user.id, attempt_id: attempt.id, exam: attempt.exam, question_id: q.id, chosen: answers[i], correct: answers[i] === q.answer })));
  }
  revalidatePath("/exam");
  revalidatePath(`/exam/${exam.spec.slug}`);
  revalidatePath("/courses/cp3p-foundation");
  return { ok: true, correct: score.correct, total: score.total, passed: pass, late, areas: score.areas, review };
}

// ─────────────────────────── Scenario papers ───────────────────────────

const ScenarioStart = z.object({ level: z.enum(["preparation", "execution"]), paperId: z.string().max(40), mode: z.enum(["mock", "practice"]), questions: z.array(z.number().int().min(1).max(4)).min(1).max(4), extra: z.boolean() });
export type StartScenarioResult = { ok: true; attemptId: string; startedAt: string; endsAt: number } | { ok: false; error: string };

export async function startScenario(input: z.infer<typeof ScenarioStart>): Promise<StartScenarioResult> {
  const parsed = ScenarioStart.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { level, paperId, mode, extra } = parsed.data;
  const found = getPaper(level, paperId);
  if (!found) return { ok: false, error: "Unknown paper." };
  const { user, db } = await ctx();
  if (!user) return { ok: false, error: "Sign in to take the exam." };
  const numbers = mode === "mock" ? [1, 2, 3, 4] : [...new Set(parsed.data.questions)];
  const total = flattenLines(found.paper, numbers).length;
  const minutes = mode === "mock" ? found.spec.minutes + (extra ? found.spec.extraMinutes : 0) : found.spec.minutesPerQuestion * numbers.length + (extra ? 10 * numbers.length : 0);
  const started = new Date();
  const endsAt = started.getTime() + minutes * 60_000;
  const { data, error } = await db
    .from("exam_attempts")
    .insert({ user_id: user.id, exam: `cp3p-${level}`, mode, score: 0, total, passed: null, started_at: started.toISOString(), area_scores: { paper: paperId, numbers, endsAt } })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "Could not start. Please try again." };
  return { ok: true, attemptId: data.id, startedAt: started.toISOString(), endsAt };
}

export type ScenarioKey = Record<string, { answer: number | number[]; explanation: string }>;
export type SubmitScenarioResult =
  | { ok: true; correct: number; total: number; passed: boolean; late: boolean; key: ScenarioKey }
  | { ok: false; error: string };

export async function submitScenario(input: { attemptId: string; responses: Record<string, number | null> }): Promise<SubmitScenarioResult> {
  const parsed = z.object({ attemptId: z.string().uuid(), responses: z.record(z.string().max(20), z.number().int().min(0).max(127).nullable()) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid submission." };
  const { user, db } = await ctx();
  if (!user) return { ok: false, error: "Your session has expired — sign in again, then press “Try again”." };
  const attempt = await loadOpen(db, parsed.data.attemptId, user.id);
  const level = attempt?.exam.replace(/^cp3p-/, "") ?? "";
  const found = attempt ? getPaper(level, String(attempt.area_scores.paper ?? "")) : undefined;
  const numbers = attempt?.area_scores.numbers as number[] | undefined;
  if (!attempt || !found || !Array.isArray(numbers)) return { ok: false, error: "Exam not found." };
  const { spec, paper } = found;
  const responses = parsed.data.responses;
  const score = scorePaper(paper, responses, numbers);
  const late = attempt.mode === "mock" && Date.now() > Number(attempt.area_scores.endsAt ?? 0) + GRACE_MS;
  const pass = !late && scenarioPassed(spec, score.correct, score.total) && (attempt.mode !== "mock" || score.total === spec.marks);
  const lines = flattenLines(paper, numbers);
  const key: ScenarioKey = Object.fromEntries(lines.map(({ line }) => [line.id, { answer: line.answer, explanation: line.explanation }]));

  if (attempt.passed === null) {
    const started = attempt.started_at ? Date.parse(attempt.started_at) : Date.now();
    const { error } = await db
      .from("exam_attempts")
      .update({ score: score.correct, total: score.total, passed: attempt.mode === "mock" ? pass : pass, finished_at: new Date().toISOString(), duration_seconds: Math.min(Math.round((Date.now() - started) / 1000), 6 * 3600), area_scores: score.areas })
      .eq("id", attempt.id)
      .is("passed", null);
    if (error) return { ok: false, error: "Could not save your result. Please try again." };
    await db.from("exam_answers").insert(
      lines.map(({ part, line }) => {
        const chosen = responses[line.id] ?? null;
        return { user_id: user.id, attempt_id: attempt.id, exam: attempt.exam, question_id: lineKey(paper.id, line.id), chosen, correct: isLineCorrect(part.type, line, chosen) };
      }),
    );
  }
  revalidatePath("/exam");
  revalidatePath(`/exam/${level}`);
  revalidatePath(`/courses/cp3p-${level}`);
  return { ok: true, correct: score.correct, total: score.total, passed: pass, late, key };
}
