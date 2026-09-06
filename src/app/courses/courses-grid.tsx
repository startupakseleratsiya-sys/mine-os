"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Filter,
  PiggyBank,
  Search,
  TrendingUp,
  WalletCards,
} from "lucide-react";
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

export function CoursesGrid({ courses }: { courses: CourseCard[] }) {
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState("Barchasi");

  const q = search.trim().toLowerCase();
  const filtered = courses.filter((c) => {
    const matchSearch =
      q === "" || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchLevel = activeLevel === "Barchasi" || c.level === activeLevel;
    return matchSearch && matchLevel;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9aa39f]" />
          <input
            type="search"
            placeholder="Kurs qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-[#13251f]/12 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#35624f]/50 focus:ring-4 focus:ring-[#dce7dd] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="size-4 text-[#65736d] shrink-0" />
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeLevel === l
                  ? "bg-[#163e32] text-white"
                  : "bg-white border border-[#13251f]/12 text-[#65736d] hover:bg-[#f5f4ee]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {filtered.map((c, i) => {
          const Icon = ICONS[c.icon];
          const href =
            c.percent === 100 ? `/courses/${c.slug}` : `/study/${c.slug}/${c.nextChapterId}`;
          return (
            <motion.article
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(19,37,31,0.09)" }}
              className="group flex flex-col rounded-3xl border border-[#13251f]/10 bg-white p-6 transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#dce7dd] text-[#285744]">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      LEVEL_COLORS[c.level] ?? "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {c.level}
                  </span>
                  {c.tag === "top" && (
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                      ⭐ Top
                    </span>
                  )}
                  {c.tag === "new" && (
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700">
                      Yangi
                    </span>
                  )}
                </div>
              </div>

              <Link href={`/courses/${c.slug}`} className="hover:underline underline-offset-4">
                <h2 className="text-xl font-bold text-[#0f2017] mb-2">{c.title}</h2>
              </Link>
              <p className="text-sm leading-6 text-[#65736d] mb-5">{c.description}</p>

              <div className="flex gap-4 text-xs text-[#78837f] mb-6">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {c.lessons} dars
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {c.time}
                </span>
              </div>

              <div className="mb-5 mt-auto">
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-[#78837f]">
                    {c.percent === 0
                      ? "Boshlanmagan"
                      : c.percent === 100
                        ? "Tugatilgan"
                        : `${c.completed}/${c.lessons} bob`}
                  </span>
                  <span className="font-semibold">{c.percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#e9ebe7] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.percent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-[#28634f]"
                  />
                </div>
              </div>

              <Link
                href={href}
                className="flex items-center justify-between border-t border-[#13251f]/8 pt-5 text-sm font-semibold text-[#163e32] group-hover:text-[#0e3026] transition-colors"
              >
                {c.percent === 100
                  ? "Qayta ko'rish"
                  : c.percent > 0
                    ? "Davom ettirish"
                    : "Kursni boshlash"}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#65736d]">
          <Search className="size-10 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Kurs topilmadi</p>
          <p className="text-sm mt-1">Qidiruv so&apos;zini o&apos;zgartiring</p>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#dce7dd] p-5 text-sm text-[#36584b]">
        <CheckCircle2 className="size-5 shrink-0" />
        <span>
          Qayerdan boshlashni bilmasangiz, AI Tutor sizga shaxsiy o&apos;quv reja tuzib beradi.{" "}
          <Link href="/tutor" className="font-bold underline underline-offset-2">
            AI ga so&apos;rash →
          </Link>
        </span>
      </div>
    </>
  );
}
