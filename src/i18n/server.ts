import { cache } from "react";
import { createTranslator, DEFAULT_LOCALE, INTL_LOCALES, type Messages } from "./config";
import en from "./messages/en.json";

/** Faqat ingliz tili: manba matnlar en.json orqali inglizchaga o'giriladi. */
export const getI18n = cache(async () => {
  const locale = DEFAULT_LOCALE;
  const messages: Messages = en;
  return { locale, messages, t: createTranslator(messages), intlLocale: INTL_LOCALES[locale] };
});
