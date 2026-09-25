import type { ScenarioSpec } from "../../lib/scenario";

/**
 * CP3P Practitioner imtihonlari — PPP Guide 2026 (v2). Format ikkala darajada bir xil:
 * 4 savol × 20 ball = 80, 150 daqiqa (+40 ona tili ingliz bo'lmaganlarga), o'tish 40/80, ochiq kitob.
 */
const COMMON = { marks: 80, minutes: 150, extraMinutes: 40, passMark: 40, minutesPerQuestion: 35 } as const;

export const PREPARATION_SPEC: ScenarioSpec = {
  ...COMMON,
  slug: "preparation",
  title: "CP3P Preparation",
  areas: [
    { id: "EF", title: "Establishing a PPP framework", description: "Chapter 2 — why and how a PPP framework is set up: legal instruments, the PPP process, institutional roles and oversight." },
    { id: "IP", title: "Project identification and PPP screening", description: "Chapter 3 — identifying projects from the infrastructure plan and screening them for PPP suitability." },
    { id: "AP", title: "Appraising PPP projects", description: "Chapter 4 — feasibility, economic analysis, commercial feasibility, value for money, fiscal affordability and responsibility." },
    { id: "SC", title: "Structuring (financial structure and risk)", description: "Chapter 5 §1–§5 — financial structuring, revenue regimes, payment mechanisms and risk allocation." },
  ],
};

export const EXECUTION_SPEC: ScenarioSpec = {
  ...COMMON,
  slug: "execution",
  title: "CP3P Execution",
  areas: [
    { id: "SC", title: "Structuring and drafting the tender and contract", description: "Chapter 5 §6–§10 — market testing, qualification criteria, the RFP, evaluation criteria and contract provisions." },
    { id: "TA", title: "Tendering and awarding the contract", description: "Chapter 6 — running the tender, evaluation, the preferred bidder, award, signature and financial close." },
    { id: "CC", title: "Contract management — construction", description: "Chapter 7 §1–§11 — the contract management framework, monitoring, change, claims and disputes during construction." },
    { id: "OM", title: "Contract management — operations", description: "Chapter 7 §12–§21 — performance monitoring, payments, fiscal risk, termination, expiry and handback." },
  ],
};

export const SCENARIO_SPECS = { preparation: PREPARATION_SPEC, execution: EXECUTION_SPEC } as const;
