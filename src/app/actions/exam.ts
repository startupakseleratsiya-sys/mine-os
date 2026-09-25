"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { getExam } from "@/content/exam";
import { passed, scoreExam } from "@/lib/exam";
import { getPaper } from "@/content/exam/scenario";
import { flattenLines, isLineCorrect, lineKey, scenarioPassed, scorePaper } from "@/lib/scenario";

const AttemptSchema = z.object({
  exam: z.string().min(1).max(40),
  mode: z.enum(["mock", "practice"]),
  items: z
    .array(z.object({ questionId: z.string().min(1).max(40), chosen: z.number().int().min(0).max(4).nullable() }))
    .min(1)
    .max(120),
  startedAt: z.string().datetime().optional(),
  // Mijoz vaqti localStorage'dan tiklanadi (kun o'tib qaytish mumkin) — rad etmay, serverda cheklanadi.
  durationSeconds: z.number().int().min(0).optional(),
});

export type SaveAttemptResult = { ok: true; attemptId: string | null } | { ok: false; error: string };

/**
 * Urinishni saqlaydi. Ball serverda qayta hisoblanadi — clientdan kelgan «to'g'ri/noto'g'ri»ga ishonilmaydi.
 */
export async function saveExamAttempt(input: z.infer<typeof AttemptSchema>): Promise<SaveAttemptResult> {
  const parsed = AttemptSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid attempt data." };
  const { exam: examSlug, mode, items, startedAt, durationSeconds } = parsed.data;

  const exam = getExam(examSlug);
  if (!exam) return { ok: false, error: "Unknown exam." };
  const byId = new Map(exam.bank.map((q) => [q.id, q]));
  const questions = items.map((item) => byId.get(item.questionId));
  if (questions.some((q) => !q)) return { ok: false, error: "Unknown question." };
  const qs = questions as NonNullable<(typeof questions)[number]>[];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign-in required." };

  const result = scoreExam(qs, items.map((i) => i.chosen));
  const { data: attempt, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      exam: `cp3p-${examSlug}`,
      mode,
      score: result.correct,
      total: result.total,
      passed: mode === "mock" ? passed(exam.spec, result.correct, result.total) : null,
      duration_seconds: durationSeconds === undefined ? null : Math.min(durationSeconds, 6 * 3600),
      area_scores: result.areas,
      started_at: startedAt ?? null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("exam_attempts yozishda xato:", error.message);
    return { ok: false, error: error.code === "PGRST205" ? "Results storage is not set up yet." : "Could not save your result. Please try again." };
  }

  const { error: answersError } = await supabase.from("exam_answers").insert(
    items.map((item, i) => ({
      user_id: user.id,
      attempt_id: attempt.id,
      exam: `cp3p-${examSlug}`,
      question_id: item.questionId,
      chosen: item.chosen,
      correct: item.chosen === qs[i].answer,
    })),
  );
  if (answersError) console.error("exam_answers yozishda xato:", answersError.message);

  revalidatePath("/exam");
  revalidatePath(`/exam/${examSlug}`);
  return { ok: true, attemptId: attempt.id };
}

const ScenarioAttemptSchema = z.object({
  level: z.enum(["preparation", "execution"]),
  paperId: z.string().min(1).max(40),
  mode: z.enum(["mock", "practice"]),
  /** Faqat shu savollar (mashqda bitta savol); mock'da hammasi. */
  questions: z.array(z.number().int().min(1).max(4)).min(1).max(4),
  /** lineId → javob kodi (indeks yoki multiple-response bitmask). */
  responses: z.record(z.string().max(20), z.number().int().min(0).max(127).nullable()),
  startedAt: z.string().datetime().optional(),
  // Mijoz vaqti localStorage'dan tiklanadi (kun o'tib qaytish mumkin) — rad etmay, serverda cheklanadi.
  durationSeconds: z.number().int().min(0).optional(),
});

/** Ssenariy imtihoni urinishini saqlaydi; ball serverda kalit bilan qayta hisoblanadi. */
export async function saveScenarioAttempt(input: z.infer<typeof ScenarioAttemptSchema>): Promise<SaveAttemptResult> {
  const parsed = ScenarioAttemptSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid attempt data." };
  const { level, paperId, mode, questions, responses, startedAt, durationSeconds } = parsed.data;
  const found = getPaper(level, paperId);
  if (!found) return { ok: false, error: "Unknown paper." };
  const { spec, paper } = found;
  const numbers = mode === "mock" ? [1, 2, 3, 4] : [...new Set(questions)];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign-in required." };

  const score = scorePaper(paper, responses, numbers);
  const exam = `cp3p-${level}`;
  const { data: attempt, error } = await supabase
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      exam,
      mode,
      score: score.correct,
      total: score.total,
      passed: mode === "mock" ? scenarioPassed(spec, score.correct, score.total) : null,
      duration_seconds: durationSeconds === undefined ? null : Math.min(durationSeconds, 6 * 3600),
      area_scores: score.areas,
      started_at: startedAt ?? null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("exam_attempts yozishda xato:", error.message);
    return { ok: false, error: error.code === "PGRST205" ? "Results storage is not set up yet." : "Could not save your result. Please try again." };
  }

  const { error: answersError } = await supabase.from("exam_answers").insert(
    flattenLines(paper, numbers).map(({ part, line }) => {
      const chosen = responses[line.id] ?? null;
      return {
        user_id: user.id,
        attempt_id: attempt.id,
        exam,
        question_id: lineKey(paper.id, line.id),
        chosen,
        correct: isLineCorrect(part.type, line, chosen),
      };
    }),
  );
  if (answersError) console.error("exam_answers yozishda xato:", answersError.message);

  revalidatePath("/exam");
  revalidatePath(`/exam/${level}`);
  return { ok: true, attemptId: attempt.id };
}
