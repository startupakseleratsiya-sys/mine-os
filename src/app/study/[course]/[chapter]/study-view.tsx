"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  MessageSquareText,
  X,
} from "lucide-react";
import { Markdown } from "@/lib/markdown";
import { TutorChat } from "@/features/tutor/components/tutor-chat";
import { setLessonComplete } from "@/app/actions/progress";

export type StudyViewProps = {
  courseSlug: string;
  courseTitle: string;
  chapter: { id: string; title: string; minutes: number; body: string };
  index: number;
  total: number;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  initialCompleted: boolean;
  completedIds: string[];
  chapters: { id: string; title: string }[];
};

export function StudyView(props: StudyViewProps) {
  const { courseSlug, courseTitle, chapter, index, total, prev, next, chapters } = props;
  const router = useRouter();
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [completed, setCompleted] = useState(props.initialCompleted);
  const [completedIds, setCompletedIds] = useState(new Set(props.completedIds));
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function toggleComplete() {
    const nextValue = !completed;
    setError("");
    startTransition(async () => {
      const result = await setLessonComplete(courseSlug, chapter.id, nextValue);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCompleted(nextValue);
      setCompletedIds((prevIds) => {
        const copy = new Set(prevIds);
        if (nextValue) copy.add(chapter.id);
        else copy.delete(chapter.id);
        return copy;
      });
      router.refresh();
    });
  }

  const tutorContext = `Foydalanuvchi hozir "${courseTitle}" kursining "${chapter.title}" bobini o'qimoqda. Savollar shu mavzu kontekstida bo'lishi mumkin.`;

  return (
    <div className="flex h-dvh bg-[#F5F4EE] text-[#13251F] overflow-hidden">
      <div className={`flex-1 overflow-y-auto transition-[padding] duration-300 ${isTutorOpen ? "lg:pr-[420px]" : ""}`}>
        <header className="bg-white/90 backdrop-blur border-b border-[#E2E4DF] sticky top-0 z-10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
                <CircleDollarSign className="size-4" />
              </span>
              <span className="font-semibold tracking-tight hidden sm:block">finora</span>
            </Link>
            <span className="text-[#E2E4DF] hidden sm:block">|</span>
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B7A74] hover:text-[#163e32] transition-colors truncate"
            >
              <ArrowLeft className="size-4 shrink-0" />
              <span className="truncate">{courseTitle}</span>
            </Link>
          </div>

          <button
            onClick={() => setIsTutorOpen((v) => !v)}
            className="inline-flex items-center gap-2 bg-[#dce7dd] text-[#163e32] px-4 py-2 rounded-full text-sm font-bold shrink-0"
          >
            <MessageSquareText className="size-4" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>
        </header>

        <main className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-12">
          {/* Progress strip */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6B7A74] mb-2">
              <span className="uppercase tracking-widest">
                Bob {index + 1} / {total}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5" /> {chapter.minutes} daqiqa
              </span>
            </div>
            <div className="flex gap-1.5">
              {chapters.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/study/${courseSlug}/${ch.id}`}
                  title={ch.title}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    ch.id === chapter.id
                      ? "bg-[#163e32]"
                      : completedIds.has(ch.id)
                        ? "bg-[#4a9e72]"
                        : "bg-[#dfe3dd] hover:bg-[#c5cfc9]"
                  }`}
                />
              ))}
            </div>
          </div>

          <article>
            <Markdown text={chapter.body} size="lg" />
          </article>

          {error && (
            <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-14 pt-8 border-t border-[#E2E4DF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={toggleComplete}
              disabled={pending}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto justify-center disabled:opacity-60 ${
                completed
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-white border border-[#E2E4DF] text-[#13251F] hover:bg-[#F5F4EE]"
              }`}
            >
              {pending ? <LoaderCircle className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
              {completed ? "Bajarildi ✓" : "Bobni tugatdim"}
            </button>

            <div className="flex w-full sm:w-auto gap-3">
              {prev && (
                <Link
                  href={`/study/${courseSlug}/${prev.id}`}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-white border border-[#E2E4DF] hover:bg-[#F5F4EE] transition-colors"
                >
                  <ArrowLeft className="size-4" /> Oldingi
                </Link>
              )}
              {next ? (
                <Link
                  href={`/study/${courseSlug}/${next.id}`}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#163e32] text-white hover:bg-[#0e3026] shadow-lg shadow-[#163e32]/10 transition-all hover:-translate-y-0.5"
                >
                  Keyingi bob <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Link
                  href={`/courses/${courseSlug}`}
                  className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#163e32] text-white hover:bg-[#0e3026] shadow-lg shadow-[#163e32]/10 transition-all hover:-translate-y-0.5"
                >
                  Kursni yakunlash <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed right-0 top-0 bottom-0 w-[420px] border-l border-[#E2E4DF] bg-[#f3f1eb] transition-transform duration-300 ${
          isTutorOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isTutorOpen}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E4DF] bg-white">
          <span className="text-sm font-bold flex items-center gap-2">
            <MessageSquareText className="size-4 text-[#163e32]" /> Finora AI
          </span>
          <button
            onClick={() => setIsTutorOpen(false)}
            aria-label="Yopish"
            className="p-2 rounded-full hover:bg-[#F5F4EE] text-[#13251f]"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <TutorChat embedded context={tutorContext} />
        </div>
      </aside>

      {/* Mobile full-screen */}
      {isTutorOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#f3f1eb] flex flex-col">
          <div className="px-4 py-3 border-b border-[#E2E4DF] bg-white flex items-center justify-between">
            <span className="text-sm font-bold flex items-center gap-2">
              <MessageSquareText className="size-4 text-[#163e32]" /> Finora AI
            </span>
            <button onClick={() => setIsTutorOpen(false)} aria-label="Yopish" className="p-2 bg-[#F5F4EE] rounded-full text-[#13251f]">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <TutorChat embedded context={tutorContext} />
          </div>
        </div>
      )}
    </div>
  );
}
