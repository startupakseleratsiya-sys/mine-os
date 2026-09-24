export const LOCALES = ["en", "ru", "uz"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "finora-language";
export const LANGUAGE_NAMES: Record<Locale, string> = { en: "English", ru: "Русский", uz: "O‘zbekcha" };
export const INTL_LOCALES: Record<Locale, string> = { en: "en-GB", ru: "ru-RU", uz: "uz-UZ" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.includes(value as Locale);
}

export type Messages = Record<string, string>;
export function createTranslator(messages: Messages) {
  return (value: string | number | null | undefined, values?: Record<string, string | number>): string => {
    if (value == null) return "";
    const source = String(value);
    const translated = messages[source] ?? source.split("\n").map((line) => messages[line] ?? line).join("\n");
    return values ? translated.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match)) : translated;
  };
}
