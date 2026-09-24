"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import React from "react";
import { CircleDollarSign, Landmark, ShieldCheck } from "lucide-react";
export function AuthShell({ title, description, children, }: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    const { t } = useI18n();
    return (<main className="grid min-h-screen bg-[#f3f1eb] text-[#13251f] lg:grid-cols-[0.9fr_1.1fr]">
      {/* Left — form */}
      <section className="flex flex-col px-5 py-7 sm:px-10 lg:px-16 lg:py-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white">
            <CircleDollarSign className="size-5"/>
          </span>
          <span className="text-xl font-semibold tracking-tight"><>{t("finora")}</></span>
        </Link>

        {/* Form area */}
        <div className="my-auto mx-auto w-full max-w-[430px] py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]"><>{t("Xush kelibsiz")}</></p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">{t(title)}</h1>
          <p className="mt-3 text-sm leading-6 text-[#6b7872]">{t(description)}</p>
          {children}
        </div>

        <p className="text-center text-[10px] text-[#87918d]"><>{t("Davom etish orqali foydalanish shartlari va maxfiylik siyosatiga rozilik bildirasiz.")}</></p>
      </section>

      {/* Right — dark panel */}
      <aside className="relative hidden overflow-hidden bg-[#163e32] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Decorative rings */}
        <div className="absolute -right-28 -top-28 size-96 rounded-full border border-white/10"/>
        <div className="absolute -right-12 -top-12 size-64 rounded-full border border-white/10"/>
        <div className="absolute bottom-16 left-8 size-48 rounded-full border border-white/5"/>

        {/* Icon */}
        <Landmark className="relative size-7 text-[#bed3c5]" strokeWidth={1.5}/>

        {/* Quote */}
        <div className="relative max-w-xl">
          <blockquote className="text-4xl font-medium leading-[1.2] tracking-[-0.035em]"><>{t("&ldquo;Moliyaviy erkinlik katta daromaddan emas, ongli qarorlardan boshlanadi.&rdquo;")}</></blockquote>
          <div className="mt-10 flex items-center gap-3 text-sm text-[#b9cbc4]">
            <ShieldCheck className="size-5"/><>{t("Ma'lumotlaringiz himoyalangan")}</></div>
        </div>

        <p className="relative text-xs text-[#8eaaa0]"><>{t("Ta'lim. Tushunish. Ishonchli qaror.")}</></p>
      </aside>
    </main>);
}
