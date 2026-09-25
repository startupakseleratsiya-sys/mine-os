/**
 * CP3P Preparation / Execution (Practitioner) imtihon mexanikasi — sof funksiyalar.
 * Rasmiy format: 1 ssenariy + 4 savol × 20 qator (har qator 1 ball) = 80, 150 daqiqa (+40), o'tish 40/80, ochiq kitob.
 * Manba: APMG «CP3P Preparation & Execution Exam — Candidate Guidance» v5.0.
 */

export type LineType = "classic" | "multiple-response" | "matching" | "sequencing" | "assertion-reason";

export type ScenarioLine = {
  id: string;
  stem: string;
  /** classic / multiple-response / assertion-reason — qatorning o'z variantlari. */
  options?: string[];
  /** Indeks; multiple-response uchun ikkita indeks. */
  answer: number | number[];
  explanation: string;
  ref: string;
};

export type ScenarioPart = {
  id: string;
  type: LineType;
  level: 2 | 3 | 4;
  instruction: string;
  usesAdditionalInfo?: boolean;
  /** matching / sequencing — 2-ustun (umumiy variantlar). */
  columnOptions?: string[];
  lines: ScenarioLine[];
};

export type ScenarioQuestion = {
  number: number;
  area: string;
  title: string;
  additionalInfo: string | null;
  parts: ScenarioPart[];
};

export type ScenarioPaper = {
  id: string;
  level: "preparation" | "execution";
  title: string;
  sector: string;
  scenario: string;
  questions: ScenarioQuestion[];
};

export type ScenarioSpec = {
  slug: "preparation" | "execution";
  title: string;
  marks: number;
  minutes: number;
  extraMinutes: number;
  passMark: number;
  /** Tavsiya: 5 daqiqa o'qish + har savolga 35 daqiqa. */
  minutesPerQuestion: number;
  areas: { id: string; title: string; description: string }[];
};

export const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

/**
 * Javob kodi (DB'da smallint): oddiy turlarda — variant indeksi; multiple-response'da — bitmask
 * (masalan A va D → 0b01001 = 9). null — javobsiz.
 */
export type Response = number | null;

export function maskOf(indexes: number[]) {
  return indexes.reduce((m, i) => m | (1 << i), 0);
}

export function indexesOf(mask: number) {
  const out: number[] = [];
  for (let i = 0; i < 7; i++) if (mask & (1 << i)) out.push(i);
  return out;
}

/** Imtihondagidek: multiple-response'da aynan 2 ta javob va ikkalasi to'g'ri bo'lsagina ball. */
export function isLineCorrect(type: LineType, line: ScenarioLine, response: Response) {
  if (response === null || response === undefined) return false;
  if (type === "multiple-response") {
    const want = Array.isArray(line.answer) ? line.answer : [line.answer];
    return response === maskOf(want) && indexesOf(response).length === 2;
  }
  return response === line.answer;
}

export type FlatLine = { question: ScenarioQuestion; part: ScenarioPart; line: ScenarioLine };

export function flattenLines(paper: ScenarioPaper, questionNumbers?: number[]): FlatLine[] {
  return paper.questions
    .filter((q) => !questionNumbers || questionNumbers.includes(q.number))
    .flatMap((question) => question.parts.flatMap((part) => part.lines.map((line) => ({ question, part, line }))));
}

/** DB'dagi savol identifikatori: qog'oz + qator (boshqa qog'ozlar bilan to'qnashmaydi). */
export function lineKey(paperId: string, lineId: string) {
  return `${paperId}:${lineId}`;
}

export type ScenarioScore = {
  correct: number;
  total: number;
  areas: Record<string, { correct: number; total: number }>;
  types: Record<string, { correct: number; total: number }>;
};

export function scorePaper(paper: ScenarioPaper, responses: Record<string, Response>, questionNumbers?: number[]): ScenarioScore {
  const score: ScenarioScore = { correct: 0, total: 0, areas: {}, types: {} };
  for (const { question, part, line } of flattenLines(paper, questionNumbers)) {
    const ok = isLineCorrect(part.type, line, responses[line.id] ?? null);
    score.total += 1;
    if (ok) score.correct += 1;
    const a = (score.areas[question.area] ??= { correct: 0, total: 0 });
    const t = (score.types[part.type] ??= { correct: 0, total: 0 });
    a.total += 1;
    t.total += 1;
    if (ok) {
      a.correct += 1;
      t.correct += 1;
    }
  }
  return score;
}

export function scenarioPassed(spec: ScenarioSpec, correct: number, total: number) {
  return total === spec.marks ? correct >= spec.passMark : correct / Math.max(total, 1) >= spec.passMark / spec.marks;
}

/** Qator javob berilganmi (multiple-response'da aynan 2 ta tanlangan bo'lishi kerak). */
export function isAnswered(type: LineType, response: Response) {
  if (response === null || response === undefined) return false;
  return type === "multiple-response" ? indexesOf(response).length === 2 : true;
}

export const TYPE_LABEL: Record<LineType, string> = {
  classic: "Classic multiple choice",
  "multiple-response": "Multiple response (choose 2)",
  matching: "Matching",
  sequencing: "Sequencing",
  "assertion-reason": "Assertion–reason",
};

export const TYPE_TIP: Record<LineType, string> = {
  classic: "Choose the one best option for the scenario, not just a statement that is true in general.",
  "multiple-response": "Select exactly 2. Both must be right to earn the mark; 1 or 3 selections score zero.",
  matching: "Each Column 2 option may be used once, more than once or not at all.",
  sequencing: "Each position is used exactly once. Anchor the first and last steps, then fill the middle.",
  "assertion-reason": "The mark needs a true assertion AND a true reason that actually explains it.",
};
