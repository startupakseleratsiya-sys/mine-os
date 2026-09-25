/**
 * Leitner tizimi (spaced repetition): karta to'g'ri topilsa keyingi qutiga o'tadi va keyinroq qaytadi,
 * xato bo'lsa 1-qutiga tushadi. Sof funksiyalar — testlanadi.
 */
export type CardState = { box: number; due: number };

/** Qutilar bo'yicha qaytish oralig'i (kun): 1-quti — o'sha kuni, 5-quti — 21 kundan keyin. */
export const BOX_DAYS = [0, 1, 3, 7, 21];
const DAY = 86_400_000;

export function review(state: CardState | undefined, knew: boolean, now: number): CardState {
  const box = knew ? Math.min((state?.box ?? 0) + 1, BOX_DAYS.length) : 1;
  const days = knew ? BOX_DAYS[box - 1] : 0;
  // Xato bo'lsa 10 daqiqadan keyin shu sessiyada qayta chiqadi.
  return { box, due: now + (knew ? days * DAY : 10 * 60_000) };
}

export function isDue(state: CardState | undefined, now: number) {
  return !state || state.due <= now;
}

/** Sessiya: avval muddati kelganlar (eng eski birinchi), keyin yangi kartalar (sessiyaga `newLimit` tagacha). */
export function buildSession<T extends { id: string }>(cards: T[], states: Record<string, CardState>, now: number, size = 20, newLimit = 10) {
  const due = cards.filter((c) => states[c.id] && states[c.id].due <= now).sort((a, b) => states[a.id].due - states[b.id].due);
  const fresh = cards.filter((c) => !states[c.id]).slice(0, newLimit);
  return [...due, ...fresh].slice(0, size);
}

export function masteryStats(cards: { id: string }[], states: Record<string, CardState>) {
  let learned = 0;
  let mastered = 0;
  for (const c of cards) {
    const s = states[c.id];
    if (!s) continue;
    learned += 1;
    if (s.box >= 4) mastered += 1;
  }
  return { total: cards.length, learned, mastered };
}
