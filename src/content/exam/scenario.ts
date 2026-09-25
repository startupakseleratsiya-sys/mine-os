import type { ScenarioPaper, ScenarioSpec } from "../../lib/scenario";
import { EXECUTION_SPEC, PREPARATION_SPEC } from "./scenario-specs";
import prep1 from "./preparation/paper-1.json";
import prep2 from "./preparation/paper-2.json";
import prep3 from "./preparation/paper-3.json";
import exec1 from "./execution/paper-1.json";
import exec2 from "./execution/paper-2.json";
import exec3 from "./execution/paper-3.json";

/**
 * Ssenariy qog'ozlari — Finora tomonidan PPP Guide 2026 (CC BY 3.0 IGO) asosida yozilgan ORIGINAL mashq imtihonlari.
 * Har biri alohida muallif-agent yozgan va boshqa agent Guide matni bilan qatorma-qator tekshirgan
 * (scripts/check-scenario-papers.mjs tuzilmani CI'da tekshiradi).
 */
export type ScenarioExam = { spec: ScenarioSpec; papers: ScenarioPaper[] };

export const SCENARIO_EXAMS: Record<"preparation" | "execution", ScenarioExam> = {
  preparation: { spec: PREPARATION_SPEC, papers: [prep1, prep2, prep3] as ScenarioPaper[] },
  execution: { spec: EXECUTION_SPEC, papers: [exec1, exec2, exec3] as ScenarioPaper[] },
};

export function getScenarioExam(level: string): ScenarioExam | undefined {
  return level === "preparation" || level === "execution" ? SCENARIO_EXAMS[level] : undefined;
}

export function getPaper(level: string, paperId: string) {
  const exam = getScenarioExam(level);
  const paper = exam?.papers.find((p) => p.id === paperId);
  return exam && paper ? { spec: exam.spec, paper } : undefined;
}
