"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

export type ProgressViewProps = {
  totalCompleted: number;
  totalChapters: number;
  minutesLearned: number;
  streak: number;
  weekly: { day: string; lessons: number; minutes: number; isToday: boolean }[];
  recent: { title: string; course: string; when: string; href: string }[];
  achievements: { icon: string; label: string; earned: boolean }[];
  active: {
    title: string;
    percent: number;
    remaining: number;
    href: string;
  };
};

export function ProgressView(p: ProgressViewProps) {
  const overall = p.totalChapters === 0 ? 0 : Math.round((p.totalCompleted / p.totalChapters) * 100);
  const maxMinutes = Math.max(...p.weekly.map((d) => d.minutes), 1);
  const weekMinutes = p.weekly.reduce((s, d) => s + d.minutes, 0);
  const hours = Math.round((p.minutesLearned / 60) * 10) / 10;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpenCheck, value: `${p.totalCompleted}`, label: `Tugallangan bob (${p.totalChapters} dan)`, color: "text-emerald-600" },
          { icon: Clock3, value: `${hours}h`, label: "O'rganish vaqti", color: "text-sky-600" },
          { icon: Award, value: `${overall}%`, label: "Umumiy natija", color: "text-violet-600" },
          { icon: Flame, value: `${p.streak} kun`, label: "Streak", color: "text-amber-500" },
        ].map(({ icon: Icon, value, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-3xl border border-[#13251f]/10 bg-white p-5"
          >
            <Icon className={`size-5 ${color} mb-4`} />
            <p className="text-2xl font-extrabold text-[#0f2017] tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-[#78837f] font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr] mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-[#13251f]/10 bg-white p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-[#0f2017]">Haftalik faoliyat</h2>
              <p className="text-xs text-[#78837f] mt-0.5">
                Oxirgi 7 kun · {weekMinutes > 0 ? `${weekMinutes} daqiqa` : "hali faollik yo'q"}
              </p>
            </div>
            <TrendingUp className="size-5 text-[#37624f]" />
          </div>

          <div className="mt-6 flex h-44 items-end gap-2.5">
            {p.weekly.map(({ day, minutes, lessons, isToday }, i) => {
              const pct = (minutes / maxMinutes) * 100;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[9px] font-bold text-[#78837f]">{minutes > 0 ? `${minutes}m` : ""}</span>
                  <div className="w-full relative rounded-t-xl overflow-hidden" style={{ height: "152px" }}>
                    <div className="absolute inset-0 bg-[#f0f2ef] rounded-xl" />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.6, ease: "easeOut" }}
                      title={`${lessons} bob`}
                      className={`absolute bottom-0 left-0 right-0 rounded-xl ${isToday ? "bg-[#4a9e72]" : "bg-[#28634f]"}`}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${isToday ? "text-[#163e32]" : "text-[#87928e]"}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-[#163e32] p-6 text-white flex flex-col relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 size-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <Target className="size-6 text-[#b7d2c1] mb-2 relative z-10" />
          <div className="mt-auto relative z-10">
            <p className="text-xs text-[#acc1b9] font-medium mb-1 tracking-widest uppercase">Faol kurs</p>
            <h2 className="text-xl font-bold leading-tight mb-2">{p.active.title}</h2>
            <p className="text-xs text-[#8dbca9] leading-relaxed">
              {p.active.remaining === 0
                ? "Kurs to'liq tugatildi. Zo'r!"
                : `${p.active.remaining} ta bob qoldi.`}
            </p>
          </div>
          <div className="mt-6 relative z-10">
            <div className="flex justify-between items-end text-xs text-[#acc1b9] mb-2">
              <span>Tayyorgarlik darajasi</span>
              <span className="font-bold text-xl text-white">{p.active.percent}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-black/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.active.percent}%` }}
                transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#c7dbce]"
              />
            </div>
            <Link
              href={p.active.href}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
            >
              {p.active.remaining === 0 ? "Kursga qaytish" : "Davom etish"} <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl border border-[#13251f]/10 bg-white p-6"
        >
          <h2 className="font-bold text-[#0f2017] mb-5 flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600" />
            So&apos;nggi tugatilgan boblar
          </h2>
          {p.recent.length === 0 ? (
            <div className="rounded-2xl bg-[#f8f7f2] px-4 py-6 text-center text-sm text-[#78837f]">
              Hali bob tugatilmagan.{" "}
              <Link href="/courses" className="font-semibold text-[#163e32] underline">
                Birinchi darsni boshlang
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {p.recent.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="flex items-center justify-between rounded-2xl bg-[#f8f7f2] px-4 py-3.5 hover:bg-[#f0f2ef] transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0f2017]">{r.title}</p>
                    <p className="text-xs text-[#78837f] mt-0.5">
                      {r.course} · {r.when}
                    </p>
                  </div>
                  <span className="text-sm font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">✓</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-[#13251f]/10 bg-white p-6"
        >
          <h2 className="font-bold text-[#0f2017] mb-5 flex items-center gap-2">
            <Award className="size-4.5 text-amber-500" />
            Yutuqlar
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {p.achievements.map(({ icon, label, earned }) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all ${
                  earned
                    ? "bg-[#f3f1eb] border-2 border-[#dce7dd]"
                    : "bg-[#f8f7f2] border-2 border-dashed border-[#e2e4df] opacity-50"
                }`}
              >
                <span className={`text-2xl ${earned ? "" : "grayscale"}`}>{icon}</span>
                <p className="text-[9px] font-semibold text-[#65736d] leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
