"use client";

import { useId, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";
import { isLocale, LANGUAGE_NAMES, LOCALES, LOCALE_COOKIE } from "./config";
import { useI18n } from "./provider";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const id = useId();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const label = { en: "Language", ru: "Язык", uz: "Til" }[locale];
  return (
    <div className="flex min-h-12 items-center justify-end gap-2 border-b border-[#dce5e0] bg-white px-4 text-sm text-[#183c34] sm:px-8">
      <Globe2 aria-hidden="true" className="size-4" />
      <label htmlFor={id}>{label}</label>
      <select id={id} value={locale} disabled={pending} onChange={(event) => {
        const next = event.target.value;
        if (!isLocale(next)) return;
        document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
        startTransition(() => router.refresh());
      }} className="min-h-11 rounded-lg border border-[#cfddd6] bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-[#245b47] disabled:opacity-50">
        {LOCALES.map((value) => <option key={value} value={value}>{LANGUAGE_NAMES[value]}</option>)}
      </select>
      <span role="status" className="sr-only">{pending ? { en: "Changing language…", ru: "Меняем язык…", uz: "Til almashtirilmoqda…" }[locale] : ""}</span>
    </div>
  );
}
