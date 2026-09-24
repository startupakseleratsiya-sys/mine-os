import type { ExamSpec } from "../../../lib/exam";

/**
 * CP3P Foundation — PPP Guide 2026 (v2): 1-bob + Glossary.
 * Rasmiy format: 50 ta oddiy test (4 variant, 1 to'g'ri), 40 daqiqa, kitobsiz, o'tish 25/50.
 * Manba: ppp-certification.com/faqs, /book-your-exam. Bo'limlar — Guide'dagi og'irligiga qarab.
 */
export const FOUNDATION_SPEC: ExamSpec = {
  slug: "foundation",
  title: "CP3P Foundation",
  questions: 50,
  minutes: 40,
  extraMinutes: 10,
  passMark: 25,
  closedBook: true,
  areas: [
    { id: "concept", title: "PPP definition, types and sectors", description: "Chapter 1 §1, §3, §4 — what a PPP is, its key features, types and terminology, and where PPPs are used.", mockCount: 7 },
    { id: "scope", title: "What is and is not a PPP", description: "Chapter 1 §2 — traditional procurement, DBOM, management and O&M contracts, leases and affermage, concessions and privatization.", mockCount: 8 },
    { id: "rationale", title: "When to use PPPs", description: "Chapter 1 §5 — access to finance, efficiency and value for money, benefits, pitfalls and the conditions for success.", mockCount: 8 },
    { id: "structure", title: "Project structure and failure", description: "Chapter 1 §6 and §8 — parties, the project company, payment mechanisms, and why projects fail.", mockCount: 7 },
    { id: "finance", title: "How PPPs are financed", description: "Chapter 1 §7 and Appendix A — project finance, equity and debt, sources, co-financing and public support.", mockCount: 7 },
    { id: "process", title: "Framework and process cycle", description: "Chapter 1 §9 and §10 — the PPP framework and the phases from identification to contract management.", mockCount: 6 },
    { id: "glossary", title: "Glossary and acronyms", description: "The PPP Guide Glossary — the key terms examined at Foundation.", mockCount: 7 },
  ],
};
