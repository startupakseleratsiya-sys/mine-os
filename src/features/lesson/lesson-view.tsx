"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, Headphones, ListChecks, MessageSquareText, PlayCircle, Target } from "lucide-react";
import type { Lesson } from "@/content/cp3p/types";
import type { PublicItem } from "@/lib/learning-path";
import dynamic from "next/dynamic";
import { Markdown } from "@/features/exam/markdown";
import { ListenLesson, VideoLesson } from "./video-lesson";
import { LessonTest } from "./lesson-test";
import { plainForSpeech } from "./narrator";

const TutorChat = dynamic(() => import("@/features/tutor/components/tutor-chat").then((m) => m.TutorChat), {
  loading: () => <p role="status" className="p-5 text-sm">Loading the tutor…</p>,
});

type Props = {
  courseSlug: string;
  courseTitle: string;
  lesson: Lesson;
  index: number;
  total: number;
  completed: boolean;
  items: PublicItem[];
  passMark: number;
  nextHref: string | null;
  finalHref: string;
  signedIn: boolean;
  audio?: { slides?: string; parts?: string };
};

/** Bitta dars: video / audio / matn → test. Oddiy, bir ustunli sahifa. */
export function LessonView({ courseSlug, courseTitle, lesson, index, total, completed, items, passMark, nextHref, finalHref, signedIn, audio }: Props) {
  const [media, setMedia] = useState<"video" | "audio">("video");
  const [testing, setTesting] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const tutorContext = `CP3P ${lesson.level} lesson "${lesson.title}" (PPP Guide 2026, ${lesson.guideRef}). Key points: ${lesson.summary.join(" ")}`.slice(0, 600);
  const topRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const listenParts = [
    ...lesson.sections.map((s) => ({ heading: s.heading, text: plainForSpeech(s.body) })),
    { heading: `Example: ${lesson.example.title}`, text: plainForSpeech(lesson.example.body) },
    { heading: "Exam traps", text: lesson.examTraps.map((t) => `${t.trap}. ${t.fix}`).join(" ") },
    { heading: "Summary", text: lesson.summary.join(" ") },
  ];

  return (
    <div ref={topRef} className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/courses/${courseSlug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#65736d] hover:text-[#163e32]"><ArrowLeft className="size-4" />{courseTitle}</Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">Lesson {index + 1} of {total}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{lesson.title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#65736d]">
        <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" />{lesson.minutes} min</span>
        <span>PPP Guide 2026 · {lesson.guideRef}</span>
        {completed && <span className="inline-flex items-center gap-1.5 font-semibold text-[#28634f]"><CheckCircle2 className="size-4" />Passed</span>}
      </p>

      <div className="mt-8 flex gap-2">
        <button type="button" onClick={() => setMedia("video")} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold ${media === "video" ? "bg-[#163e32] text-white" : "border border-[#13251f]/15 bg-white"}`}><PlayCircle className="size-4" />Video lesson</button>
        <button type="button" onClick={() => setMedia("audio")} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold ${media === "audio" ? "bg-[#163e32] text-white" : "border border-[#13251f]/15 bg-white"}`}><Headphones className="size-4" />Audio</button>
      </div>
      <div className="mt-4">{media === "video" ? <VideoLesson lesson={lesson} number={index + 1} audioBase={audio?.slides} /> : <ListenLesson parts={listenParts} audioBase={audio?.parts} />}</div>

      <section className="mt-10 rounded-3xl bg-[#e7ece6] p-6">
        <p className="inline-flex items-center gap-2 font-semibold"><Target className="size-4" />By the end of this lesson you can</p>
        <ul className="mt-3 space-y-1.5 text-[15px] leading-7">
          {lesson.objectives.map((o) => <li key={o} className="flex gap-2"><CheckCircle2 className="mt-1.5 size-4 shrink-0 text-[#28634f]" />{o}</li>)}
        </ul>
      </section>

      <article className="mt-10 space-y-10">
        {lesson.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-2xl font-semibold tracking-tight">{s.heading}</h2>
            <Markdown text={s.body} className="mt-4 text-[16px] leading-8 text-[#26352f]" />
          </section>
        ))}
      </article>

      <section className="mt-10 rounded-3xl border border-[#13251f]/10 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">Worked example</p>
        <h2 className="mt-2 text-xl font-semibold">{lesson.example.title}</h2>
        <Markdown text={lesson.example.body} className="mt-3" />
      </section>

      <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="inline-flex items-center gap-2 font-semibold text-amber-900"><AlertTriangle className="size-4" />Exam traps</p>
        <ul className="mt-4 space-y-4 text-[15px] leading-7">
          {lesson.examTraps.map((t) => (
            <li key={t.trap}><p className="font-semibold">{t.trap}</p><p className="text-[#52665e]">{t.fix}</p></li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-[#13251f]/10 bg-white p-6">
        <p className="font-semibold">Key terms</p>
        <dl className="mt-4 divide-y divide-[#13251f]/8 text-[15px] leading-7">
          {lesson.keyTerms.map((t) => (
            <div key={t.term} className="grid gap-1 py-2.5 sm:grid-cols-[180px_1fr] sm:gap-4"><dt className="font-semibold">{t.term}</dt><dd className="text-[#52665e]">{t.meaning}</dd></div>
          ))}
        </dl>
        {lesson.level === "foundation" && <Link href="/exam/flashcards" className="mt-4 inline-block text-sm font-semibold text-[#163e32] hover:underline">Practise every Glossary term with flashcards →</Link>}
      </section>

      <section className="mt-6 rounded-3xl bg-[#163e32] p-6 text-white">
        <p className="inline-flex items-center gap-2 font-semibold"><ListChecks className="size-4" />Remember</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-7">
          {lesson.summary.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>

      {signedIn && (
        <details className="mt-6 rounded-3xl border border-[#13251f]/10 bg-white" onToggle={(e) => setTutorOpen((e.currentTarget as HTMLDetailsElement).open)}>
          <summary className="cursor-pointer list-none p-5 font-semibold">
            <span className="inline-flex items-center gap-2"><MessageSquareText className="size-4" />Stuck? Ask the AI tutor about this lesson</span>
          </summary>
          {tutorOpen && <div className="h-[520px] border-t border-[#13251f]/10"><TutorChat embedded context={tutorContext} /></div>}
        </details>
      )}

      <section ref={testRef} className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight">Lesson test</h2>
        <p className="mt-2 text-sm text-[#65736d]">{items.length} questions{items.some((i) => i.review) ? ", including 2 from earlier lessons" : ""}. Score {passMark}/{items.length} (80%) to unlock the next lesson. Try to answer from memory — that is what makes it stick.</p>
        <div className="mt-5">
          {!signedIn ? (
            <Link href={`/sign-in?next=${encodeURIComponent(`/study/${courseSlug}/${lesson.id}`)}`} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#163e32] px-6 font-semibold text-white hover:bg-[#0e3026] sm:w-auto">
              Sign in to take the test and save your progress
            </Link>
          ) : testing ? (
            <LessonTest
              courseSlug={courseSlug}
              lessonId={lesson.id}
              items={items}
              passMark={passMark}
              nextHref={nextHref}
              finalHref={finalHref}
              onRestudy={() => { setTesting(false); topRef.current?.scrollIntoView({ behavior: "smooth" }); }}
            />
          ) : (
            <button type="button" onClick={() => { setTesting(true); setTimeout(() => testRef.current?.scrollIntoView({ behavior: "smooth" }), 50); }} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#163e32] px-6 font-semibold text-white hover:bg-[#0e3026] sm:w-auto">
              {completed ? "Take the test again" : "Start the test"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
