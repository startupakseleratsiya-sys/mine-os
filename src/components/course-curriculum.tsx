"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Search } from "lucide-react";
type Module = {
    id: string;
    title: string;
    description: string;
    lessons: {
        id: string;
        title: string;
        minutes: number;
        questions: number;
        hasCase: boolean;
        done: boolean;
    }[];
};
export function CourseCurriculum({ slug, modules }: {
    slug: string;
    modules: Module[];
}) {
    const { t } = useI18n();
    const [query, setQuery] = useState("");
    const normalize = (text: string) => text.toLocaleLowerCase().replace(/[‘’ʻʼ']/g, "");
    const search = normalize(query.trim());
    const filtered = modules.map((module) => ({ ...module, lessons: module.lessons.filter((lesson) => normalize(`${module.title} ${lesson.title}`).includes(search)) })).filter((module) => module.lessons.length);
    return (<div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 size-5 text-[#52665e]" aria-hidden="true"/>
        <input type="search" aria-label={t("Darslarni qidirish")} placeholder={t("Dars toping: risk, DSCR, tender\u2026")} value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-xl border border-[#cfddd6] bg-white pl-12 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#245b47]"/>
      </div>
      {search && <p role="status" className="mb-4 text-sm text-[#52665e]">{filtered.reduce((sum, module) => sum + module.lessons.length, 0)}<>{" "}{t("ta dars topildi.")}</></p>}
      <div className="space-y-4">
        {filtered.map((module) => {
            const index = modules.findIndex((item) => item.id === module.id);
            return (<details key={`${module.id}-${Boolean(search)}`} open={Boolean(search) || index === 0 ? true : undefined} className="group overflow-hidden rounded-2xl border border-[#dce5e0] bg-white">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:hidden [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-[#245b47]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e8efeb] font-semibold text-[#245b47]">{index < 8 ? index + 1 : t("Aa")}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#183c34]">{t(module.title)}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#52665e]">{t(module.description)}</p>
                  <p className="mt-2 text-xs text-[#52665e]">{module.lessons.length}<>{" "}{t("dars \u00B7")}{" "}</>{module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)}<>{" "}{t("daqiqa")}</></p>
                </div>
                <ChevronDown className="mt-2 size-4 shrink-0 text-[#52665e] group-open:rotate-180" aria-hidden="true"/>
              </summary>
              <ol className="border-t border-[#e6ede9]">
                {module.lessons.map((lesson, i) => (<li key={lesson.id} className="border-b border-[#edf1ee] last:border-0">
                    <Link href={`/study/${slug}/${lesson.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-[#f3f7f4] focus-visible:outline-2 focus-visible:outline-[#245b47] sm:pl-19">
                      {lesson.done ? <CheckCircle2 className="size-5 shrink-0 text-[#245b47]" aria-label={t("Tugatilgan")}/> : <span className="w-5 shrink-0 text-xs text-[#52665e]">{i + 1}</span>}
                      <span className="flex-1 text-sm font-medium leading-6">{t(lesson.title)}<span className="mt-1 block text-xs font-normal text-[#52665e]">{lesson.minutes}<>{" "}{t("daqiqa \u00B7")}{" "}</>{lesson.questions}<>{" "}{t("savol")}</>{lesson.hasCase ? t(" \u00B7 amaliy keys") : ""}</span></span>
                      <ArrowRight className="size-4 shrink-0 text-[#245b47]" aria-hidden="true"/>
                    </Link>
                  </li>))}
              </ol>
            </details>);
        })}
      </div>
      {!filtered.length && <button type="button" onClick={() => setQuery("")} className="rounded-xl border border-[#cfddd6] px-5 py-3 text-sm font-semibold"><>{t("Qidiruvni tozalash")}</></button>}
    </div>);
}
