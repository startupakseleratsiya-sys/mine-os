import type { ExamQuestion, ExamSpec } from "../../lib/exam";
import { FOUNDATION_BANK } from "./foundation/bank";
import { FOUNDATION_SPEC } from "./foundation/spec";

export type ExamEntry = { spec: ExamSpec; bank: ExamQuestion[] };

/** Faol imtihonlar. Preparation/Execution (ssenariy formati) keyingi bosqichda qo'shiladi. */
export const EXAMS: Record<string, ExamEntry> = {
  foundation: { spec: FOUNDATION_SPEC, bank: FOUNDATION_BANK },
};

export function getExam(slug: string): ExamEntry | undefined {
  return EXAMS[slug];
}

/** Guide nashri — barcha savollar shu nashrga moslangan. */
export const GUIDE_EDITION = "PPP Guide 2026 (v2)";
