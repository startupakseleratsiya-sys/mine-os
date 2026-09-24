"use client";
import { useI18n } from "@/i18n/provider";

import React, { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, ChevronDown, ChevronUp, Landmark, Percent, PiggyBank, WalletCards, } from "lucide-react";
import Link from "next/link";
import { SectionShell } from "@/components/layouts/section-shell";
import { calculateGoalContribution, calculateLoanPayment, calculateSavings } from "@/lib/calculators";
/* ── Credit calculator ── */
function CreditCalc() {
    const { t } = useI18n();
    const [amount, setAmount] = useState(10000000);
    const [rate, setRate] = useState(22);
    const [months, setMonths] = useState(24);
    const monthly = calculateLoanPayment({ amount, annualRate: rate, months });
    const total = monthly * months;
    const totalInterest = total - amount;
    const fmt = (n: number) => new Intl.NumberFormat("uz-UZ", { style: "decimal" }).format(Math.round(n));
    return (<div className="space-y-5">
      <Slider label={t("Kredit summasi")} value={amount} min={1000000} max={100000000} step={500000} display={t("{0} so'm", { "0": fmt(amount) })} onChange={setAmount}/>
      <Slider label={t("Yillik nominal foiz stavkasi")} value={rate} min={0} max={60} step={0.5} display={`${rate}%`} onChange={setRate}/>
      <Slider label={t("Muddat (oy)")} value={months} min={3} max={120} step={3} display={t("{0} oy", { "0": months })} onChange={setMonths}/>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Result label={t("Oylik to'lov")} value={`${fmt(monthly)} so'm`} highlight/>
        <Result label={t("Umumiy to'lov")} value={`${fmt(total)} so'm`}/>
        <Result label={t("Foiz ulushi")} value={`${fmt(totalInterest)} so'm`}/>
      </div>
      <p className="text-xs leading-relaxed text-[#65736d]"><>{t("Stavka o\u2018zgarmaydi; oylik stavka \u2014 yillik nominal stavkaning 1/12 qismi. Teng to\u2018lovlar oy oxirida qilinadi. Komissiya va sug\u2018urta hisobga olinmagan.")}</></p>
    </div>);
}
/* ── Compound interest calculator ── */
function CompoundCalc() {
    const { t } = useI18n();
    const [principal, setPrincipal] = useState(5000000);
    const [rate, setRate] = useState(15);
    const [years, setYears] = useState(5);
    const [monthly, setMonthly] = useState(200000);
    const totalContrib = principal + monthly * 12 * years;
    const finalAmount = calculateSavings({ principal, monthly, annualRate: rate, months: years * 12 });
    const earned = finalAmount - totalContrib;
    const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(Math.round(n));
    return (<div className="space-y-5">
      <Slider label={t("Boshlang'ich kapital")} value={principal} min={100000} max={50000000} step={100000} display={t("{0} so'm", { "0": fmt(principal) })} onChange={setPrincipal}/>
      <Slider label={t("Oylik qo'shimcha")} value={monthly} min={0} max={5000000} step={50000} display={t("{0} so'm", { "0": fmt(monthly) })} onChange={setMonthly}/>
      <Slider label={t("Yillik nominal daromad")} value={rate} min={0} max={50} step={0.5} display={`${rate}%`} onChange={setRate}/>
      <Slider label={t("Muddat (yil)")} value={years} min={1} max={30} step={1} display={t("{0} yil", { "0": years })} onChange={setYears}/>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Result label={t("Yakuniy summa")} value={`${fmt(finalAmount)} so'm`} highlight/>
        <Result label={t("Kiritilgan")} value={`${fmt(totalContrib)} so'm`}/>
        <Result label={t("Qozonilgan")} value={`${fmt(earned)} so'm`}/>
      </div>
      <SavingsAssumptions />
    </div>);
}
/* ── Budget 50/30/20 calculator ── */
function BudgetCalc() {
    const { t } = useI18n();
    const [income, setIncome] = useState(5000000);
    const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(Math.round(n));
    const needs = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;
    return (<div className="space-y-5">
      <Slider label={t("Oylik daromad")} value={income} min={500000} max={50000000} step={100000} display={t("{0} so'm", { "0": fmt(income) })} onChange={setIncome}/>
      <div className="mt-4 space-y-3">
        <BudgetBar label={t("Ehtiyojlar (50%)")} amount={needs} total={income} color="bg-[#163e32]" fmt={fmt}/>
        <BudgetBar label={t("Istaklarlar (30%)")} amount={wants} total={income} color="bg-[#4a9e72]" fmt={fmt}/>
        <BudgetBar label={t("Jamg'arma (20%)")} amount={savings} total={income} color="bg-amber-500" fmt={fmt}/>
      </div>
    </div>);
}
function BudgetBar({ label, amount, total, color, fmt }: {
    label: string;
    amount: number;
    total: number;
    color: string;
    fmt: (n: number) => string;
}) {
    const { t } = useI18n();
    const pct = Math.round((amount / total) * 100);
    return (<div className="bg-[#f8f7f2] rounded-2xl p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-[#0f2017]">{t(label)}</span>
        <span suppressHydrationWarning className="text-sm font-bold text-[#0f2017]">{fmt(amount)}<>{" "}{t("so'm")}</></span>
      </div>
      <div className="h-2.5 bg-[#e9ebe7] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className={`h-full rounded-full ${color}`}/>
      </div>
    </div>);
}
/* ── Goal calculator ── */
function GoalCalc() {
    const { t } = useI18n();
    const [goal, setGoal] = useState(20000000);
    const [current, setCurrent] = useState(2000000);
    const [months, setMonths] = useState(24);
    const [rate, setRate] = useState(15);
    const remaining = Math.max(goal - current, 0);
    const needed = calculateGoalContribution({ goal, current, annualRate: rate, months });
    const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(Math.round(n));
    return (<div className="space-y-5">
      <Slider label={t("Maqsad summasi")} value={goal} min={1000000} max={500000000} step={1000000} display={t("{0} so'm", { "0": fmt(goal) })} onChange={setGoal}/>
      <Slider label={t("Hozirgi jamg'arma")} value={current} min={0} max={500000000} step={100000} display={t("{0} so'm", { "0": fmt(current) })} onChange={setCurrent}/>
      <Slider label={t("Muddat (oy)")} value={months} min={3} max={120} step={3} display={t("{0} oy", { "0": months })} onChange={setMonths}/>
      <Slider label={t("Yillik nominal daromad")} value={rate} min={0} max={40} step={0.5} display={`${rate}%`} onChange={setRate}/>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Result label={t("Oylik kerak")} value={`${fmt(Math.ceil(needed))} so'm`} highlight/>
        <Result label={t("Qolgan summa")} value={`${fmt(remaining)} so'm`}/>
      </div>
      <SavingsAssumptions />
      <p className="text-xs leading-relaxed text-[#65736d]"><>{t("Mavjud jamg\u2018arma ham shu stavkada o\u2018sadi. Oylik badal maqsadga yetishi uchun yuqoriga, butun so\u2018mgacha yaxlitlanadi.")}</></p>
    </div>);
}
/* ── Shared sub-components ── */
function SavingsAssumptions() {
    const { t } = useI18n();
    return (<p className="text-xs leading-relaxed text-[#65736d]"><>{t("Oylik stavka \u2014 yillik nominal stavkaning 1/12 qismi. Foiz har oy jamg\u2018armaga qo\u2018shiladi, badal oy oxirida kiritiladi. Stavka o\u2018zgarmaydi; soliq, komissiya va inflyatsiya hisobga olinmagan.")}</></p>);
}
function Slider({ label, value, min, max, step, display, onChange, }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    display: string;
    onChange: (v: number) => void;
}) {
    const { t } = useI18n();
    const id = useId();
    return (<div>
      <div className="flex justify-between mb-2">
        <label htmlFor={id} className="text-sm font-medium text-[#65736d]">{t(label)}</label>
        <span suppressHydrationWarning className="text-sm font-bold text-[#0f2017]">{t(display)}</span>
      </div>
      <input id={id} type="range" aria-valuetext={display} min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#163e32] bg-[#e2e4df]"/>
    </div>);
}
function Result({ label, value, highlight }: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    const { t } = useI18n();
    return (<div className={`rounded-2xl p-4 text-center ${highlight ? "bg-[#163e32] text-white" : "bg-[#f5f4ee]"}`}>
      <p className={`text-[11px] font-medium mb-1 ${highlight ? "text-[#8ea89d]" : "text-[#65736d]"}`}>
        {t(label)}
      </p>
      <p suppressHydrationWarning className={`text-sm font-bold leading-tight ${highlight ? "text-white" : "text-[#0f2017]"}`}>
        {value}
      </p>
    </div>);
}
/* ── Tool card ── */
const TOOLS = [
    { id: "credit", icon: Landmark, title: "Kredit kalkulyatori", desc: "Oylik to'lov va umumiy foiz hisobi.", component: CreditCalc },
    { id: "compound", icon: Percent, title: "Murakkab foiz", desc: "Jamg'arma vaqt bilan qanday o'sishini ko'ring.", component: CompoundCalc },
    { id: "budget", icon: WalletCards, title: "Oylik budjet (50/30/20)", desc: "Daromadni oqilona taqsimlang.", component: BudgetCalc },
    { id: "goal", icon: PiggyBank, title: "Maqsad kalkulyatori", desc: "Maqsadga yetish uchun oylik miqdorni biling.", component: GoalCalc },
];
export default function CalculatorsPage() {
    const { t } = useI18n();
    const [openId, setOpenId] = useState<string>("credit");
    return (<SectionShell eyebrow={t("Amaliy vositalar")} title={t("Hisoblang. Solishtiring. Keyin qaror qiling.")} description={t("Oddiy va shaffof kalkulyatorlar moliyaviy qarorning raqamlar ortidagi haqiqiy ta'sirini ko'rsatadi.")}>
      <div className="space-y-4">
        {TOOLS.map(({ id, icon: Icon, title, desc, component: Comp }) => {
            const isOpen = openId === id;
            return (<div key={id} className={`rounded-3xl border bg-white transition-all ${isOpen ? "border-[#35624f]/30 shadow-lg" : "border-[#13251f]/10"}`}>
              <button onClick={() => setOpenId(isOpen ? "" : id)} className="w-full flex items-center justify-between p-6 text-left">
                <div className="flex items-center gap-4">
                  <span className={`grid size-11 place-items-center rounded-2xl ${isOpen ? "bg-[#163e32] text-white" : "bg-[#e5ebe4] text-[#315d4c]"} transition-colors`}>
                    <Icon className="size-5"/>
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#0f2017]">{t(title)}</h2>
                    <p className="text-sm text-[#65736d] mt-0.5">{t(desc)}</p>
                  </div>
                </div>
                {isOpen ? (<ChevronUp className="size-5 text-[#65736d] shrink-0"/>) : (<ChevronDown className="size-5 text-[#65736d] shrink-0"/>)}
              </button>

              <AnimatePresence>
                {isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="border-t border-[#13251f]/8 px-6 pb-6 pt-5">
                      <Comp />
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </div>);
        })}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#dce7dd] p-5 text-sm text-[#36584b]">
        <Calculator className="size-5 shrink-0"/><>{t("Natijalar haqida savol bormi?")}</>{" "}
        <Link href="/tutor" className="font-bold underline underline-offset-2 inline-flex items-center gap-1"><>{t("AI Tutorga so'rang")}</><ArrowRight className="size-3.5"/>
        </Link>
      </div>
    </SectionShell>);
}
