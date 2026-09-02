"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { SectionShell } from "@/components/layouts/section-shell";

const WEEKLY_DATA = [
  { day: "Du", minutes: 35, done: true },
  { day: "Se", minutes: 58, done: true },
  { day: "Ch", minutes: 42, done: true },
  { day: "Pa", minutes: 75, done: true },
  { day: "Ju", minutes: 52, done: true },
  { day: "Sh", minutes: 88, done: true },
  { day: "Ya", minutes: 68, done: false },
];

const ACHIEVEMENTS = [
  { icon: "🔥", label: "7 kunlik streak", earned: true },
  { icon: "📚", label: "10 dars tugatildi", earned: true },
  { icon: "🧠", label: "AI bilan suhbat", earned: true },
  { icon: "🏅", label: "Birinchi kurs", earned: false },
  { icon: "💰", label: "Budjet ustasi", earned: false },
  { icon: "🎯", label: "Maqsadga yetish", earned: false },
];

const COMPLETED_LESSONS = [
  { title: "50/30/20 qoidasi", course: "Shaxsiy budjet", time: "Bugun", score: 92 },
  { title: "Favqulodda fond", course: "Shaxsiy budjet", time: "Kecha", score: 85 },
  { title: "Kredit balli nima?", course: "Asoslar", time: "2 kun oldin", score: 100 },
];

const maxMinutes = Math.max(...WEEKLY_DATA.map((d) => d.minutes));

export default function ProgressPage() {
  const totalMinutes = WEEKLY_DATA.reduce((s, d) => s + d.minutes, 0);

  return (
    <SectionShell
      eyebrow="Mening natijalarim"
      title="Bilimingiz qanday o'sayotganini ko'ring."
      description="Progress faqat ball emas — o'zlashtirilgan tushunchalar, amaliy odatlar va erishilgan maqsadlar yig'indisi."
    >
      {/* ── Top metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpenCheck, value: "12", label: "Tugallangan dars", color: "text-emerald-600" },
          { icon: Clock3, value: `${Math.round(totalMinutes / 60 * 10) / 10}h`, label: "O'rganish vaqti", color: "text-sky-600" },
          { icon: Award, value: "68%", label: "Umumiy natija", color: "text-violet-600" },
          { icon: Flame, value: "7 kun", label: "Streak", color: "text-amber-500" },
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

      {/* ── Weekly chart + Goal card ── */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr] mb-8">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-[#13251f]/10 bg-white p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-[#0f2017]">Haftalik faoliyat</h2>
              <p className="text-xs text-[#78837f] mt-0.5">Oxirgi 7 kun · daqiqalarda</p>
            </div>
            <TrendingUp className="size-5 text-[#37624f]" />
          </div>

          <div className="mt-6 flex h-44 items-end gap-2.5">
            {WEEKLY_DATA.map(({ day, minutes, done }, i) => {
              const pct = (minutes / maxMinutes) * 100;
              return (
                <div key={day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[9px] font-bold text-[#78837f]">{minutes}m</span>
                  <div className="w-full relative rounded-t-xl overflow-hidden" style={{ height: "152px" }}>
                    <div className="absolute inset-0 bg-[#f0f2ef] rounded-xl" />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.6, ease: "easeOut" }}
                      className={`absolute bottom-0 left-0 right-0 rounded-xl ${
                        done ? "bg-[#28634f]" : "bg-[#9eb9a8]"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#87928e]">{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Goal card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-[#163e32] p-6 text-white flex flex-col"
        >
          <Target className="size-6 text-[#b7d2c1]" />
          <div className="mt-auto">
            <p className="text-xs text-[#acc1b9] font-medium mb-2">Joriy maqsad</p>
            <h2 className="text-xl font-bold leading-tight">
              Budjet kursini yakunlash
            </h2>
            <p className="text-xs text-[#8dbca9] mt-2">8 ta darsdan 6 tasi tugatildi</p>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs text-[#acc1b9] mb-2">
              <span>Progress</span>
              <span className="font-bold">72%</span>
            </div>
            <div className="h-2 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full bg-[#c7dbce]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Completed lessons + Achievements ── */}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        {/* Recent lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl border border-[#13251f]/10 bg-white p-6"
        >
          <h2 className="font-bold text-[#0f2017] mb-5 flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600" />
            So'nggi tugatilgan darslar
          </h2>
          <div className="space-y-3">
            {COMPLETED_LESSONS.map(({ title, course, time, score }) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-2xl bg-[#f8f7f2] px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0f2017]">{title}</p>
                  <p className="text-xs text-[#78837f] mt-0.5">
                    {course} · {time}
                  </p>
                </div>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    score >= 90
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
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
            {ACHIEVEMENTS.map(({ icon, label, earned }) => (
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
    </SectionShell>
  );
}
