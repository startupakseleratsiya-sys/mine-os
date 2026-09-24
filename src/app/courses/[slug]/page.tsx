import { getI18n } from "@/i18n/server";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { courseMinutes, formatMinutes, getCourse } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, getLessonProgress, type LessonProgressRow } from "@/lib/progress";
import { LessonSource } from "@/components/lesson-source";
import { CourseTextbook } from "@/components/course-textbook";
type Params = {
    params: Promise<{
        slug: string;
    }>;
};
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const course = getCourse(slug);
    return { title: course ? course.shortTitle : "Kurs topilmadi" };
}
// Next 15+: `params` Promise — sinxron o'qilsa slug undefined bo'lib har kurs 404 qaytaradi.
export default async function CourseDetailsPage({ params }: Params) {
    const { t } = await getI18n();
    const { slug } = await params;
    const course = getCourse(slug);
    if (!course)
        notFound();
    let rows: LessonProgressRow[] = [];
    try {
        const user = await getCurrentUser();
        if (user)
            rows = await getLessonProgress(user.id);
    }
    catch {
        rows = [];
    }
    const cp = courseProgress(rows, course);
    const startHref = `/study/${slug}/${(cp.nextChapter ?? course.chapters[0]).id}`;
    if (course.modules)
        return <CourseTextbook course={course} startHref={startHref} completedIds={cp.completedIds}/>;
    return (<div className="min-h-screen bg-[#F5F4EE] text-[#13251F]">
      <div className="bg-white border-b border-[#E2E4DF] pb-10 pt-12 sm:pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7A74] hover:text-[#163e32] transition-colors mb-6">
            <ArrowLeft className="size-4"/><>{t("Barcha kurslar")}</></Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
              {t(course.level)}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#6B7A74] font-medium">
              <BookOpen className="size-4"/> {course.chapters.length}<>{t("bob")}</></span>
            <span className="flex items-center gap-1.5 text-sm text-[#6B7A74] font-medium">
              <Clock3 className="size-4"/> {t(formatMinutes(courseMinutes(course)))}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f2017] mb-4">{t(course.title)}</h1>
          <p className="text-[#65736d] text-lg leading-relaxed max-w-2xl mb-8">{t(course.description)}</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href={startHref} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#163e32] text-white font-bold rounded-2xl shadow-lg shadow-[#163e32]/15 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5">
              {cp.completed === 0 ? t("Kursni boshlash") : cp.nextChapter ? t("Davom ettirish") : t("Qayta ko'rish")}
              <ArrowRight className="size-4"/>
            </Link>
            {cp.completed > 0 && (<div className="flex items-center gap-3 text-sm text-[#6B7A74]">
                <div className="w-32 h-2 bg-[#F5F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4a9e72] rounded-full" style={{ width: `${cp.percent}%` }}/>
                </div>
                <span className="font-semibold">
                  {cp.completed}/{cp.total} · {cp.percent}%
                </span>
              </div>)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ListChecks className="size-6 text-[#163e32]"/>
              <h2 className="text-2xl font-bold text-[#0f2017]"><>{t("O'quv dasturi")}</></h2>
            </div>
            <div className="bg-white rounded-3xl border border-[#E2E4DF] overflow-hidden">
              {course.chapters.map((ch, index) => {
            const done = cp.completedIds.has(ch.id);
            return (<Link key={ch.id} href={`/study/${slug}/${ch.id}`} className={`flex items-center justify-between gap-3 p-5 hover:bg-[#F5F4EE] transition-colors ${index !== course.chapters.length - 1 ? "border-b border-[#E2E4DF]" : ""}`}>
                    <div className="flex items-start gap-4 min-w-0">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-emerald-100 text-emerald-700" : "bg-[#dce7dd] text-[#285744]"}`}>
                        {done ? <CheckCircle2 className="size-4"/> : index + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#0f2017]">{t(ch.title)}</h3>
                        <p className="text-xs text-[#6B7A74] mt-1">{ch.minutes}<>{" "}{t("daqiqa")}</>{done ? t(" \u00B7 tugatilgan") : ""}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#163e32] shrink-0">{done ? t("Qayta o'qish") : t("O'qish \u2192")}</span>
                  </Link>);
        })}
            </div>
          </section>
          {course.chapters.some((chapter) => chapter.source) && (<section aria-labelledby="course-materials">
              <h2 id="course-materials" className="text-2xl font-bold text-[#0f2017]"><>{t("PDF darsliklar")}</></h2>
              <p className="mt-3 text-sm leading-6 text-[#65736d]"><>{t("Darslarda qisqa o\u2018zbekcha izoh va mashqlar berilgan. Mavzuni chuqurroq o\u2018rganish uchun asl manbalarni oching.")}</></p>
              {course.chapters.map((chapter) => chapter.source && <LessonSource key={chapter.id} source={chapter.source}/>)}
              {course.sourceNote && <p className="mt-6 text-xs leading-5 text-[#65736d]">{t(course.sourceNote)}</p>}
            </section>)}
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6 shadow-sm">
            <h3 className="font-bold text-[#0f2017] mb-4 flex items-center gap-2">
              <Award className="size-5 text-amber-500"/><>{t("Nimalarni o'rganasiz?")}</></h3>
            <ul className="space-y-3">
              {course.outcomes.map((outcome) => (<li key={outcome} className="flex items-start gap-2.5 text-sm text-[#65736d] leading-relaxed">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5"/>
                  <span>{t(outcome)}</span>
                </li>))}
            </ul>
          </div>
        </div>
      </div>
    </div>);
}
