"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  Landmark,
  Percent,
  PiggyBank,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { SectionShell } from "@/components/layouts/section-shell";

/* ── Credit calculator ── */
function CreditCalc() {
  const [amount, setAmount] = useState(10000000);
  const [rate, setRate] = useState(22);
  const [months, setMonths] = useState(24);

  const monthlyRate = rate / 100 / 12;
  const monthly =
    monthlyRate > 0
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : amount / months;
  const total = monthly * months;
  const totalInterest = total - amount;

  const fmt = (n: number) =>
    new Intl.NumberFormat("uz-UZ", { style: "decimal" }).format(Math.round(n));

  return (
    <div className="space-y-5">
      <Slider
        label="Kredit summasi"
        value={amount}
        min={1000000}
        max={100000000}
        step={500000}
        display={`${fmt(amount)} so'm`}
        onChange={setAmount}
      />
      <Slider
        label="Yillik foiz stavkasi"
        value={rate}
        min={1}
        max={60}
        step={0.5}
        display={`${rate}%`}
        onChange={setRate}
      />
      <Slider
        label="Muddat (oy)"
        value={months}
        min={3}
        max={120}
        step={3}
        display={`${months} oy`}
        onChange={setMonths}
      />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Result label="Oylik to'lov" value={`${fmt(monthly)} so'm`} highlight />
        <Result label="Umumiy to'lov" value={`${fmt(total)} so'm`} />
        <Result label="Foiz ulushi" value={`${fmt(totalInterest)} so'm`} />
      </div>
    </div>
  );
}

/* ── Compound interest calculator ── */
function CompoundCalc() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(15);
  const [years, setYears] = useState(5);
  const [monthly, setMonthly] = useState(200000);

  const totalContrib = principal + monthly * 12 * years;
  const finalAmount =
    principal * Math.pow(1 + rate / 100, years) +
    (monthly * (Math.pow(1 + rate / 100, years) - 1)) / (rate / 100);
  const earned = finalAmount - totalContrib;

  const fmt = (n: number) =>
    new Intl.NumberFormat("uz-UZ").format(Math.round(n));

  return (
    <div className="space-y-5">
      <Slider
        label="Boshlang'ich kapital"
        value={principal}
        min={100000}
        max={50000000}
        step={100000}
        display={`${fmt(principal)} so'm`}
        onChange={setPrincipal}
      />
      <Slider
        label="Oylik qo'shimcha"
        value={monthly}
        min={0}
        max={5000000}
        step={50000}
        display={`${fmt(monthly)} so'm`}
        onChange={setMonthly}
      />
      <Slider
        label="Yillik daromad"
        value={rate}
        min={1}
        max={50}
        step={0.5}
        display={`${rate}%`}
        onChange={setRate}
      />
      <Slider
        label="Muddat (yil)"
        value={years}
        min={1}
        max={30}
        step={1}
        display={`${years} yil`}
        onChange={setYears}
      />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Result label="Yakuniy summa" value={`${fmt(finalAmount)} so'm`} highlight />
        <Result label="Kiritilgan" value={`${fmt(totalContrib)} so'm`} />
        <Result label="Qozonilgan" value={`${fmt(earned)} so'm`} />
      </div>
    </div>
  );
}

/* ── Budget 50/30/20 calculator ── */
function BudgetCalc() {
  const [income, setIncome] = useState(5000000);

  const fmt = (n: number) =>
    new Intl.NumberFormat("uz-UZ").format(Math.round(n));

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  return (
    <div className="space-y-5">
      <Slider
        label="Oylik daromad"
        value={income}
        min={500000}
        max={50000000}
        step={100000}
        display={`${fmt(income)} so'm`}
        onChange={setIncome}
      />
      <div className="mt-4 space-y-3">
        <BudgetBar label="Ehtiyojlar (50%)" amount={needs} total={income} color="bg-[#163e32]" fmt={fmt} />
        <BudgetBar label="Istaklarlar (30%)" amount={wants} total={income} color="bg-[#4a9e72]" fmt={fmt} />
        <BudgetBar label="Jamg'arma (20%)" amount={savings} total={income} color="bg-amber-500" fmt={fmt} />
      </div>
    </div>
  );
}

function BudgetBar({ label, amount, total, color, fmt }: { label: string; amount: number; total: number; color: string; fmt: (n: number) => string }) {
  const pct = Math.round((amount / total) * 100);
  return (
    <div className="bg-[#f8f7f2] rounded-2xl p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-[#0f2017]">{label}</span>
        <span className="text-sm font-bold text-[#0f2017]">{fmt(amount)} so'm</span>
      </div>
      <div className="h-2.5 bg-[#e9ebe7] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* ── Goal calculator ── */
function GoalCalc() {
  const [goal, setGoal] = useState(20000000);
  const [current, setCurrent] = useState(2000000);
  const [months, setMonths] = useState(24);
  const [rate, setRate] = useState(15);

  const remaining = Math.max(goal - current, 0);
  const monthlyRate = rate / 100 / 12;
  const needed =
    monthlyRate > 0
      ? (remaining * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
      : remaining / months;

  const fmt = (n: number) =>
    new Intl.NumberFormat("uz-UZ").format(Math.round(n));

  return (
    <div className="space-y-5">
      <Slider
        label="Maqsad summasi"
        value={goal}
        min={1000000}
        max={500000000}
        step={1000000}
        display={`${fmt(goal)} so'm`}
        onChange={setGoal}
      />
      <Slider
        label="Hozirgi jamg'arma"
        value={current}
        min={0}
        max={goal}
        step={100000}
        display={`${fmt(current)} so'm`}
        onChange={setCurrent}
      />
      <Slider
        label="Muddat (oy)"
        value={months}
        min={3}
        max={120}
        step={3}
        display={`${months} oy`}
        onChange={setMonths}
      />
      <Slider
        label="Yillik daromad"
        value={rate}
        min={0}
        max={40}
        step={0.5}
        display={`${rate}%`}
        onChange={setRate}
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Result label="Oylik kerak" value={`${fmt(needed)} so'm`} highlight />
        <Result label="Qolgan summa" value={`${fmt(remaining)} so'm`} />
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */
function Slider({
  label, value, min, max, step, display, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-[#65736d]">{label}</label>
        <span className="text-sm font-bold text-[#0f2017]">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#163e32] bg-[#e2e4df]"
      />
    </div>
  );
}

function Result({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${highlight ? "bg-[#163e32] text-white" : "bg-[#f5f4ee]"}`}>
      <p className={`text-[11px] font-medium mb-1 ${highlight ? "text-[#8ea89d]" : "text-[#65736d]"}`}>
        {label}
      </p>
      <p className={`text-sm font-bold leading-tight ${highlight ? "text-white" : "text-[#0f2017]"}`}>
        {value}
      </p>
    </div>
  );
}

/* ── Tool card ── */
const TOOLS = [
  { id: "credit", icon: Landmark, title: "Kredit kalkulyatori", desc: "Oylik to'lov va umumiy foiz hisobi.", component: CreditCalc },
  { id: "compound", icon: Percent, title: "Murakkab foiz", desc: "Jamg'arma vaqt bilan qanday o'sishini ko'ring.", component: CompoundCalc },
  { id: "budget", icon: WalletCards, title: "Oylik budjet (50/30/20)", desc: "Daromadni oqilona taqsimlang.", component: BudgetCalc },
  { id: "goal", icon: PiggyBank, title: "Maqsad kalkulyatori", desc: "Maqsadga yetish uchun oylik miqdorni biling.", component: GoalCalc },
];

export default function CalculatorsPage() {
  const [openId, setOpenId] = useState<string>("credit");

  return (
    <SectionShell
      eyebrow="Amaliy vositalar"
      title="Hisoblang. Solishtiring. Keyin qaror qiling."
      description="Oddiy va shaffof kalkulyatorlar moliyaviy qarorning raqamlar ortidagi haqiqiy ta'sirini ko'rsatadi."
    >
      <div className="space-y-4">
        {TOOLS.map(({ id, icon: Icon, title, desc, component: Comp }) => {
          const isOpen = openId === id;
          return (
            <div
              key={id}
              className={`rounded-3xl border bg-white transition-all ${
                isOpen ? "border-[#35624f]/30 shadow-lg" : "border-[#13251f]/10"
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? "" : id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className={`grid size-11 place-items-center rounded-2xl ${isOpen ? "bg-[#163e32] text-white" : "bg-[#e5ebe4] text-[#315d4c]"} transition-colors`}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0f2017]">{title}</h2>
                    <p className="text-sm text-[#65736d] mt-0.5">{desc}</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="size-5 text-[#65736d] shrink-0" />
                ) : (
                  <ChevronDown className="size-5 text-[#65736d] shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#13251f]/8 px-6 pb-6 pt-5">
                      <Comp />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#dce7dd] p-5 text-sm text-[#36584b]">
        <Calculator className="size-5 shrink-0" />
        Natijalar haqida savol bormi?{" "}
        <Link href="/tutor" className="font-bold underline underline-offset-2 inline-flex items-center gap-1">
          AI Tutorga so'rang <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </SectionShell>
  );
}
