import { cache } from "react";
import { cookies } from "next/headers";
import { createTranslator, DEFAULT_LOCALE, INTL_LOCALES, isLocale, LOCALE_COOKIE, type Messages } from "./config";

export const getI18n = cache(async () => {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored) ? stored : DEFAULT_LOCALE;
  const messages: Messages = locale === "uz" ? {} : (await (locale === "ru" ? import("./messages/ru.json") : import("./messages/en.json"))).default;
  return { locale, messages, t: createTranslator(messages), intlLocale: INTL_LOCALES[locale] };
});
