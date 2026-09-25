import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Lock, Play, RotateCcw, Star, Trophy, Zap } from "lucide-react";
import { LEGACY_COURSE_REDIRECTS, courseMinutes, formatMinutes, getCourse } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";
import { courseProgress, courseUnlocked, getGameStats, getLessonAnswers, getLessonProgress } from "@/lib/progress";
import { getExamHistory } from "@/lib/exam-data";
import { mistakes, recentAccuracy } from "@/lib/learning-path";
import { pathOffset } from "@/lib/gamification";

type Params = { params: Promise<{ slug: string }> };

/**
 * Xarita geometriyasi: tugunlar to'lqinsimon siljiydi (mobil — 18px qadam, sm+ — 56px),
 * shuning uchun 360px ekranda ham gorizontal aylantirish yo'q.
 * 6px = qator ichki chekkasi (p-1.5), 28px = tugun radiusi.
 */
const STEP = 18;
const STEP_SM = 56;
const W = 6 + 2 * STEP + 56;
const W_SM = 6 + 2 * STEP_SM + 56;
const cx = (k: number, step: number) => 6 + k * step + 28;

function mapVars(k: number) {
  return { "--m": `${k * STEP}px`, "--ms": `${k * STEP_SM}px`, "--x": `${cx(k, STEP) - 2}px`, "--xs": `${cx(k, STEP_SM) - 2}px` } as CSSProperties;
}

/**
 * Ikki bekat orasidagi so'qmoq: tugun ostidan tik chiziq, so'ng qatorlar orasida egri burilish
 * (egri qism faqat oraliqda — matn ustiga tushmaydi). O'tilgan yo'l — yashil, qolgani — nuqtali.
 */
function Trail({ from, to, top, walked }: { from: number; to: number; top: number; walked: boolean }) {
  const stroke = walked ? "#28634f" : "#cfd6d0";
  const dash = walked ? undefined : "0.1 8";
  const curve = (step: number) => `M ${cx(from, step)} 0 C ${cx(from, step)} 16, ${cx(to, step)} 14, ${cx(to, step)} 30`;
  return (
    <span aria-hidden className="pointer-events-none">
      <span
        className={`absolute bottom-[8px] left-[var(--x)] w-1 rounded-full sm:left-[var(--xs)] ${walked ? "bg-[#28634f]" : "bg-[repeating-linear-gradient(to_bottom,#cfd6d0_0_4px,transparent_4px_8px)]"}`}
        style={{ top }}
      />
      <svg className="absolute bottom-[-22px] left-0 sm:hidden" width={W} height={30} viewBox={`0 0 ${W} 30`} fill="none">
        <path d={curve(STEP)} stroke={stroke} strokeWidth={4} strokeLinecap="round" strokeDasharray={dash} />
      </svg>
      <svg className="absolute bottom-[-22px] left-0 hidden sm:block" width={W_SM} height={30} viewBox={`0 0 ${W_SM} 30`} fill="none">
        <path d={curve(STEP_SM)} stroke={stroke} strokeWidth={4} strokeLinecap="round" strokeDasharray={dash} />
      </svg>
    </span>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return { title: course ? course.shortTitle : "Course not found" };
}

/** Kurs = o'yin xaritasi: tugatilgan ✓ (+yulduzlar) → joriy ▶ (yorug') → yopiq 🔒 → yakuniy kubok 🏆. */
export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  if (LEGACY_COURSE_REDIRECTS[slug]) permanentRedirect(`/courses/${LEGACY_COURSE_REDIRECTS[slug]}`);
  const course = getCourse(slug);
  if (!course) notFound();
  const user = await getCurrentUser();
  const rows = user ? await getLessonProgress(user.id) : [];
  const [answers, history, game] = user
    ? await Promise.all([getLessonAnswers(user.id, course.slug), getExamHistory(user.id, `cp3p-${course.level}`), getGameStats(user.id, rows)])
    : [[], null, null];
  const courseStars = game ? course.chapters.reduce((n, ch) => n + (game.stars[ch.id] ?? 0), 0) : 0;
  const cp = courseProgress(rows, course);
  const toReview = mistakes(answers).length;
  const ready = recentAccuracy(answers);
  const passedMock = history?.attempts.find((a) => a.mode === "mock" && a.passed) ?? null;
  const open = courseUnlocked(rows, course);
  const currentId = open ? cp.nextChapter?.id ?? null : null;
  const allDone = cp.total > 0 && cp.completed === cp.total;
  const left = cp.total - cp.completed;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#65736d] hover:text-[#163e32]"><ArrowLeft className="size-4" />All courses</Link>
      <p className="mt-6 text-4xl">{course.emoji}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
      <p className="mt-3 leading-7 text-[#52665e]">{course.description}</p>
      <p className="mt-2 text-sm text-[#65736d]">{cp.total} lessons · {formatMinutes(courseMinutes(course))} · {course.exam}</p>

      {game && (
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-[#163e32] p-3 text-white"><p className="text-xs opacity-70">Level</p><p className="text-xl font-semibold">{game.level}</p><div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-amber-300" style={{ width: `${Math.round(game.progress * 100)}%` }} /></div></div>
          <div className="rounded-2xl bg-white p-3"><p className="inline-flex items-center gap-1 text-xs text-[#65736d]"><Zap className="size-3.5 text-amber-500" />XP</p><p className="text-xl font-semibold">{game.xp.toLocaleString("en-US")}</p></div>
          <div className="rounded-2xl bg-white p-3"><p className="inline-flex items-center gap-1 text-xs text-[#65736d]"><Star className="size-3.5 fill-amber-400 text-amber-400" />Stars</p><p className="text-xl font-semibold">{courseStars}<span className="text-sm font-normal text-[#65736d]">/{cp.total * 3}</span></p></div>
        </div>
      )}

      <div className="mt-3 rounded-2xl bg-white p-4">
        <div className="flex justify-between text-sm font-semibold"><span>{cp.completed}/{cp.total} lessons passed</span><span>{cp.percent}%</span></div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e9ebe7]"><div className="h-full rounded-full bg-[#28634f]" style={{ width: `${cp.percent}%` }} /></div>
        {ready && (
          <p className="mt-3 text-sm text-[#52665e]">
            Accuracy in your last {ready.answered} test answers: <span className={`font-semibold ${ready.accuracy >= 0.8 ? "text-[#28634f]" : ready.accuracy >= 0.6 ? "text-amber-700" : "text-red-700"}`}>{Math.round(ready.accuracy * 100)}%</span>
            <span className="text-[#65736d]"> · aim for 90% before the exam</span>
          </p>
        )}
      </div>
      {user && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[#163e32]">
          <Link href={`/exam/${course.level}`} className="hover:underline">Exam practice →</Link>
          <Link href="/exam/flashcards" className="hover:underline">Glossary flashcards →</Link>
        </p>
      )}
      {toReview > 0 && (
        <Link href={`/courses/${course.slug}/review`} className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm hover:bg-amber-100">
          <span><span className="font-semibold text-amber-900">Review my mistakes ({toReview})</span><span className="block text-amber-900/80">Questions you missed come back until you get them right.</span></span>
          <RotateCcw className="size-5 shrink-0 text-amber-900" />
        </Link>
      )}

      {!open && (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This level opens after you finish <Link href="/courses/cp3p-foundation" className="font-semibold underline">CP3P Foundation</Link> — the real exam also requires Foundation first.
        </p>
      )}

      <ol className="mt-8 space-y-4">
        {course.chapters.map((ch, i) => {
          const done = cp.completedIds.has(ch.id);
          const current = ch.id === currentId;
          const locked = !done && !current;
          const stars = game?.stars[ch.id] ?? 0;
          const showStars = done && Boolean(game);
          const body = (
            <>
              <span className="flex w-14 shrink-0 flex-col items-center">
                <span className={`grid size-14 place-items-center rounded-full border-4 border-[#F5F4EE] text-sm font-bold ${done ? "bg-[#28634f] text-white" : current ? "bg-[#163e32] text-white shadow-[0_0_0_5px_rgba(159,211,184,0.6),0_0_26px_rgba(40,99,79,0.55)]" : "bg-[#e9ebe7] text-[#8a968f]"}`}>
                  {done ? <CheckCircle2 className="size-6" /> : current ? <Play className="size-5 fill-current" /> : <Lock className="size-5" />}
                </span>
                {showStars && (
                  <span className="mt-1 flex h-4 gap-0.5" aria-label={`${stars} of 3 stars`}>
                    {[1, 2, 3].map((n) => <Star key={n} className={`size-3.5 ${n <= stars ? "fill-amber-400 text-amber-400" : "text-[#d5dbd6]"}`} />)}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1 pt-1.5">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#65736d]">Lesson {i + 1} · {ch.minutes} min</span>
                <span className={`mt-0.5 block font-semibold leading-snug ${locked ? "text-[#8a968f]" : ""}`}>{ch.title}</span>
                {current && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#163e32] px-3 py-1 text-sm font-semibold text-white">{cp.completed ? "Continue here" : "Start here"}<ArrowRight className="size-3.5" /></span>}
              </span>
            </>
          );
          const row = "relative ml-[var(--m)] flex items-start gap-3 rounded-2xl p-1.5 sm:ml-[var(--ms)]";
          return (
            <li key={ch.id} className="relative" style={mapVars(pathOffset(i))}>
              <Trail from={pathOffset(i)} to={pathOffset(i + 1)} top={showStars ? 82 : 62} walked={done} />
              {locked ? (
                <div className={row}>{body}</div>
              ) : (
                <Link href={`/study/${course.slug}/${ch.id}`} className={`${row} hover:bg-white/70`}>{body}</Link>
              )}
            </li>
          );
        })}
        {/* Yakuniy bekat — kubok: imtihon simulyatsiyasi (so'ng sertifikat). */}
        <li id="final" className="relative" style={mapVars(pathOffset(cp.total))}>
          {passedMock && allDone ? (
            <div className="ml-[var(--m)] sm:ml-[var(--ms)]">
              <Link href={`/certificate/${course.level}`} className="flex items-center gap-3 rounded-2xl bg-amber-400 p-1.5 pr-4 text-[#163e32]">
                <span className="grid size-14 shrink-0 place-items-center rounded-full border-4 border-[#F5F4EE] bg-[#163e32] text-amber-300"><Award className="size-6" /></span>
                <span><span className="block text-xs font-semibold uppercase tracking-[0.16em]">Simulation passed · {passedMock.score}/{passedMock.total}</span><span className="block font-semibold">Get your Finora certificate</span></span>
              </Link>
              <Link href={course.finalExamHref} className="mt-2 block pl-[68px] text-sm font-semibold text-[#163e32] hover:underline">Take another exam simulation →</Link>
            </div>
          ) : allDone ? (
            <Link href={course.finalExamHref} className="ml-[var(--m)] flex items-center gap-3 rounded-2xl bg-[#163e32] p-1.5 pr-4 text-white sm:ml-[var(--ms)]">
              <span className="grid size-14 shrink-0 place-items-center rounded-full border-4 border-[#F5F4EE] bg-amber-400 text-[#163e32] shadow-[0_0_0_5px_rgba(251,191,36,0.35),0_0_26px_rgba(251,191,36,0.5)]"><Trophy className="size-6" /></span>
              <span><span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Final step</span><span className="block font-semibold">Exam simulation — official format, timed</span></span>
            </Link>
          ) : (
            <div className="ml-[var(--m)] flex items-center gap-3 rounded-2xl p-1.5 sm:ml-[var(--ms)]">
              <span className="grid size-14 shrink-0 place-items-center rounded-full border-4 border-dashed border-amber-300 bg-amber-50 text-amber-500"><Trophy className="size-6" /></span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#65736d]">Final step</span>
                <span className="block font-semibold text-[#8a968f]">Exam simulation — opens after the last lesson</span>
                {left > 0 && <span className="block text-sm font-medium text-amber-700">{left} {left === 1 ? "lesson" : "lessons"} to go</span>}
              </span>
            </div>
          )}
        </li>
      </ol>

      {!user && <p className="mt-8 rounded-2xl bg-white p-4 text-sm"><Link href={`/sign-in?next=/courses/${course.slug}`} className="font-semibold underline">Sign in</Link> to save your progress and unlock lessons.</p>}
      <p className="mt-10 text-xs leading-5 text-[#65736d]">Lessons are Finora&apos;s own adaptation of the PPP Guide 2026 (© AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group, CC BY 3.0 IGO). Not affiliated with APMG International.</p>
    </div>
  );
}
