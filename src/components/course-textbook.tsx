"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, FileText } from "lucide-react";
import { courseMinutes, formatMinutes, type Course } from "@/content/courses";
import { CourseCurriculum } from "./course-curriculum";
import { SectionNavigation } from "./layouts/section-navigation";
export function CourseTextbook({ course, startHref, completedIds }: {
    course: Course;
    startHref: string;
    completedIds: Set<string>;
}) {
    const { t } = useI18n();
    const sources = [...new Map(course.chapters.flatMap((chapter) => chapter.source ? [[chapter.source.file, chapter.source] as const] : [])).values()];
    const mainModules = course.modules!.slice(0, 8);
    const questions = course.chapters.reduce((sum, chapter) => sum + (chapter.quiz?.length ?? 0), 0);
    const cases = course.chapters.filter((chapter) => chapter.exercise).length;
    const modules = course.modules!.map((module) => ({ ...module, lessons: module.chapterIds.map((id) => {
            const chapter = course.chapters.find((item) => item.id === id)!;
            return { id, title: chapter.title, minutes: chapter.minutes, questions: chapter.quiz?.length ?? 0, hasCase: Boolean(chapter.exercise), done: completedIds.has(id) };
        }) }));
    return (<div className="min-h-screen bg-[#f3f6f5] text-[#183c34]">
      <a href="#textbook-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-white focus:p-4"><>{t("Darslikka o\u2018tish")}</></a>
      <header className="border-b border-[#dce5e0] bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/courses" className="flex items-center gap-2 text-lg font-semibold"><BookOpen className="size-6"/><>{" "}{t("finora")}{" "}</><span className="ml-2 hidden border-l border-[#dce5e0] pl-4 text-sm font-normal text-[#52665e] sm:inline"><>{t("Darsliklar")}</></span></Link>
          <SectionNavigation />
          <Link href="/courses" className="text-sm md:hidden"><>{t("Barcha kurslar")}</></Link>
        </div>
        <SectionNavigation mobile/>
      </header>
      <main id="textbook-content" tabIndex={-1}>
        <section className="border-b border-[#dce5e0] bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:py-16">
            <div>
              <Link href="/courses" className="mb-8 inline-flex items-center gap-2 text-sm text-[#52665e]"><ArrowLeft className="size-4"/><>{" "}{t("Kurslar kutubxonasi")}</></Link>
              <p className="mb-4 text-sm font-medium text-[#52665e]"><>{t("PPP Guide \u00B7 2016 nashri \u00B7 O\u2018zbekcha o\u2018quv yo\u2018li")}</></p>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"><>{t("Davlat-xususiy sheriklik: g\u2018oyadan xizmatgacha")}</></h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#52665e]"><>{t("Bir loyiha butun hayot davri bo\u2018ylab. Darsni o\u2018qing, qarorni o\u2018zingiz qabul qiling va uni asl qo\u2018llanma bilan solishtiring.")}</></p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <span>{course.chapters.length}<>{" "}{t("dars")}</></span><span>{cases}<>{" "}{t("amaliy keys")}</></span><span>{questions}<>{" "}{t("test savoli")}</></span>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={startHref} className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#245b47] px-6 py-3 font-semibold text-white hover:bg-[#183c34]">{completedIds.size ? t("O\u2018qishni davom ettirish") : t("Darslikni ochish")}<ArrowRight className="size-4"/></Link>
                <a href="#source-library" className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold underline underline-offset-4">{sources.length}<>{" "}{t("ta PDF manba")}</></a>
              </div>
              <p className="mt-4 text-xs text-[#52665e]"><>{t("O\u2018qish va mashqlar ochiq. Natijalarni hisobingizda saqlashingiz mumkin.")}</></p>
            </div>
            <div className="self-center rounded-3xl bg-[#e5eee9] p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-lg font-semibold"><>{t("Loyihaning hayot davri")}</></h2><span className="text-xs text-[#52665e]"><>{t("8 bob")}</></span></div>
              <ol className="grid grid-cols-2 gap-x-5">
                {mainModules.map((module, index) => (<li key={module.id} className="relative border-t border-[#bdcfc4] py-4">
                    <Link href={`#module-${module.id}`} className="group flex items-start gap-3 leading-5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold">{index + 1}</span>
                      <span className="text-sm font-medium group-hover:underline">{t(module.title)}</span>
                    </Link>
                  </li>))}
              </ol>
              <p className="mt-4 border-t border-[#bdcfc4] pt-4 text-xs leading-5 text-[#52665e]"><>{t("Manba tushunchalari + Finora yaratgan terminal va infratuzilma misollari.")}</></p>
            </div>
          </div>
        </section>
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section aria-labelledby="curriculum-title">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 id="curriculum-title" className="text-2xl font-semibold"><>{t("Darslik mundarijasi")}</></h2><span className="text-sm text-[#52665e]"><>{t("Taxminiy o\u2018qish:")}{" "}</>{t(formatMinutes(courseMinutes(course)))}</span></div>
            <CourseCurriculum slug={course.slug} modules={modules}/>
          </section>
          <aside className="space-y-7 lg:sticky lg:top-6">
            <div className="border-l-2 border-[#245b47] pl-5"><h2 className="text-lg font-semibold"><>{t("Bu yerda nima qilasiz?")}</></h2><ul className="mt-4 space-y-4">{course.outcomes.map((outcome) => <li key={outcome} className="flex gap-2 text-sm leading-6 text-[#52665e]"><Check className="mt-1 size-4 shrink-0 text-[#245b47]"/>{t(outcome)}</li>)}</ul></div>
            <div className="rounded-2xl bg-[#e5eee9] p-5"><BookOpen className="mb-3 size-6"/><h3 className="font-semibold"><>{t("Asl manba yoningizda")}</></h3><p className="mt-2 text-sm leading-6 text-[#52665e]"><>{t("Dars ichidagi \u201CAsl PDF\u201D tugmasi kerakli bo\u2018limni ochadi. O\u2018zbekcha izoh bilan inglizcha matnni bir joyda solishtiring.")}</></p></div>
            <p className="text-xs leading-5 text-[#52665e]"><>{t("2016-yilgi qo\u2018llanma asosidagi mustaqil moslashtirish. Rasmiy tarjima yoki amaldagi CP3P imtihoniga to\u2018liq tayyorgarlik dasturi emas.")}</></p>
          </aside>
        </div>
        <section id="source-library" aria-labelledby="library-title" className="scroll-mt-6 border-t border-[#dce5e0] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><h2 id="library-title" className="text-2xl font-semibold"><>{t("Asl darsliklar kutubxonasi")}</></h2><p className="mt-2 text-sm text-[#52665e]">{sources.length}<>{" "}{t("ta PDF \u00B7")}{" "}</>{sources.reduce((sum, source) => sum + source.pages, 0)}<>{" "}{t("bet \u00B7 ingliz tilida")}</></p></div><a href="#curriculum-title" className="text-sm font-medium underline underline-offset-4"><>{t("Mundarijaga qaytish")}</></a></div>
            <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {sources.map((source, index) => <a key={source.file} href={`/materials/ppp/${encodeURIComponent(source.file)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 border-t border-[#dce5e0] py-5 hover:text-[#32745a]"><span className="grid h-16 w-12 shrink-0 place-items-center rounded-r-lg border-l-4 border-[#245b47] bg-[#e5eee9]">{index < 8 ? <span className="text-xl font-semibold">{index + 1}</span> : <FileText className="size-5"/>}</span><span className="text-sm font-medium leading-6">{t(source.title)}<span className="mt-1 block text-xs font-normal text-[#52665e]"><>{t("PDF \u00B7")}{" "}</>{source.pages}<>{" "}{t("bet \u00B7 yangi oynada ochiladi")}</></span></span></a>)}
            </div>
            <p className="mt-8 max-w-4xl text-xs leading-5 text-[#52665e]">{t(course.sourceNote)}</p>
          </div>
        </section>
      </main>
    </div>);
}
