/**
 * O'quv yo'li qoidalari — sof funksiyalar (testlanadi).
 * Dars testi: darsning 50 savoli (mijoz talabi 2026-09-25), o'tish 46/50 (92%).
 * Oldingi darslar savollari «Review my mistakes» orqali qaytadi (spaced retrieval).
 */
type Quiz = { question: string; options: string[]; answer: number; explanation: string };
type LessonLike = { id: string; quiz: Quiz[] };

/** Testdan o'tish chegarasi (mastery learning): 46/50. */
export const PASS_RATIO = 0.92;

export type TestItem = { key: string; lessonId: string; q: Quiz; review: boolean };

export function lessonTest(course: { chapters: LessonLike[] }, lessonId: string): TestItem[] {
  const lesson = course.chapters.find((l) => l.id === lessonId);
  if (!lesson) return [];
  return lesson.quiz.map((q, i) => ({ key: `${lesson.id}#${i}`, lessonId: lesson.id, q, review: false }));
}

export function passMarkFor(total: number) {
  return Math.ceil(total * PASS_RATIO - 1e-9);
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
