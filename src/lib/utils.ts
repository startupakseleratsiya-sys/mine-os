import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/**
 * O'zbekcha sana: "7-sentabr, 2026". Brauzer ICU'sida uz-UZ oy nomlari yo'q
 * (toLocaleDateString "M09" qaytaradi), shuning uchun qo'lda.
 */
export function formatDateUz(value: string | Date, withYear = true) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  const base = `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}`;
  return withYear ? `${base}, ${d.getFullYear()}` : base;
}
