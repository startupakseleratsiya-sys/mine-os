import { getI18n } from "@/i18n/server";
import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { COURSES, courseMinutes, formatMinutes } from "@/content/courses";
export const metadata = { title: "Get started" };
export default async function OnboardingPage() {
    const { t } = await getI18n();
    return (<div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center justify-center p-6 py-16 text-[#13251F] font-sans">
      <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#13251F] flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span className="font-bold text-2xl tracking-tight"><>{t("finora")}</></span>
      </Link>

      <div className="w-full max-w-4xl text-center mt-12">
        <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] mb-3 uppercase"><>{t("Xush kelibsiz")}</></p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[#13251F] tracking-tight"><>{t("Qayerdan boshlaymiz?")}</></h1>
        <p className="text-[#6B7A74] mb-12 text-[17px] font-medium max-w-2xl mx-auto"><>{t("Bitta kursni tanlang \u2014 progress avtomatik saqlanadi, AI Tutor esa har bir bobda yoningizda bo'ladi.")}</></p>

        <div className="grid md:grid-cols-3 gap-5 text-left">
          {COURSES.map((course, i) => (<Link key={course.slug} href={`/courses/${course.slug}`} className={`group p-7 bg-white rounded-[24px] hover:shadow-xl transition-all block border-2 ${i === 0 ? "border-[#13251F]" : "border-[#E2E4DF] hover:border-[#a7c4b1]"}`}>
              <div className="w-14 h-14 bg-[#F5F4EE] border border-[#E2E4DF] rounded-xl flex items-center justify-center text-2xl mb-6">
                {course.emoji}
              </div>
              {i === 0 && (<span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#dce7dd] text-[#2a5e47] uppercase tracking-wider mb-3"><>{t("Tavsiya etiladi")}</></span>)}
              <h3 className="text-xl font-extrabold text-[#13251F] tracking-tight">{t(course.shortTitle)}</h3>
              <p className="text-[#6B7A74] text-sm mt-3 leading-relaxed">{t(course.description)}</p>
              <div className="mt-5 flex items-center gap-4 text-xs text-[#8e9b97]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5"/> {course.chapters.length}<>{" "}{t("bob")}</></span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5"/> {t(formatMinutes(courseMinutes(course)))}
                </span>
              </div>
              <div className="mt-6 flex items-center text-[#13251F] font-bold text-sm"><>{t("Kursni boshlash")}</><ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform"/>
              </div>
            </Link>))}
        </div>

        <Link href="/dashboard" className="inline-block mt-10 text-sm font-semibold text-[#6B7A74] hover:text-[#13251F] underline underline-offset-4"><>{t("Hozircha o'tkazib yuborish \u2192 kabinetga")}</></Link>
      </div>
    </div>);
}
