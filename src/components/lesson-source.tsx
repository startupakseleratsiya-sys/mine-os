"use client";
import { useI18n } from "@/i18n/provider";

import { FileText } from "lucide-react";
import type { Chapter } from "@/content/courses";
export function LessonSource({ source }: {
    source: NonNullable<Chapter["source"]>;
}) {
    const { t } = useI18n();
    const href = `/materials/ppp/${encodeURIComponent(source.file)}`;
    return (<section aria-label={t("Dars manbasi")} className="mt-8 rounded-2xl border border-[#dce2d9] bg-[#eef2e9] p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-[#163e32]"><FileText className="size-4" aria-hidden="true"/><>{" "}{t("Asl darslik \u00B7 PDF \u00B7 ingliz tilida")}</></p>
      <p className="mt-2 break-words text-sm font-medium">{t(source.title)}</p>
      <p className="mt-1 text-sm leading-6 text-[#65736d]">{source.pages}<>{" "}{t("bet. O\u2018qish uchun:")}{" "}</>{t(source.reading)}.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={`${href}#page=${source.startPage ?? 1}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-[#163e32] px-4 py-2 text-sm font-semibold text-white"><>{t("PDFni ochish")}{" "}</><span className="sr-only"><>{t("(yangi oynada)")}</></span></a>
        <a href={href} download={source.file} className="inline-flex min-h-11 items-center rounded-xl border border-[#163e32]/20 px-4 py-2 text-sm font-semibold text-[#163e32]"><>{t("Yuklab olish")}</></a>
      </div>
    </section>);
}
