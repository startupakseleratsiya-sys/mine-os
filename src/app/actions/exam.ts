"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getExam } from "@/content/exam";
import { scoreExam } from "@/lib/exam";

const AttemptSchema = z.object({
  exam: z.string().min(1).max(40),
  // Mock endi faqat server boshqaradigan oqim orqali (actions/mock.ts) — bu yerdan faqat mashq.
  mode: z.enum(["practice"]),
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
  // Yozish faqat server kaliti bilan (foydalanuvchi bu jadvallarga o\'zi yoza olmaydi).
  const db = createAdminClient() ?? supabase;

  const result = scoreExam(qs, items.map((i) => i.chosen));
  const { data: attempt, error } = await db
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      exam: `cp3p-${examSlug}`,
      mode,
      score: result.correct,
      total: result.total,
      passed: null,
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

  const { error: answersError } = await db.from("exam_answers").insert(
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
