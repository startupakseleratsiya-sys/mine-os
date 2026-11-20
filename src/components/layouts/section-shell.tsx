"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import { CircleDollarSign, UserRound } from "lucide-react";
import { SectionNavigation } from "./section-navigation";
export function SectionShell({ eyebrow, title, description, children, }: {
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    const { t } = useI18n();
    return (<div className="min-h-screen bg-[#f3f1eb] text-[#13251f]">
      <a href="#section-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-white focus:p-4 focus:text-[#163e32]"><>{t("Skip to main content")}</></a>
      <header className="sticky top-0 z-40 border-b border-[#13251f]/10 bg-[#f8f7f2]">
        <div className="mx-auto flex h-14 sm:h-18 max-w-[1120px] items-center justify-between px-4 sm:px-8">
          <Link href="/dashboard" aria-label={t("Finora — dashboard")} className="flex items-center gap-2.5 shrink-0">
            <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
              <CircleDollarSign className="size-4"/>
            </span>
            <span className="font-semibold tracking-tight"><>{t("finora")}</></span>
          </Link>

          <SectionNavigation />

          <Link href="/profile" aria-label={t("Profile")} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#13251f]/12 bg-white px-4 text-xs font-semibold hover:bg-[#f5f4ee] transition-colors">
            <UserRound className="size-4"/>
            <span className="hidden sm:inline">{t("Profile")}</span>
          </Link>
        </div>

        <SectionNavigation mobile/>
      </header>

      <main id="section-content" tabIndex={-1} className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">{t(eyebrow)}</p>
        <h1 className="mt-3 max-w-3xl text-[28px] leading-tight font-semibold tracking-[-0.04em] sm:text-5xl">{t(title)}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-6 sm:mt-5 sm:text-base sm:leading-7 text-[#66736e]">{t(description)}</p>
        <div className="mt-6 sm:mt-12">{children}</div>
      </main>
    </div>);
}
