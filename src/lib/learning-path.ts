/**
 * O'quv yo'li qoidalari — sof funksiyalar (testlanadi).
 * Test: darsning 10 savoli + oldingi darslardan 2 ta takrorlash savoli (interleaving / spaced retrieval), o'tish ≥80%.
 */
type Quiz = { question: string; options: string[]; answer: number; explanation: string };
type LessonLike = { id: string; quiz: Quiz[] };

/** Testdan o'tish chegarasi (mastery learning). */
export const PASS_RATIO = 0.8;

export type TestItem = { key: string; lessonId: string; q: Quiz; review: boolean };

/** Takrorlash savollari darsga qarab deterministik tanlanadi — server va client bir xil to'plamni ko'radi. */
export function lessonTest(course: { chapters: LessonLike[] }, lessonId: string): TestItem[] {
  const index = course.chapters.findIndex((l) => l.id === lessonId);
  if (index === -1) return [];
  const lesson = course.chapters[index];
  const own = lesson.quiz.map((q, i) => ({ key: `${lesson.id}#${i}`, lessonId: lesson.id, q, review: false }));
  const earlier = course.chapters.slice(0, index).flatMap((l) => l.quiz.map((q, i) => ({ key: `${l.id}#${i}`, lessonId: l.id, q, review: true })));
  let h = 0;
  for (const ch of lesson.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const picks: TestItem[] = [];
  for (let k = 0; k < 2 && earlier.length; k++) {
    h = (h * 1103515245 + 12345) >>> 0;
    picks.push(earlier.splice(h % earlier.length, 1)[0]);
  }
  return [...own, ...picks];
}

export function passMarkFor(total: number) {
  return Math.ceil(total * PASS_RATIO);
}

/** Brauzerga yuboriladigan savol — javob kaliti va izohsiz (test chetlab o'tilmasin). */
export type PublicItem = { key: string; question: string; options: string[]; review: boolean };

export function toPublic(items: TestItem[]): PublicItem[] {
  return items.map((it) => ({ key: it.key, question: it.q.question, options: it.q.options, review: it.review }));
}

/** Kalit bo'yicha savol: "lessonId#index". Kurs ichidagi istalgan dars savoli. */
export function findQuestion(course: { chapters: LessonLike[] }, key: string) {
  const hash = key.lastIndexOf("#");
  if (hash < 0) return undefined;
  const lesson = course.chapters.find((l) => l.id === key.slice(0, hash));
  const q = lesson?.quiz[Number(key.slice(hash + 1))];
  return lesson && q ? { lessonId: lesson.id, q } : undefined;
}

export type AnswerRow = { question_id: string; correct: boolean; answered_at: string };

/**
 * Xatolar daftari: oxirgi javobi noto'g'ri bo'lgan savollar (eng eskisi birinchi).
 * To'g'ri javob berilgach ro'yxatdan chiqadi — spaced retrieval.
 */
export function mistakes(rows: AnswerRow[]) {
  const latest = new Map<string, AnswerRow>();
  for (const r of rows) {
    const cur = latest.get(r.question_id);
    if (!cur || r.answered_at > cur.answered_at) latest.set(r.question_id, r);
  }
  return [...latest.values()].filter((r) => !r.correct).sort((a, b) => a.answered_at.localeCompare(b.answered_at)).map((r) => r.question_id);
}

/** Oxirgi `window` ta javob aniqligi (tayyorlik ko'rsatkichi). */
export function recentAccuracy(rows: AnswerRow[], window = 60) {
  const recent = [...rows].sort((a, b) => b.answered_at.localeCompare(a.answered_at)).slice(0, window);
  return recent.length ? { accuracy: recent.filter((r) => r.correct).length / recent.length, answered: recent.length } : null;
}
