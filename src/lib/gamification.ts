/**
 * O'yin elementlari — sof funksiyalar (testlanadi).
 * XP: to'g'ri javob berilgan har bir NOYOB savol 10, topshirilgan har dars 100, o'tilgan har simulyatsiya 300.
 * (Qayta topshirishda bir xil savol ikki marta XP bermaydi — «farm» qilib bo'lmaydi.)
 * Daraja: har 1000 XP. Yulduz: dars testidagi eng yaxshi natija bo'yicha 1–3.
 */
export const XP = { question: 10, lesson: 100, mock: 300 } as const;
export const XP_PER_LEVEL = 1000;

export type LessonAttempt = { exam: string; score: number; total: number };

export function starsFor(correct: number, total: number) {
  if (total > 0 && correct >= total) return 3;
  const pass = Math.ceil(total * 0.92 - 1e-9);
  if (correct < pass) return 0;
  return correct >= pass + Math.ceil((total - pass) / 2) ? 2 : 1;
}

/** Har dars uchun eng yaxshi yulduz soni: exam = "lesson:<lessonId>". */
export function bestStars(attempts: LessonAttempt[]) {
  const out: Record<string, number> = {};
  for (const a of attempts) {
    if (!a.exam.startsWith("lesson:")) continue;
    const id = a.exam.slice(7);
    out[id] = Math.max(out[id] ?? 0, starsFor(a.score, a.total));
  }
  return out;
}

export function xpTotal(input: { correctQuestionIds: Iterable<string>; lessonsPassed: number; mocksPassed: number }) {
  const unique = new Set(input.correctQuestionIds).size;
  return unique * XP.question + input.lessonsPassed * XP.lesson + input.mocksPassed * XP.mock;
}

export function levelOf(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const into = xp % XP_PER_LEVEL;
  return { level, into, next: XP_PER_LEVEL, progress: into / XP_PER_LEVEL };
}

/**
 * Test davomidagi «xavfsizlik zaxirasi»: o'tish chizig'idan tushmay yana nechta savolda xato qilish mumkin.
 * Manfiy bo'lsa — bu urinishda o'tish endi imkonsiz.
 */
export function missesLeft(total: number, passMark: number, wrong: number) {
  return total - passMark - wrong;
}

/** Ketma-ket to'g'ri javoblar seriyasi uchun qisqa maqtov (yo'q bo'lsa — null). */
export function comboLabel(streak: number) {
  if (streak >= 20) return "Unstoppable";
  if (streak >= 10) return "On fire";
  if (streak >= 5) return "Hot streak";
  return null;
}

/** Kurs xaritasidagi tugun siljishi (0–2): yumshoq to'lqin 0,1,2,1,0,1,2,1… */
export function pathOffset(index: number) {
  return [0, 1, 2, 1][((index % 4) + 4) % 4];
}
