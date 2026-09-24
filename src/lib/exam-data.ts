import { createClient } from "@/lib/supabase-server";
import type { AnswerRecord, AreaScore } from "@/lib/exam";

export type AttemptRow = {
  id: string;
  mode: "mock" | "practice";
  score: number;
  total: number;
  passed: boolean | null;
  duration_seconds: number | null;
  area_scores: Record<string, AreaScore>;
  finished_at: string;
};

/** Foydalanuvchining imtihon tarixi va javoblari. Jadval yo'q bo'lsa — bo'sh (sahifa yiqilmaydi). */
export async function getExamHistory(userId: string, exam: string) {
  const supabase = await createClient();
  const [attempts, answers] = await Promise.all([
    supabase
      .from("exam_attempts")
      .select("id, mode, score, total, passed, duration_seconds, area_scores, finished_at")
      .eq("user_id", userId)
      .eq("exam", exam)
      .order("finished_at", { ascending: false })
      .limit(50),
    supabase
      .from("exam_answers")
      .select("question_id, correct, answered_at")
      .eq("user_id", userId)
      .eq("exam", exam)
      .order("answered_at", { ascending: false })
      .limit(2000),
  ]);
  if (attempts.error) console.error("exam_attempts o'qishda xato:", attempts.error.message);
  if (answers.error) console.error("exam_answers o'qishda xato:", answers.error.message);
  return {
    attempts: (attempts.data ?? []) as AttemptRow[],
    answers: (answers.data ?? []) as AnswerRecord[],
    storageReady: !attempts.error,
  };
}
