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
