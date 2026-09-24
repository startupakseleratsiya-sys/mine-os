/** Loyiha faqat ingliz tilida (imtihonlar ingliz tilida). */
export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const INTL_LOCALES: Record<Locale, string> = { en: "en-GB" };

export type Messages = Record<string, string>;
export function createTranslator(messages: Messages) {
  return (value: string | number | null | undefined, values?: Record<string, string | number>): string => {
    if (value == null) return "";
    const source = String(value);
    const translated = messages[source] ?? source.split("\n").map((line) => messages[line] ?? line).join("\n");
    return values ? translated.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match)) : translated;
  };
}
