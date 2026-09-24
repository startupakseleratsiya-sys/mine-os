import type { ExamQuestion } from "../../../lib/exam";
import A from "./batch-A.json";
import B from "./batch-B.json";
import C from "./batch-C.json";
import D from "./batch-D.json";
import E from "./batch-E.json";
import F from "./batch-F.json";
import G from "./batch-G.json";

/**
 * Foundation savollar bazasi — Finora tomonidan PPP Guide 2026 (CC BY 3.0 IGO) asosida yozilgan ORIGINAL savollar.
 * Har bir batch Guide'ning bir qismiga mos keladi; `area` statistikadagi bo'lim (spec.ts).
 */
type Raw = Omit<ExamQuestion, "area" | "level" | "id"> & { id: string; level: number };

const withArea = (area: string, prefix: string, items: Raw[]): ExamQuestion[] =>
  items.map((q) => ({ ...q, id: `f-${prefix}-${q.id.replace(/^[A-Z]-?/, "")}`, area, level: q.level === 2 ? 2 : 1 }));

export const FOUNDATION_BANK: ExamQuestion[] = [
  ...withArea("concept", "a", A as Raw[]),
  ...withArea("scope", "b", B as Raw[]),
  ...withArea("rationale", "c", C as Raw[]),
  ...withArea("structure", "d", D as Raw[]),
  ...withArea("finance", "e", E as Raw[]),
  ...withArea("process", "f", F as Raw[]),
  ...withArea("glossary", "g", G as Raw[]),
];
