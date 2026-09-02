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
  TrendingUp,
  WalletCards,
  Search,
} from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";

const ALL_COURSES = [
  {
    icon: WalletCards,
    level: "Boshlang'ich",
    tag: "top",
    title: "Shaxsiy budjet",
    desc: "Daromad va xarajatlarni boshqarish, 50/30/20 qoidasi va amaliy rejalashtirish.",
    lessons: 8,
    time: "1 soat 40 daqiqa",
    progress: 72,
    href: "/courses",
  },
  {
    icon: PiggyBank,
    level: "Boshlang'ich",
    tag: null,
    title: "Jamg'arma tizimi",
    desc: "Maqsadga muvofiq jamg'arma strategiyasi, favqulodda fond va avtomatlashtirish.",
    lessons: 6,
    time: "1 soat 15 daqiqa",
    progress: 25,
    href: "/courses",
  },
  {
    icon: TrendingUp,
    level: "O'rta",
    tag: "new",
    title: "Investitsiya asoslari",
    desc: "Aksiya, obligatsiya, indeks fondlari va portfel diversifikatsiyasi.",
    lessons: 10,
    time: "2 soat 20 daqiqa",
    progress: 0,
    href: "/courses",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  "Boshlang'ich": "bg-emerald-50 text-emerald-700",
  "O'rta": "bg-sky-50 text-sky-700",
  Yuqori: "bg-violet-50 text-violet-700",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState("Barchasi");

  const levels = ["Barchasi", "Boshlang'ich", "O'rta", "Yuqori"];

  const filtered = ALL_COURSES.filter((c) => {
    const matchSearch =
      search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    const matchLevel =
      activeLevel === "Barchasi" || c.level === activeLevel;
    return matchSearch && matchLevel;
  });

  return (
    <SectionShell
      eyebrow="Ta'lim markazi"
      title="Moliyani tartib bilan o'rganing."
      description="Har bir kurs sodda nazariya, hayotiy misollar, qisqa testlar va amaliy vazifalardan tashkil topgan."
    >
      {/* Search + filter */}
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
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-[#65736d] shrink-0" />
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
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

      {/* Course grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {filtered.map(
          ({ icon: Icon, level, tag, title, desc, lessons, time, progress, href }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(19,37,31,0.09)" }}
              className="group rounded-3xl border border-[#13251f]/10 bg-white p-6 cursor-pointer transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#dce7dd] text-[#285744]">
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      LEVEL_COLORS[level] ?? "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {level}
                  </span>
                  {tag === "top" && (
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                      ⭐ Top
                    </span>
                  )}
                  {tag === "new" && (
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700">
                      Yangi
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#0f2017] mb-2">{title}</h2>
              <p className="text-sm leading-6 text-[#65736d] mb-5">{desc}</p>

              <div className="flex gap-4 text-xs text-[#78837f] mb-6">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {lessons} dars
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {time}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-[#78837f]">
                    {progress === 0 ? "Boshlanmagan" : "Progress"}
                  </span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#e9ebe7] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-[#28634f]"
                  />
                </div>
              </div>

              <Link
                href={href}
                className="flex items-center justify-between border-t border-[#13251f]/8 pt-5 text-sm font-semibold text-[#163e32] group-hover:text-[#0e3026] transition-colors"
              >
                {progress > 0 ? "Davom ettirish" : "Kursni boshlash"}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.article>
          )
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#65736d]">
          <Search className="size-10 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Kurs topilmadi</p>
          <p className="text-sm mt-1">Qidiruv so'zini o'zgartiring</p>
        </div>
      )}

      {/* AI hint */}
      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#dce7dd] p-5 text-sm text-[#36584b]">
        <CheckCircle2 className="size-5 shrink-0" />
        Qayerdan boshlashni bilmasangiz, AI Tutor sizga shaxsiy o&apos;quv reja tuzib beradi.{" "}
        <Link href="/tutor" className="font-bold underline underline-offset-2">
          AI ga so'rash →
        </Link>
      </div>
    </SectionShell>
  );
}
