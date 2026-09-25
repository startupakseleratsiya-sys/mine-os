import type { ExamQuestion } from "./exam";
import type { ScenarioPaper } from "./scenario";

/** Imtihon vaqtida brauzerga yuboriladigan savol — javob kaliti va izohsiz. */
export type PublicQuestion = Omit<ExamQuestion, "answer" | "rationale">;

export function publicQuestion(q: ExamQuestion): PublicQuestion {
  const { answer: _answer, rationale: _rationale, ...rest } = q;
  void _answer;
  void _rationale;
  return rest;
}

/**
 * Ssenariy qog'ozining kalitsiz nusxasi: har qatorda answer = -1, explanation = "".
 * Kalit va izohlar topshirilgandan keyin serverdan keladi (withKey bilan qaytariladi).
 */
export function publicPaper(paper: ScenarioPaper): ScenarioPaper {
  return {
    ...paper,
    questions: paper.questions.map((q) => ({
      ...q,
      parts: q.parts.map((p) => ({ ...p, lines: p.lines.map((l) => ({ ...l, answer: -1, explanation: "", ref: l.ref })) })),
    })),
  };
}

export function withKey(paper: ScenarioPaper, key: Record<string, { answer: number | number[]; explanation: string }>): ScenarioPaper {
  return {
    ...paper,
    questions: paper.questions.map((q) => ({
      ...q,
      parts: q.parts.map((p) => ({ ...p, lines: p.lines.map((l) => (key[l.id] ? { ...l, ...key[l.id] } : l)) })),
    })),
  };
}
