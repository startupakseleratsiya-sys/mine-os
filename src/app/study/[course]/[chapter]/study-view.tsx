"use client";
import { useI18n } from "@/i18n/provider";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileText, LoaderCircle, MessageSquareText, X } from "lucide-react";
import { Markdown } from "@/lib/markdown";
import { setLessonComplete } from "@/app/actions/progress";
import type { Chapter, Course } from "@/content/courses";
import { LessonSource } from "@/components/lesson-source";
import { LessonQuiz } from "@/components/lesson-quiz";
import { LessonExercise } from "@/components/lesson-exercise";
const TutorChat = dynamic(() => import("@/features/tutor/components/tutor-chat").then((module) => module.TutorChat), {
    loading: () => <p role="status" className="p-5 text-sm">AI ustoz yuklanmoqda…</p>,
});
export type StudyViewProps = {
    courseSlug: string;
    courseTitle: string;
    chapter: Chapter;
    sourceNote?: string;
    signedIn: boolean;
    modules?: Course["modules"];
    index: number;
    total: number;
    prev: {
        id: string;
        title: string;
    } | null;
    next: {
        id: string;
        title: string;
    } | null;
    initialCompleted: boolean;
    completedIds: string[];
    chapters: {
        id: string;
        title: string;
        minutes: number;
    }[];
};
function StudyContents({ props, completedIds }: {
    props: StudyViewProps;
    completedIds: Set<string>;
}) {
    const { t } = useI18n();
    const groups = props.modules ?? [{ id: "lessons", title: props.courseTitle, chapterIds: props.chapters.map((chapter) => chapter.id) }];
    const chapterById = new Map(props.chapters.map((chapter) => [chapter.id, chapter]));
    return (<nav aria-label={t("Darslar mundarijasi")} className="space-y-5">
      {groups.map((group) => (<details key={group.id} open={group.chapterIds.includes(props.chapter.id)}>
          <summary className="cursor-pointer py-2 text-sm font-semibold">{t(group.title)}</summary>
          <ol className="mt-1 space-y-1">
            {group.chapterIds.map((id) => {
                const lesson = chapterById.get(id);
                if (!lesson)
                    return null;
                const active = id === props.chapter.id;
                return (<li key={id}>
                  <Link href={`/study/${props.courseSlug}/${id}`} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-start gap-2 rounded-lg px-3 py-2 text-sm leading-5 ${active ? "bg-[#245b47] text-white" : "text-[#52665e] hover:bg-[#e5eee9]"}`}>
                    <span className="flex-1">{t(lesson.title)}<span className="mt-1 block text-xs opacity-80">{lesson.minutes}<>{" "}{t("daqiqa")}</></span></span>
                    {completedIds.has(id) && <CheckCircle2 className="mt-1 size-4 shrink-0" aria-label={t("Tugatilgan")}/>}
                  </Link>
                </li>);
            })}
          </ol>
        </details>))}
    </nav>);
}
export function StudyView(props: StudyViewProps) {
    const { t } = useI18n();
    const { courseSlug, courseTitle, chapter, index, total, prev, next } = props;
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [panel, setPanel] = useState<"source" | "tutor" | null>(null);
    const [tutorOpened, setTutorOpened] = useState(false);
    const [completed, setCompleted] = useState(props.initialCompleted);
    const [completedIds, setCompletedIds] = useState(() => new Set(props.completedIds));
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();
    const currentModule = props.modules?.find((module) => module.chapterIds.includes(chapter.id));
    const sourceHref = chapter.source ? `/materials/ppp/${encodeURIComponent(chapter.source.file)}#page=${chapter.source.startPage ?? 1}` : "";
    const signInHref = `/sign-in?next=${encodeURIComponent(`/study/${courseSlug}/${chapter.id}`)}`;
    const tutorContext = `The learner is currently studying the lesson "${t(chapter.title)}" in the course "${t(courseTitle)}". Questions may relate to this topic.`;
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return;
        if (panel && !dialog.open)
            dialog.showModal();
        if (!panel && dialog.open)
            dialog.close();
    }, [panel]);
    function toggleComplete() {
        const nextValue = !completed;
        setError("");
        startTransition(async () => {
            try {
                const result = await setLessonComplete(courseSlug, chapter.id, nextValue);
                if (!result.ok) {
                    setError(result.error);
                    return;
                }
                setCompleted(nextValue);
                setCompletedIds((previous) => {
                    const copy = new Set(previous);
                    if (nextValue)
                        copy.add(chapter.id);
                    else
                        copy.delete(chapter.id);
                    return copy;
                });
                router.refresh();
            }
            catch {
                setError("Natija saqlanmadi. Internet aloqasini tekshirib, qayta urinib ko‘ring.");
            }
        });
    }
    return (<div className="min-h-dvh bg-[#f3f6f5] text-[#183c34] [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#245b47]">
      <a href="#lesson-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-white focus:p-4"><>{t("Darsga o\u2018tish")}</></a>
      <header className="sticky top-0 z-20 border-b border-[#dce5e0] bg-white">
        <div className="mx-auto flex min-h-18 max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <Link href={`/courses/${courseSlug}`} className="inline-flex min-h-11 min-w-0 items-center gap-3 text-sm font-semibold">
            <ArrowLeft className="size-4 shrink-0"/><BookOpen className="hidden size-5 sm:block"/><span className="max-w-48 truncate sm:max-w-xs">{t(courseTitle)}</span>
          </Link>
          <div className="flex items-center gap-2">
            {chapter.source && <button type="button" onClick={() => setPanel("source")} aria-haspopup="dialog" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#cfddd6] px-3 text-sm font-semibold"><FileText className="size-4"/><>{t("Asl PDF")}</></button>}
            <button type="button" onClick={() => { setTutorOpened(true); setPanel("tutor"); }} aria-haspopup="dialog" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#245b47] px-3 text-sm font-semibold text-white"><MessageSquareText className="size-4"/><>{t("AI ustoz")}</></button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] items-start lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden max-h-[calc(100dvh-6rem)] overflow-y-auto px-5 py-8 lg:sticky lg:top-22 lg:block">
          <h2 className="mb-5 text-lg font-semibold"><>{t("Mundarija")}</></h2>
          <StudyContents props={props} completedIds={completedIds}/>
        </aside>
        <div className="min-w-0">
          <details className="m-4 rounded-xl border border-[#dce5e0] bg-white p-4 lg:hidden">
            <summary className="cursor-pointer py-2 text-sm font-semibold"><>{t("Mundarijani ochish \u00B7")}{" "}</>{index + 1}/{total}<>{" "}{t("dars")}</></summary>
            <div className="mt-4"><StudyContents props={props} completedIds={completedIds}/></div>
          </details>
          <main id="lesson-content" tabIndex={-1} className="mx-auto max-w-[880px] scroll-mt-28 bg-white px-5 py-8 sm:px-10 sm:py-12 lg:min-h-[calc(100dvh-5rem)] lg:border-x lg:border-[#dce5e0] lg:px-12">
            <div className="mb-8 border-b border-[#dce5e0] pb-5 text-sm text-[#52665e]">
              <p className="font-medium">{t(currentModule?.title ?? courseTitle)}</p>
              <p className="mt-2"><>{t("Dars")}{" "}</>{index + 1} / {total}<>{" "}{t("\u00B7 Taxminiy o\u2018qish:")}{" "}</>{chapter.minutes}<>{" "}{t("daqiqa")}</></p>
            </div>
            {chapter.objectives && <section aria-label={t("O\u2018quv maqsadlari")} className="mb-8 border-l-2 border-[#245b47] pl-5"><h2 className="font-semibold"><>{t("Darsdan so\u2018ng siz")}</></h2><ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-6 text-[#52665e]">{chapter.objectives.map((objective) => <li key={objective}>{t(objective)}</li>)}</ul></section>}
            <article className={props.modules ? "[&_p]:font-[Georgia,serif] [&_p]:leading-8 [&_li]:font-[Georgia,serif]" : undefined}>
              <Markdown text={t(chapter.body)} size="lg"/>
            </article>
            {chapter.flow && <section aria-label={t("Mavzu bosqichlari")} className="mt-8 border-y border-[#dce5e0] py-6"><h2 className="mb-5 font-semibold"><>{t("Bosqichlarni bog\u2018lang")}</></h2><ol className="grid gap-4 sm:grid-cols-2">{chapter.flow.map((step, stepIndex) => <li key={step.title} className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e5eee9] text-sm font-semibold">{stepIndex + 1}</span><div><h3 className="text-sm font-semibold">{t(step.title)}</h3><p className="mt-1 text-sm leading-6 text-[#52665e]">{t(step.description)}</p></div></li>)}</ol></section>}
            {chapter.terms && <details className="mt-7 rounded-xl bg-[#e5eee9] p-5"><summary className="cursor-pointer font-semibold"><>{t("Tayanch atamalar \u00B7")}{" "}</>{chapter.terms.length}</summary><dl className="mt-4 space-y-4">{chapter.terms.map(({ term, meaning }) => <div key={term}><dt className="text-sm font-semibold">{t(term)}</dt><dd className="mt-1 text-sm leading-6 text-[#52665e]">{t(meaning)}</dd></div>)}</dl></details>}
            {chapter.exercise && <LessonExercise key={`exercise-${chapter.id}`} exercise={chapter.exercise}/>}
            {chapter.quiz && <LessonQuiz key={`quiz-${chapter.id}`} questions={chapter.quiz}/>}
            {chapter.source && <LessonSource source={chapter.source}/>}
            {props.sourceNote && <p className="mt-5 text-xs leading-5 text-[#52665e]">{t(props.sourceNote)}</p>}
            {error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{t(error)}</p>}

            <footer className="mt-10 border-t border-[#dce5e0] pt-7">
              {props.signedIn ? <button type="button" onClick={toggleComplete} disabled={pending} aria-pressed={completed} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#cfddd6] bg-[#e5eee9] px-5 py-3 text-sm font-semibold disabled:opacity-60">{pending ? <LoaderCircle className="size-5 animate-spin"/> : <CheckCircle2 className="size-5"/>}{completed ? t("Dars tugatilgan") : t("Darsni tugatdim")}</button> : <p className="text-sm leading-6 text-[#52665e]"><>{t("O\u2018qish va mashqlar ochiq.")}{" "}</><Link href={signInHref} className="font-semibold text-[#245b47] underline underline-offset-4"><>{t("Natijani saqlash uchun kiring.")}</></Link></p>}
              <nav aria-label={t("Darslar orasida o\u2018tish")} className="mt-6 flex flex-wrap gap-3">
                {prev && <Link href={`/study/${courseSlug}/${prev.id}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-[#cfddd6] px-4 py-3 text-sm font-semibold"><ArrowLeft className="size-4"/><>{t("Oldingi dars")}</></Link>}
                <Link href={next ? `/study/${courseSlug}/${next.id}` : `/courses/${courseSlug}`} className="ml-auto flex min-h-12 items-center gap-2 rounded-xl bg-[#245b47] px-4 py-3 text-sm font-semibold text-white">{next ? t("Keyingi dars") : t("Mundarijaga qaytish")}<ArrowRight className="size-4"/></Link>
              </nav>
            </footer>
          </main>
        </div>
      </div>

      <dialog ref={dialogRef} onClose={() => setPanel(null)} aria-labelledby="study-panel-title" className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-full border-l border-[#dce5e0] bg-[#f3f6f5] p-0 text-[#183c34] backdrop:bg-black/25 sm:w-[min(680px,85vw)]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-[#dce5e0] bg-white p-4">
            <h2 id="study-panel-title" className="font-semibold">{panel === "source" ? t("Asl darslik") : t("AI ustoz")}</h2>
            <button type="button" autoFocus onClick={() => setPanel(null)} aria-label={t("Panelni yopish")} className="grid size-11 place-items-center rounded-full hover:bg-[#e5eee9]"><X className="size-5"/></button>
          </div>
          {panel === "source" && chapter.source && <><div className="space-y-2 p-4 text-sm leading-6"><p className="font-medium">{t(chapter.source.title)}</p><p>{t(chapter.source.reading)}</p><a href={sourceHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"><>{t("PDFni yangi oynada ochish")}</></a></div><iframe title={t("{0} \u2014 asl PDF", { "0": chapter.source.title })} src={sourceHref} className="min-h-0 w-full flex-1 border-0 bg-white"/></>}
          {tutorOpened && props.signedIn && <div hidden={panel !== "tutor"} className="min-h-0 flex-1"><TutorChat embedded context={tutorContext}/></div>}
          {panel === "tutor" && !props.signedIn && <div className="p-6"><p className="mb-5 leading-7"><>{t("AI ustozga savol berish va suhbatni saqlash uchun hisobingizga kiring.")}</></p><Link href={signInHref} className="inline-flex min-h-12 items-center rounded-xl bg-[#245b47] px-5 font-semibold text-white"><>{t("Hisobga kirish")}</></Link></div>}
        </div>
      </dialog>
    </div>);
}
