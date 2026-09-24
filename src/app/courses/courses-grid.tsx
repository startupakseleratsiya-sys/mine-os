"use client";
import { useI18n } from "@/i18n/provider";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Filter, PiggyBank, Search, TrendingUp, WalletCards, } from "lucide-react";
import type { CourseIcon } from "@/content/courses";
export type CourseCard = {
    slug: string;
    title: string;
    description: string;
    level: string;
    tag: "top" | "new" | null;
    icon: CourseIcon;
    lessons: number;
    time: string;
    completed: number;
    percent: number;
    nextChapterId: string;
};
const ICONS: Record<CourseIcon, typeof BookOpen> = {
    wallet: WalletCards,
    piggy: PiggyBank,
    trending: TrendingUp,
};
const LEVEL_COLORS: Record<string, string> = {
    "Boshlang'ich": "bg-emerald-50 text-emerald-700",
    "O'rta": "bg-sky-50 text-sky-700",
    Yuqori: "bg-violet-50 text-violet-700",
};
const LEVELS = ["Barchasi", "Boshlang'ich", "O'rta", "Yuqori"];
function normalizeSearch(value: string) {
    return value.toLowerCase().replace(/['‘’ʻʼ`]/g, "").replace(/\s+/g, " ").trim();
}
export function CoursesGrid({ courses }: {
    courses: CourseCard[];
}) {
    const { t } = useI18n();
    const [search, setSearch] = useState("");
    const [activeLevel, setActiveLevel] = useState("Barchasi");
    const reducedMotion = useReducedMotion();
    const continuing = courses.find((course) => course.completed > 0 && course.percent < 100);
    const firstCourse = courses.find((course) => course.level === "Boshlang'ich" && course.percent < 100);
    const suggested = continuing ?? firstCourse;
    const hasFilters = search !== "" || activeLevel !== "Barchasi";
    function resetFilters() {
        setSearch("");
        setActiveLevel("Barchasi");
    }
    const q = normalizeSearch(search);
    const filtered = courses.filter((c) => {
        const matchSearch = q === "" || normalizeSearch(`${c.title} ${c.description}`).includes(q);
        const matchLevel = activeLevel === "Barchasi" || c.level === activeLevel;
        return matchSearch && matchLevel;
    });
    return (<>
      {suggested && (<section aria-labelledby="next-step-title" className="mb-8 flex flex-col gap-5 rounded-3xl border border-[#163e32]/15 bg-[#e4ebe1] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#36584b]">
              {continuing ? t("Keyingi qadamingiz") : t("Qayerdan boshlash mumkin?")}
            </p>
            <h2 id="next-step-title" className="text-xl font-bold text-[#0f2017]">{t(suggested.title)}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#36584b]">
              {continuing
                ? t("{0} ta darsdan {1} tasi tugallangan. Keyingi darsdan davom eting.", { "0": suggested.lessons, "1": suggested.completed }) : t("Moliyani endi o\u2018rganayotgan bo\u2018lsangiz, shu kursdan boshlang. Darslarni o\u2018zingizga qulay vaqtda o\u2018qing.")}
            </p>
          </div>
          <Link href={`/study/${suggested.slug}/${suggested.nextChapterId}`} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#163e32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f2017] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#163e32]">
            {continuing ? t("Davom ettirish") : t("Birinchi darsni boshlash")}
            <ArrowRight className="size-4" aria-hidden="true"/>
          </Link>
        </section>)}
      <div className="flex flex-col gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9aa39f]"/>
          <input type="search" aria-label={t("Kurs nomi yoki mavzusi bo\u2018yicha qidirish")} aria-controls="course-results" placeholder={t("Kurs yoki mavzu qidiring, masalan: budjet")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 rounded-xl border border-[#13251f]/12 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#35624f]/50 focus:ring-4 focus:ring-[#dce7dd] transition-all"/>
        </div>
        <div role="group" aria-label={t("Kurs darajasi")} className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-[#65736d] shrink-0" aria-hidden="true"/>
          {LEVELS.map((l) => (<button key={l} type="button" aria-pressed={activeLevel === l} aria-controls="course-results" onClick={() => setActiveLevel(l)} className={`min-h-11 shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163e32] ${activeLevel === l
                ? "bg-[#163e32] text-white"
                : "bg-white border border-[#13251f]/12 text-[#65736d] hover:bg-[#f5f4ee]"}`}>
              {l}
            </button>))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p role="status" aria-live="polite" className="text-[#65736d]">{filtered.length}<>{" "}{t("ta kurs")}{" "}</>{hasFilters ? t("topildi") : t("mavjud")}</p>
        {hasFilters && <button type="button" onClick={resetFilters} className="min-h-11 rounded-lg px-3 font-semibold text-[#163e32] underline underline-offset-4"><>{t("Filtrlarni tozalash")}</></button>}
      </div>
      <div id="course-results" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c, i) => {
            const Icon = ICONS[c.icon];
            const href = c.percent === 100 ? `/courses/${c.slug}` : `/study/${c.slug}/${c.nextChapterId}`;
            return (<motion.article key={c.slug} initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }} whileHover={reducedMotion ? undefined : { y: -4, boxShadow: "0 20px 50px rgba(19,37,31,0.09)" }} className="group flex flex-col rounded-3xl border border-[#13251f]/10 bg-white p-6 transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#dce7dd] text-[#285744]">
                  <Icon className="size-5"/>
                </span>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${LEVEL_COLORS[c.level] ?? "bg-gray-50 text-gray-600"}`}>
                    {t(c.level)}
                  </span>
                  {c.tag === "top" && (<span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700"><>{t("Tavsiya etiladi")}</></span>)}
                  {c.tag === "new" && (<span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700"><>{t("Yangi")}</></span>)}
                </div>
              </div>

              <Link href={`/courses/${c.slug}`} className="hover:underline underline-offset-4">
                <h2 className="text-xl font-bold text-[#0f2017] mb-2">{t(c.title)}</h2>
              </Link>
              <p className="text-sm leading-6 text-[#65736d] mb-5">{t(c.description)}</p>

              <div className="flex gap-4 text-xs text-[#78837f] mb-6">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5"/>
                  {c.lessons}<>{t("dars")}</></span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5"/>
                  {t(c.time)}
                </span>
              </div>

              <div className="mb-5 mt-auto">
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-[#78837f]">
                    {c.percent === 0
                    ? t("Boshlanmagan") : c.percent === 100
                    ? t("Tugatilgan") : t("{0}/{1} dars", { "0": c.completed, "1": c.lessons })}
                  </span>
                  <span className="font-semibold">{c.percent}%</span>
                </div>
                <div role="progressbar" aria-label={t("{0}: tugallangan darslar", { "0": c.title })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={c.percent} className="h-1.5 rounded-full bg-[#e9ebe7] overflow-hidden">
                  <motion.div initial={reducedMotion ? false : { width: 0 }} animate={{ width: `${c.percent}%` }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }} className="h-full rounded-full bg-[#28634f]"/>
                </div>
              </div>

              <Link href={href} className="flex items-center justify-between border-t border-[#13251f]/8 pt-5 text-sm font-semibold text-[#163e32] group-hover:text-[#0e3026] transition-colors">
                {c.percent === 100
                    ? t("Qayta ko'rish") : c.percent > 0
                    ? t("Davom ettirish") : t("Kursni boshlash")}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </motion.article>);
        })}
      </div>

      {filtered.length === 0 && (<div className="text-center py-16 text-[#65736d]">
          <Search className="size-10 mx-auto mb-4 opacity-30"/>
          <p className="font-medium"><>{t("Kurs topilmadi")}</></p>
          <p className="text-sm mt-1"><>{t("Boshqa so\u2018z yozing yoki daraja filtrini o\u2018zgartiring.")}</></p>
          <button type="button" onClick={resetFilters} className="mt-5 min-h-11 rounded-xl bg-[#163e32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f2017]"><>{t("Barcha kurslarni ko\u2018rsatish")}</></button>
        </div>)}

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#dce7dd] p-5 text-sm text-[#36584b]">
        <CheckCircle2 className="size-5 shrink-0"/>
        <span><>{t("Mavzuni tushunishga yordam kerakmi? AI ustozga savol bering.")}</>{" "}
          <Link href="/tutor" className="font-bold underline underline-offset-2"><>{t("AI ustozdan so\u2018rash \u2192")}</></Link>
        </span>
      </div>
    </>);
}
