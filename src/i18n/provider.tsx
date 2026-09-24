"use client";

import { createContext, useContext, useMemo } from "react";
import { createTranslator, INTL_LOCALES, type Locale, type Messages } from "./config";

const I18nContext = createContext<ReturnType<typeof makeValue> | null>(null);
function makeValue(locale: Locale, messages: Messages) {
  return { locale, t: createTranslator(messages), intlLocale: INTL_LOCALES[locale] };
}
export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  const value = useMemo(() => makeValue(locale, messages), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("I18nProvider is required");
  return context;
}
