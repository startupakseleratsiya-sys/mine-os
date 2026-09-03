import React from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, BookOpen, Clock3, CheckCircle } from "lucide-react";

export default async function StudyPage({ params }: { params: Promise<{ slug: string, mod: string }> }) {
  const { slug, mod } = await params;
  
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const modTitle = mod.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F4EE] pb-20">
      <header className="bg-white border-b border-[#E2E4DF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link
            href={`/courses/${slug}`}
            className="flex items-center gap-2 text-sm font-semibold text-[#65736d] hover:text-[#0f2017] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Kursga qaytish
          </Link>
          <div className="text-sm font-bold text-[#163e32] px-3 py-1 bg-[#dce7dd] rounded-full">
            {title} / {modTitle}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-[#E2E4DF] p-8 sm:p-12 shadow-sm text-center">
          <div className="size-20 mx-auto bg-[#dce7dd] text-[#2a5e47] rounded-full flex items-center justify-center mb-6">
            <PlayCircle className="size-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2017] mb-4">
            Video dars tayyorlanmoqda
          </h1>
          <p className="text-[#6B7A74] text-base max-w-lg mx-auto mb-8">
            Bu yerda tez kunda interaktiv video dars va topshiriqlar joylashtiriladi. Hozircha AI Tutor orqali bu mavzuni mustaqil o'rganishingiz mumkin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link
                href="/tutor"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#163e32] text-white font-bold rounded-2xl shadow-lg shadow-[#163e32]/20 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5"
              >
                AI Tutorga savol berish
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-[#E2E4DF] text-[#163e32] font-bold rounded-2xl hover:bg-[#f5f4ee] transition-all hover:-translate-y-0.5"
              >
                Dashboardga o'tish
              </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
