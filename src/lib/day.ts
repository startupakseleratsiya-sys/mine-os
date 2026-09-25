/**
 * Kun chegarasi foydalanuvchi vaqtida: Toshkent va Qozog'iston (2024-dan butun KZ) — UTC+5, yozgi vaqt yo'q.
 * Server UTC'da ishlaydi; UTC bo'yicha hisoblansa 00:00–05:00 dagi dars «kecha»ga tushib, streak uzilardi (TIME-01).
 */
export const DAY_MS = 86_400_000;
export const USER_UTC_OFFSET_MS = 5 * 3_600_000;

export function dayKey(date: Date) {
  return new Date(date.getTime() + USER_UTC_OFFSET_MS).toISOString().slice(0, 10);
}

/** Ketma-ket faol kunlar (bugun yoki kecha bilan tugaydigan). now — testlar uchun. */
export function computeStreak(rows: { completed_at: string }[], now = new Date()) {
  const days = new Set(rows.map((r) => dayKey(new Date(r.completed_at))));
  if (days.size === 0) return 0;
  let t = now.getTime();
  if (!days.has(dayKey(new Date(t)))) {
    t -= DAY_MS;
    if (!days.has(dayKey(new Date(t)))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(new Date(t)))) {
    streak += 1;
    t -= DAY_MS;
  }
  return streak;
}
