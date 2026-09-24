/**
 * CP3P imtihon mexanikasi — sof funksiyalar (DB/React'siz, testlanadi).
 * Foundation: 50 savol, 40 daqiqa (+10 ona tili ingliz bo'lmaganlarga), o'tish 25/50, kitobsiz.
 */

export type ExamQuestion = {
  id: string;
  /** Imtihon bo'limi (statistika uchun): masalan "concept", "glossary". */
  area: string;
  section: string;
  topic: string;
  level: 1 | 2;
  style: string;
  stem: string;
  options: string[];
  answer: number;
  rationale: string[];
  ref: string;
};

export type ExamArea = { id: string; title: string; description: string; /** mock'dagi savollar soni */ mockCount: number };

export type ExamSpec = {
  slug: string;
  title: string;
  questions: number;
  minutes: number;
  extraMinutes: number;
  passMark: number;
  closedBook: boolean;
  areas: ExamArea[];
};

/** Mulberry32 — seed bilan takrorlanadigan tasodifiy sonlar (bir xil seed → bir xil mock). */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Yangi mock uchun tasodifiy seed (server komponentda to'g'ridan-to'g'ri Math.random chaqirilmasin). */
export function newSeed() {
  return Math.floor(Math.random() * 2_000_000_000) + 1;
}

/** Mashq to'plami uchun vaqtga bog'liq seed. */
export function timeSeed() {
  return Date.now() % 2_000_000_000;
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Mock tuzadi: har bo'limdan `mockCount` ta savol (spetsifikatsiya bo'yicha), avval ko'rilmaganlar ustun.
 * Bo'limda savol yetmasa, qolganini boshqa bo'limlardan to'ldiradi — jami doim `spec.questions`.
 */
export function buildMock(spec: ExamSpec, bank: ExamQuestion[], seed: number, seen: ReadonlySet<string> = new Set()) {
  const rand = seededRandom(seed);
  const picked: ExamQuestion[] = [];
  const used = new Set<string>();
  const prefer = (list: ExamQuestion[]) => [
    ...shuffle(list.filter((q) => !seen.has(q.id)), rand),
    ...shuffle(list.filter((q) => seen.has(q.id)), rand),
  ];
  for (const area of spec.areas) {
    for (const q of prefer(bank.filter((q) => q.area === area.id)).slice(0, area.mockCount)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  for (const q of prefer(bank.filter((q) => !used.has(q.id)))) {
    if (picked.length >= spec.questions) break;
    picked.push(q);
  }
  return shuffle(picked.slice(0, spec.questions), rand);
}

export type AreaScore = { correct: number; total: number };

/** answers[i] — i-savolga tanlangan variant (null = javobsiz). */
export function scoreExam(questions: ExamQuestion[], answers: (number | null)[]) {
  const areas: Record<string, AreaScore> = {};
  let correct = 0;
  questions.forEach((q, i) => {
    const ok = answers[i] === q.answer;
    if (ok) correct += 1;
    const a = (areas[q.area] ??= { correct: 0, total: 0 });
    a.total += 1;
    if (ok) a.correct += 1;
  });
  return { correct, total: questions.length, areas };
}

export function passed(spec: ExamSpec, correct: number, total: number) {
  // O'tish bali to'liq mock uchun; qisqa to'plamda nisbat bilan.
  return total === spec.questions ? correct >= spec.passMark : correct / Math.max(total, 1) >= spec.passMark / spec.questions;
}

export type AnswerRecord = { question_id: string; correct: boolean; answered_at: string };

/**
 * Tayyorlik: har bo'lim bo'yicha oxirgi `window` ta javob aniqligi, mock'dagi ulushiga qarab tortilgan.
 * Kamida `minPerArea` ta javob bo'lmagan bo'lim «ma'lumot yetarli emas» deb belgilanadi.
 */
export function readiness(spec: ExamSpec, bank: ExamQuestion[], answers: AnswerRecord[], window = 30, minPerArea = 8) {
  const areaOf = new Map(bank.map((q) => [q.id, q.area]));
  const sorted = [...answers].sort((a, b) => b.answered_at.localeCompare(a.answered_at));
  const perArea = spec.areas.map((area) => {
    const recent = sorted.filter((r) => areaOf.get(r.question_id) === area.id).slice(0, window);
    const correct = recent.filter((r) => r.correct).length;
    return {
      id: area.id,
      title: area.title,
      answered: recent.length,
      accuracy: recent.length ? correct / recent.length : null,
      enoughData: recent.length >= minPerArea,
      weight: area.mockCount / spec.questions,
    };
  });
  const known = perArea.filter((a) => a.accuracy !== null);
  const weightSum = known.reduce((s, a) => s + a.weight, 0);
  const predicted = weightSum ? known.reduce((s, a) => s + a.weight * (a.accuracy ?? 0), 0) / weightSum : null;
  const allEnough = perArea.every((a) => a.enoughData);
  const passRatio = spec.passMark / spec.questions;
  // Xavfsizlik zaxirasi: haqiqiy imtihonda stress va yangi savollar — 50% emas, ≥70% barqaror bo'lsin.
  const status = !allEnough || predicted === null ? "not-enough-data" : predicted >= 0.7 ? "ready" : predicted >= passRatio + 0.05 ? "almost" : "not-ready";
  return { perArea, predicted, status } as const;
}
