"use client";
import { useI18n } from "@/i18n/provider";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Calculator, ChevronDown, CircleDollarSign, GraduationCap, Menu, Shield, Sparkles, TrendingUp, Users, X, Zap, } from "lucide-react";
import { COURSES as COURSE_CONTENT, TOTAL_CHAPTERS, courseMinutes, formatMinutes } from "@/content/courses";
/* ── Constants ── */
const NAV_LINKS = [
    { label: "Kurslar", href: "/courses" },
    { label: "AI Tutor", href: "/tutor" },
    { label: "Kalkulyator", href: "/calculators" },
    { label: "Narxlar", href: "#pricing" },
];
const STATS = [
    { value: `${COURSE_CONTENT.length}`, label: "Amaliy kurs" },
    { value: `${TOTAL_CHAPTERS}`, label: "Dars bobi" },
    { value: "4", label: "Moliyaviy kalkulyator" },
    { value: "24/7", label: "AI ustoz" },
];
const FEATURES = [
    {
        icon: Brain,
        color: "bg-violet-50 text-violet-600",
        title: "AI Shaxsiy Ustoz",
        desc: "Savollaringizga real vaqtda o'zbek tilida oddiy va aniq javob olasiz. 24/7 ishlaydi.",
    },
    {
        icon: GraduationCap,
        color: "bg-emerald-50 text-emerald-600",
        title: "Amaliy Kurslar",
        desc: "Shaxsiy budjet, jamg‘arma, investitsiya va davlat-xususiy sheriklik bo‘yicha amaliy darslar.",
    },
    {
        icon: Calculator,
        color: "bg-amber-50 text-amber-600",
        title: "Moliyaviy Kalkulyatorlar",
        desc: "Kredit, murakkab foiz va jamg'arma kalkulyatorlari — bir yerda, bepul.",
    },
    {
        icon: TrendingUp,
        color: "bg-sky-50 text-sky-600",
        title: "Progress Kuzatuv",
        desc: "Haftalik faollik, qozonilgan yutuqlar va o'sish dinamikangizni kuzating.",
    },
    {
        icon: Shield,
        color: "bg-rose-50 text-rose-600",
        title: "Ishonchli Ma'lumot",
        desc: "Barcha moliyaviy tushunchalar tekshirilgan manbalarga asoslangan.",
    },
    {
        icon: Zap,
        color: "bg-orange-50 text-orange-600",
        title: "Tezkor O'rganish",
        desc: "Mikro-darslar formati: har bir dars 5–15 daqiqa. Bandlikda ham o'rganing.",
    },
];
const COURSES = COURSE_CONTENT.map((c) => ({
    slug: c.slug,
    emoji: c.emoji,
    tag: c.tag === "top" ? "Eng mashhur" : c.tag === "new" ? "Yangi" : "Bepul",
    tagColor: c.tag === "top"
        ? "bg-[#dce7dd] text-[#2a5e47]"
        : c.tag === "new"
            ? "bg-violet-50 text-violet-700"
            : "bg-amber-50 text-amber-700",
    title: c.shortTitle,
    desc: c.description,
    lessons: c.chapters.length,
    hours: formatMinutes(courseMinutes(c)),
    level: c.level,
}));
/* ── Sub-components ── */
function Navbar({ mobileOpen, setMobileOpen }: {
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
}) {
    const { t } = useI18n();
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (<nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-[#f5f4ee] border-b border-[#E2E4DF] shadow-sm"
            : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white shadow-md shadow-[#163e32]/20">
              <CircleDollarSign className="size-4.5"/>
            </span>
            <span className="text-xl font-bold tracking-tight text-[#0f2017]"><>{t("finora")}</></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} className="text-[15px] font-medium text-[#5a6b65] hover:text-[#0f2017] transition-colors">
                {t(link.label)}
              </Link>))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in" className="px-4 py-2 text-sm font-semibold text-[#354841] hover:text-[#0f2017] transition-colors"><>{t("Kirish")}</></Link>
            <Link href="/sign-up" className="px-5 py-2.5 text-sm font-bold bg-[#163e32] text-white rounded-xl shadow-lg shadow-[#163e32]/20 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5"><>{t("Bepul boshlash")}</></Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden grid size-10 place-items-center rounded-lg border border-[#E2E4DF] bg-white" aria-label={t("Menyuni ochish")}>
            {mobileOpen ? <X className="size-5"/> : <Menu className="size-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <>
        {mobileOpen && (<div style={{ height: "auto", opacity: 1 }} className="md:hidden overflow-hidden bg-[#f5f4ee] border-b border-[#E2E4DF]">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-lg text-sm font-medium text-[#354841] hover:bg-white hover:text-[#0f2017] transition-colors">
                  {t(link.label)}
                </Link>))}
              <div className="pt-3 pb-1 flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="block text-center py-2.5 text-sm font-semibold text-[#354841] border border-[#E2E4DF] rounded-xl bg-white"><>{t("Kirish")}</></Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="block text-center py-2.5 text-sm font-bold text-white bg-[#163e32] rounded-xl"><>{t("Bepul boshlash")}</></Link>
              </div>
            </div>
          </div>)}
      </>
    </nav>);
}
/** Murakkab foiz o'sishi — statik SVG (3D sahna o'rniga, qotmasligi uchun). */
function GrowthChart() {
    const bars = [1, 1.15, 1.32, 1.52, 1.75, 2.01, 2.31, 2.66, 3.06, 3.52, 4.05];
    const max = bars[bars.length - 1];
    return (<svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="400" height="400" rx="24" fill="#F7F8F4"/>
      {[100, 170, 240, 310].map((y) => (<line key={y} x1="40" x2="360" y1={y} y2={y} stroke="#E2E4DF" strokeWidth="1"/>))}
      {bars.map((v, i) => {
            const h = (v / max) * 250;
            return (<rect key={i} x={48 + i * 29} y={330 - h} width="18" height={h} rx="5" fill={i === bars.length - 1 ? "#4a9e72" : "#163e32"} opacity={0.35 + (i / bars.length) * 0.65}/>);
        })}
      <polyline fill="none" stroke="#4a9e72" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={bars.map((v, i) => `${57 + i * 29},${330 - (v / max) * 250 - 10}`).join(" ")}/>
    </svg>);
}
function HeroSection() {
    const { t } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);
    return (<section ref={containerRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F5F4EE]"/>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-[#dce7dd]/60 via-transparent to-transparent rounded-full" style={{ background: "radial-gradient(circle at center, rgba(220,231,221,0.6) 0%, transparent 70%)" }}/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px]" style={{ background: "radial-gradient(circle at center, rgba(74,158,114,0.1) 0%, transparent 70%)" }}/>
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(circle, #c5cfc9 1px, transparent 1px)",
            backgroundSize: "32px 32px",
        }}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 sm:py-20">
          {/* Left */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E2E4DF] text-sm font-semibold text-[#354841] shadow-sm mb-8">
              <span className="relative flex size-2.5">
                <span className="relative inline-flex rounded-full size-2.5 bg-[#163e32]"/>
              </span>
              {COURSE_CONTENT.length}<>{" "}{t("ta kurs,")}{" "}</>{TOTAL_CHAPTERS}<>{t("bob \u2014 hammasi o'zbek tilida, bepul")}</></div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#0f2017] mb-6"><>{t("Moliyaviy")}</>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#163e32]"><>{t("erkinlikka")}</></span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#dce7dd] -z-10 origin-left rounded"/>
              </span>{" "}
              <br /><>{t("AI bilan yo'l.")}</></h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-[#6B7A74] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"><>{t("Shaxsiy budjet, jamg'arma va investitsiya asoslarini o'zbek tilidagi AI moliya ustozi bilan tushunib o'rganing.")}</></p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href="/sign-up" className="group flex items-center justify-center gap-2.5 h-14 px-8 text-base font-bold bg-[#163e32] text-white rounded-2xl shadow-xl shadow-[#163e32]/20 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5"><>{t("Bepul boshlash")}</><ArrowRight className="size-5 group-hover:translate-x-1 transition-transform"/>
              </Link>
              <Link href="/tutor" className="flex items-center justify-center gap-2 h-14 px-8 text-base font-bold text-[#163e32] bg-white border border-[#E2E4DF] rounded-2xl hover:border-[#a7c4b1] hover:bg-[#f5f4ee] transition-all hover:-translate-y-0.5 shadow-sm">
                <Sparkles className="size-5 text-[#4a9e72]"/><>{t("AI Tutorni sinab ko'ring")}</></Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l, i) => (<div key={l} className="size-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white" style={{ background: ["#163e32", "#2a5e47", "#4a9e72", "#0e3026"][i] }}>
                    {l}
                  </div>))}
              </div>
              <p className="text-sm text-[#6B7A74] font-medium">
                <span className="font-bold text-[#0f2017]"><>{t("Bepul")}</></span><>{t("\u2014 karta kerak emas")}</></p>
            </div>
          </div>

          {/* Right — statik o'sish grafigi (WebGL yo'q, yengil) */}
          <div className="relative w-full aspect-square max-w-lg mx-auto lg:max-w-full">
            <div className="absolute inset-0 rounded-3xl border border-[#E2E4DF] bg-white shadow-sm">
              <GrowthChart />
            </div>

            {/* Floating stat cards */}
            <div className="absolute -left-4 sm:-left-8 top-1/4 bg-white border border-[#E2E4DF] rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-xs text-[#6B7A74] font-medium"><>{t("Murakkab foiz")}</></p>
              <p className="text-2xl font-bold text-[#0f2017]">×16</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className="size-3.5 text-emerald-500"/>
                <span className="text-[10px] text-emerald-600 font-semibold"><>{t("20 yilda, 15% da")}</></span>
              </div>
            </div>

            <div className="absolute -right-4 sm:-right-8 bottom-1/4 bg-white border border-[#E2E4DF] rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-xs text-[#6B7A74] font-medium"><>{t("AI suhbat")}</></p>
              <p className="text-2xl font-bold text-[#0f2017]">24/7</p>
              <p className="text-[10px] text-[#6B7A74] mt-0.5"><>{t("o'zbek tilida javob")}</></p>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border border-[#E2E4DF] rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
              <div className="size-8 rounded-full bg-[#163e32]/10 grid place-items-center">
                <Users className="size-4 text-[#163e32]"/>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0f2017]"><>{t("50/30/20 qoidasi")}</></p>
                <p className="text-[10px] text-[#6B7A74]"><>{t("2-bobda amaliy misol bilan")}</></p>
              </div>
              <div className="size-2.5 rounded-full bg-emerald-400 ml-1"/>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex justify-center pb-8">
          <div className="flex flex-col items-center gap-2 text-[#9aa39f] cursor-pointer">
            <span className="text-xs font-medium"><>{t("Pastga aylantiring")}</></span>
            <ChevronDown className="size-4"/>
          </div>
        </div>
      </div>
    </section>);
}
function StatsBar() {
    const { t } = useI18n();
    return (<section className="bg-[#0f2017] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (<div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[#8ea89d] font-medium">{t(stat.label)}</p>
            </div>))}
        </div>
      </div>
    </section>);
}
function FeaturesSection() {
    const { t } = useI18n();
    return (<section className="py-20 sm:py-28 bg-[#F5F4EE]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#4a9e72] mb-4"><>{t("Nima uchun Finora?")}</></p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0f2017] tracking-tight max-w-2xl mx-auto"><>{t("O'rganish bu qiyin emas.")}</></h2>
          <p className="mt-5 text-lg text-[#6B7A74] max-w-xl mx-auto"><>{t("Finora moliyaviy ta'limni sodda, qulay va qiziqarli qiladi.")}</></p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (<div key={f.title} className="bg-white rounded-3xl p-7 border border-[#E2E4DF] cursor-pointer transition-shadow">
              <span className={`inline-grid size-12 place-items-center rounded-2xl ${f.color} mb-5`}>
                <f.icon className="size-5"/>
              </span>
              <h3 className="text-lg font-bold text-[#0f2017] mb-2">{t(f.title)}</h3>
              <p className="text-sm leading-6 text-[#6B7A74]">{t(f.desc)}</p>
            </div>))}
        </div>
      </div>
    </section>);
}
function CoursesPreview() {
    const { t } = useI18n();
    return (<section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#4a9e72] mb-3"><>{t("Kurslar")}</></p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0f2017] tracking-tight"><>{t("O\u2018zingizga mos kursni tanlang.")}</></h2>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#163e32] hover:underline shrink-0"><>{t("Barcha kurslar")}</><ArrowRight className="size-4"/>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (<div key={course.slug} className="group rounded-3xl border-2 border-[#E2E4DF] p-7 hover:border-[#a7c4b1] hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">{course.emoji}</span>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase ${course.tagColor}`}>
                  {t(course.tag)}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0f2017] mb-2">{t(course.title)}</h3>
              <p className="text-sm text-[#6B7A74] leading-6 mb-6">{t(course.desc)}</p>
              <div className="flex items-center gap-4 text-xs text-[#8e9b97] mb-6">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5"/>
                  {course.lessons}<>{" "}{t("dars")}</></span>
                <span>{t(course.hours)}</span>
                <span className="px-2 py-1 bg-[#f5f4ee] rounded-lg font-medium text-[#6B7A74]">
                  {t(course.level)}
                </span>
              </div>
              <Link href={`/courses/${course.slug}`} className="flex items-center justify-between pt-5 border-t border-[#E2E4DF]">
                <span className="text-sm font-bold text-[#163e32] group-hover:text-[#0e3026]"><>{t("Kursni ko'rish")}</></span>
                <ArrowRight className="size-4 text-[#163e32] group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>))}
        </div>
      </div>
    </section>);
}
function CTASection() {
    const { t } = useI18n();
    return (<section className="py-20 sm:py-28 bg-[#F5F4EE]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl bg-[#0f2017] p-12 sm:p-16 overflow-hidden">
          {/* Background rings */}
          <div className="absolute -top-20 -right-20 size-64 rounded-full border border-white/5"/>
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full border border-white/5"/>
          <div className="absolute top-8 right-8 size-40 rounded-full border border-white/5"/>

          <div className="relative">
            <span className="inline-block text-4xl mb-6">🚀</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5"><>{t("Bugun boshlang.")}</><br /><>{t("Bepul.")}</></h2>
            <p className="text-lg text-[#8ea89d] mb-10 max-w-lg mx-auto"><>{t("Karta kerak emas. Bir daqiqada ro'yxatdan o'ting va moliyaviy ta'lim yo'lingizni boshlang.")}</></p>
            <Link href="/sign-up" className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-[#0f2017] rounded-2xl font-bold text-base hover:bg-[#f5f4ee] transition-all hover:-translate-y-0.5 shadow-xl"><>{t("Hozir ro'yxatdan o'tish")}</><ArrowRight className="size-5"/>
            </Link>
          </div>
        </div>
      </div>
    </section>);
}
function Footer() {
    const { t } = useI18n();
    return (<footer className="bg-[#0f2017] py-12 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
              <CircleDollarSign className="size-4"/>
            </span>
            <span className="text-lg font-bold text-white"><>{t("finora")}</></span>
          </Link>
          <p className="text-sm text-[#5d7a6e] text-center"><>{t("Ta'lim. Tushunish. Ishonchli qaror. \u00A9 2025 Finora")}</></p>
          <div className="flex items-center gap-6 text-sm text-[#5d7a6e]">
            <Link href="/" className="hover:text-white transition-colors"><>{t("Maxfiylik")}</></Link>
            <Link href="/" className="hover:text-white transition-colors"><>{t("Shartlar")}</></Link>
            <Link href="/" className="hover:text-white transition-colors"><>{t("Aloqa")}</></Link>
          </div>
        </div>
      </div>
    </footer>);
}
/* ── Main Page ── */
export default function HomePage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (<div className="min-h-screen text-[#13251F] font-sans selection:bg-[#163e32] selection:text-white">
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <CoursesPreview />
      <CTASection />
      <Footer />
    </div>);
}
