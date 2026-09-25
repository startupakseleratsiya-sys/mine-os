import Link from "next/link";
import { ArrowRight, BookOpenCheck, CircleDollarSign, Flag, Lock, PlayCircle } from "lucide-react";
import { COURSES, TOTAL_CHAPTERS, courseMinutes, formatMinutes } from "@/content/courses";
import { getCurrentUser } from "@/services/user-service";

/** Bosh sahifa — faqat CP3P: 3 bosqich, o'quv yo'li qanday ishlaydi, boshlash tugmasi. */
const STEPS = [
  { icon: PlayCircle, title: "Watch, listen or read", text: "Every lesson comes as a narrated video, an audio version and clear text with a worked example." },
  { icon: BookOpenCheck, title: "Pass the lesson test", text: "10 exam-style questions plus 2 from earlier lessons. Score 80% to move on." },
  { icon: Lock, title: "Unlock the next lesson", text: "Lessons open one by one, so nothing is skipped and nothing is forgotten." },
  { icon: Flag, title: "Sit the exam simulation", text: "Finish a level to take timed mocks in the official APMG format." },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  const start = user ? "/courses" : "/sign-up";
  return (
    <div className="min-h-screen w-full bg-[#f5f4ee] text-[#13251f]">
      <header className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white"><CircleDollarSign className="size-4.5" /></span>
          <span className="text-xl font-bold tracking-tight">finora</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/courses" className="hidden px-3 py-2 text-sm font-medium text-[#5a6b65] hover:text-[#0f2017] sm:block">Courses</Link>
          {user ? (
            <Link href="/dashboard" className="rounded-xl bg-[#163e32] px-4 py-2.5 text-sm font-semibold text-white">My dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="px-3 py-2 text-sm font-semibold text-[#354841]">Sign in</Link>
              <Link href="/sign-up" className="rounded-xl bg-[#163e32] px-4 py-2.5 text-sm font-semibold text-white">Start free</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#527264]">APMG CP3P certification · PPP Guide 2026</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">Pass the CP3P exams, one clear step at a time.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52665e]">
            Foundation, Preparation and Execution — {TOTAL_CHAPTERS} lessons with video, audio and text, a test after every lesson, and exam simulations in the official format.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={start} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white hover:bg-[#0e3026]">Start with Foundation<ArrowRight className="size-4" /></Link>
            <Link href="/courses" className="inline-flex min-h-12 items-center rounded-xl border border-[#13251f]/15 bg-white px-6 font-semibold">See the courses</Link>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="rounded-3xl bg-[#f5f4ee] p-6">
                  <s.icon className="size-6 text-[#28634f]" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#65736d]">Step {i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#52665e]">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">Three levels</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {COURSES.map((c, i) => (
              <li key={c.slug} className="flex flex-col rounded-3xl border border-[#13251f]/10 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">Level {i + 1}</p>
                <p className="mt-3 text-3xl">{c.emoji}</p>
                <h3 className="mt-2 text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#65736d]">{c.description}</p>
                <p className="mt-4 text-xs text-[#65736d]">{c.chapters.length} lessons · {formatMinutes(courseMinutes(c))}</p>
                <p className="mt-1 text-xs text-[#65736d]">{c.exam}</p>
                <Link href={`/courses/${c.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#163e32] hover:underline">View lessons<ArrowRight className="size-4" /></Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-[#0f2017] py-10 text-sm text-[#8fa89c]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="font-semibold text-white">finora</p>
          <p className="mt-2 max-w-3xl text-xs leading-5">Independent study aid based on the PPP Guide 2026 (© AfDB, ADB, EBRD, IDB, IsDB and the World Bank Group, CC BY 3.0 IGO). Finora is not affiliated with APMG International; CP3P is a certification of APMG International. © 2026 Finora.</p>
        </div>
      </footer>
    </div>
  );
}
