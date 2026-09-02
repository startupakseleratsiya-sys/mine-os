"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageSquareText, X, CheckCircle2, ChevronRight, CircleDollarSign } from "lucide-react";
import { TutorChat } from "@/features/tutor/components/tutor-chat";

// Mock content generator
const generateContent = (course: string, chapter: string) => {
  return `
# ${chapter.replace("mod-", "Bob ")}

Xush kelibsiz! Ushbu bobda biz moliya asoslarini ko'rib chiqamiz.

## Asosiy Tushunchalar
1. **Budjetlashtirish**: O'z xarajatlaringizni nazorat qilish.
2. **50/30/20 Qoidasi**:
   - 50% - Zaruriy ehtiyojlar (ijara, oziq-ovqat).
   - 30% - Xohishlar (o'yin-kulgi, sayohat).
   - 20% - Jamg'arma va investitsiyalar.

> Muhim: Pulni boshqarish intizom talab qiladi.

## Amaliy topshiriq
Oxirgi oylik xarajatlaringizni hisoblab chiqing va qaysi kategoriyaga (50, 30 yoki 20) ko'proq tushganini aniqlang.
`;
};

export default function StudyPage({ params }: { params: { course: string; chapter: string } }) {
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  const content = generateContent(params.course, params.chapter);

  return (
    <div className="flex h-screen bg-[#F5F4EE] text-[#13251F] overflow-hidden">
      {/* Main Study Area */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isTutorOpen ? 'lg:pr-[400px]' : ''}`}>
        <header className="bg-white border-b border-[#E2E4DF] sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/dashboard" className="flex items-center gap-2">
               <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
                 <CircleDollarSign className="size-4" />
               </span>
               <span className="font-semibold tracking-tight hidden sm:block">finora</span>
             </Link>
             <span className="text-[#E2E4DF] hidden sm:block">|</span>
             <Link
               href={`/courses/${params.course}`}
               className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B7A74] hover:text-[#163e32] transition-colors"
             >
               Dasturga qaytish
             </Link>
          </div>
          
          <button
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            className="lg:hidden inline-flex items-center gap-2 bg-[#dce7dd] text-[#163e32] px-4 py-2 rounded-full text-sm font-bold"
          >
            <MessageSquareText className="size-4" />
            AI Tutor
          </button>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <span className="text-xs font-bold text-[#6B7A74] tracking-widest uppercase mb-2 block">
              {params.course.replace("-", " ")}
            </span>
          </div>
          
          {/* Markdown Content (Rendered manually for demo) */}
          <div className="prose prose-emerald lg:prose-lg prose-headings:text-[#0f2017] prose-p:text-[#65736d] prose-strong:text-[#163e32] prose-blockquote:border-[#163e32] prose-blockquote:bg-[#dce7dd]/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl max-w-none">
            {content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-extrabold mb-8">{line.slice(2)}</h1>;
              if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{line.slice(3)}</h2>;
              if (line.startsWith("> ")) return <blockquote key={i} className="my-6 italic border-l-4">{line.slice(2)}</blockquote>;
              if (line.match(/^\d+\./)) return <li key={i} className="ml-4 my-2 text-[#65736d] leading-relaxed">{line}</li>;
              if (line.startsWith("- ")) return <li key={i} className="ml-8 list-disc text-[#65736d] leading-relaxed">{line.slice(2)}</li>;
              if (line.trim() === "") return <br key={i} />;
              
              // Handle bold
              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="leading-relaxed mb-4 text-[#65736d]">
                  {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="text-[#13251f] font-semibold">{part.slice(2, -2)}</strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-16 pt-8 border-t border-[#E2E4DF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCompleted(!completed)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto justify-center ${
                completed 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-white border border-[#E2E4DF] text-[#13251F] hover:bg-[#F5F4EE]"
              }`}
            >
              <CheckCircle2 className="size-5" />
              {completed ? "Bajarildi" : "Tugatish"}
            </button>
            
            <Link
              href={`/courses/${params.course}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#163e32] text-white hover:bg-[#0e3026] shadow-lg shadow-[#163e32]/10 transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Keyingi bob <ArrowRight className="size-4" />
            </Link>
          </div>
        </main>
      </div>

      {/* AI Tutor Sidebar (Desktop) */}
      <div className={`hidden lg:block fixed right-0 top-0 bottom-0 w-[400px] border-l border-[#E2E4DF] bg-white transition-transform duration-300 transform ${isTutorOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={() => setIsTutorOpen(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full border border-[#E2E4DF] shadow-sm hover:bg-[#F5F4EE] text-[#13251f]"
        >
          <X className="size-4" />
        </button>
        <div className="h-full pt-16">
           <TutorChat />
        </div>
      </div>

      {/* AI Tutor Floating Button (Desktop) */}
      {!isTutorOpen && (
        <button
          onClick={() => setIsTutorOpen(true)}
          className="hidden lg:flex fixed bottom-8 right-8 items-center gap-3 px-6 py-4 bg-[#163e32] text-white rounded-full shadow-2xl hover:bg-[#0e3026] hover:-translate-y-1 transition-all z-50 group"
        >
          <MessageSquareText className="size-5" />
          <span className="font-bold">Finora AI - Savol bering</span>
        </button>
      )}
      
      {/* AI Tutor Modal (Mobile) */}
      {isTutorOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 border-b border-[#E2E4DF] flex justify-end">
             <button
               onClick={() => setIsTutorOpen(false)}
               className="p-2 bg-[#F5F4EE] rounded-full text-[#13251f]"
             >
               <X className="size-5" />
             </button>
          </div>
          <div className="flex-1 overflow-hidden">
             <TutorChat />
          </div>
        </div>
      )}
    </div>
  );
}
