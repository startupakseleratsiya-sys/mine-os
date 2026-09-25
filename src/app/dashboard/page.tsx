import { getI18n } from "@/i18n/server";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CircleDollarSign, Flame, GraduationCap, LogOut, MessageSquareText, Target, TrendingUp, User, } from "lucide-react";
import { getCurrentUser, getProfile, getChatSessionCount } from "@/services/user-service";
import { signOut } from "@/app/actions/auth";
import { COURSES, TOTAL_CHAPTERS } from "@/content/courses";
import { activeCourse, computeStreak, courseProgress, courseUnlocked, getLessonProgress } from "@/lib/progress";
export const metadata = { title: "Dashboard" };
const NAV = [
    { href: "/dashboard", icon: TrendingUp, label: "Dashboard" },
    { href: "/courses", icon: BookOpen, label: "Kurslar" },
    { href: "/tutor", icon: MessageSquareText, label: "AI Tutor" },
    { href: "/progress", icon: Target, label: "Progress" },
];
export default async function DashboardPage() {
    const { t } = await getI18n();
    let user;
    try {
        user = await getCurrentUser();
    }
    catch {
        return (<div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center justify-center gap-4 p-8 text-center">
        <CircleDollarSign className="size-12 text-[#163e32]"/>
        <h1 className="text-2xl font-bold text-[#0f2017]"><>{t("Supabase sozlanmagan")}</></h1>
        <p className="text-[#6B7A74] max-w-sm"><>{t("Iltimos,")}</><code className="bg-white px-2 py-1 rounded text-sm border border-[#E2E4DF]"><>{t(".env.local")}</></code><>{t("fayliga Supabase URL va Anon Key qiymatlarini kiriting va serverni qayta ishga tushiring.")}</></p>
        <Link href="/" className="text-sm font-semibold text-[#163e32] underline"><>{t("Bosh sahifaga qaytish")}</></Link>
      </div>);
    }
    if (!user)
        redirect("/sign-in");
    const [profile, rows, chatCount] = await Promise.all([
        getProfile(user.id),
        getLessonProgress(user.id),
        getChatSessionCount(user.id),
    ]);
    const metaName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
    const displayName = profile?.full_name || metaName || user.email?.split("@")[0] || "Foydalanuvchi";
    const initials = displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const active = activeCourse(rows);
    const startedCourses = COURSES.filter((c) => courseProgress(rows, c).completed > 0).length;
    const streak = computeStreak(rows);
    const continueHref = active.nextChapter
        ? `/study/${active.course.slug}/${active.nextChapter.id}`
        : `/courses/${active.course.slug}`;
    const overallPercent = Math.round((rows.length / TOTAL_CHAPTERS) * 100);
    return (<div className="min-h-screen bg-[#F5F4EE] text-[#13251F] font-sans">
      <header className="bg-white border-b border-[#E2E4DF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white">
              <CircleDollarSign className="size-4.5"/>
            </span>
            <span className="text-xl font-bold tracking-tight text-[#0f2017] hidden sm:block"><>{t("finora")}</></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, icon: Icon, label }) => (<Link key={href} href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#65736d] hover:bg-[#f5f4ee] hover:text-[#0f2017] transition-colors">
                <Icon className="size-4"/>
                {t(label)}
              </Link>))}
            {profile?.role === "admin" && (<Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-[#65736d] hover:bg-[#f5f4ee]"><>{t("Admin")}</></Link>)}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <span className="hidden sm:block text-sm font-semibold text-[#354841]">{displayName}</span>
              <div className="size-9 rounded-full bg-[#163e32] grid place-items-center text-white text-sm font-bold">
                {initials}
              </div>
            </Link>
            <form action={signOut}>
              <button type="submit" aria-label={t("Chiqish")} className="grid size-9 place-items-center rounded-lg text-[#65736d] hover:bg-[#f5f4ee] hover:text-red-600 transition-colors border border-[#E2E4DF]">
                <LogOut className="size-4"/>
              </button>
            </form>
          </div>
        </div>
        <nav className="md:hidden flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map(({ href, label }) => (<Link key={href} href={href} className="shrink-0 rounded-full border border-[#E2E4DF] px-3 py-1.5 text-xs font-medium text-[#65736d]">
              {t(label)}
            </Link>))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-2"><>{t("Xush kelibsiz \uD83D\uDC4B")}</></p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2017] tracking-tight"><>{t("Salom,")}{" "}</>{displayName.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-[#6B7A74]">
            {rows.length === 0 ? t("Birinchi darsni boshlaymizmi?") : t("O'rganishni davom ettiramizmi?")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Tugatilgan boblar", value: `${rows.length}/${TOTAL_CHAPTERS}`, icon: BookOpen, color: "text-emerald-600" },
            { label: "Boshlangan kurslar", value: `${startedCourses}/${COURSES.length}`, icon: GraduationCap, color: "text-sky-600" },
            { label: "O'rganish streigi", value: `${streak} ${streak === 1 ? "day" : "days"}`, icon: Flame, color: "text-amber-600" },
            { label: "AI suhbatlar", value: `${chatCount}`, icon: MessageSquareText, color: "text-violet-600" },
        ].map(({ label, value, icon: Icon, color }) => (<div key={label} className="bg-white rounded-2xl p-5 border border-[#E2E4DF]">
              <Icon className={`size-5 ${color} mb-3`}/>
              <p className="text-2xl font-extrabold text-[#0f2017]">{value}</p>
              <p className="text-xs text-[#6B7A74] mt-1 font-medium">{t(label)}</p>
            </div>))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-4">
              {rows.length === 0 ? t("Tavsiya etilgan kurs") : t("Faol kurs")}
            </p>
            <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-[#dce7dd] text-[#2a5e47] uppercase tracking-wider mb-4">
                    {t(active.course.level)}
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0f2017] tracking-tight mb-1">{t(active.course.title)}</h2>
                  <p className="text-[#6B7A74] text-sm mb-6">
                    {active.nextChapter
            ? t("Keyingi: {0}", { "0": t(active.nextChapter.title) }) : t("Barcha boblar tugatilgan \uD83C\uDF89")}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-[#F5F4EE] rounded-full overflow-hidden">
                      <div className="h-full bg-[#163e32] rounded-full transition-all duration-1000" style={{ width: `${active.percent}%` }}/>
                    </div>
                    <span className="text-sm font-bold text-[#354841] shrink-0">
                      {active.completed}/{active.total} · {active.percent}%
                    </span>
                  </div>
                </div>
                <Link href={continueHref} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#163e32] text-white font-bold rounded-2xl shadow-lg shadow-[#163e32]/15 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5 shrink-0 text-sm">
                  {active.completed === 0 ? t("Boshlash") : active.nextChapter ? t("Davom etish") : t("Ko'rish")}
                  <ArrowRight className="size-4"/>
                </Link>
              </div>
            </div>

            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mt-8 mb-4"><>{t("Barcha kurslar")}</></p>
            <div className="grid sm:grid-cols-3 gap-4">
              {COURSES.map((course) => {
            const cp = courseProgress(rows, course);
            const href = cp.nextChapter && courseUnlocked(rows, course) ? `/study/${course.slug}/${cp.nextChapter.id}` : `/courses/${course.slug}`;
            return (<Link key={course.slug} href={href} className="group bg-white rounded-2xl border border-[#E2E4DF] p-5 hover:border-[#a7c4b1] hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{course.emoji}</span>
                      <span className="text-xs font-bold text-[#354841]">{cp.percent}%</span>
                    </div>
                    <p className="text-sm font-bold text-[#0f2017] leading-snug">{t(course.shortTitle)}</p>
                    <p className="text-xs text-[#6B7A74] mt-1">{cp.completed}/{cp.total}<>{" "}{t("bob")}</></p>
                    <div className="mt-3 h-1.5 bg-[#F5F4EE] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4a9e72] rounded-full" style={{ width: `${cp.percent}%` }}/>
                    </div>
                  </Link>);
        })}
            </div>

            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mt-8 mb-4"><>{t("Tezkor harakatlar")}</></p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
            { href: "/tutor", icon: MessageSquareText, label: "AI Tutor", desc: "Savol bering", color: "bg-violet-50 text-violet-600" },
            { href: "/exam/flashcards", icon: BookOpen, label: "Flashcards", desc: "Glossary terms, 10 minutes a day", color: "bg-amber-50 text-amber-600" },
            { href: "/progress", icon: TrendingUp, label: "Progress", desc: "Natijalar", color: "bg-sky-50 text-sky-600" },
        ].map(({ href, icon: Icon, label, desc, color }) => (<Link key={href} href={href} className="group bg-white rounded-2xl border border-[#E2E4DF] p-5 flex items-center gap-4 hover:border-[#a7c4b1] hover:shadow-md transition-all">
                  <span className={`grid size-10 place-items-center rounded-xl ${color}`}>
                    <Icon className="size-5"/>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#0f2017]">{t(label)}</p>
                    <p className="text-xs text-[#6B7A74]">{t(desc)}</p>
                  </div>
                  <ArrowRight className="size-4 text-[#c5cfc9] ml-auto group-hover:text-[#163e32] group-hover:translate-x-1 transition-all"/>
                </Link>))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-4"><>{t("Profil")}</></p>
              <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="size-14 rounded-full bg-[#163e32] grid place-items-center text-white text-xl font-bold">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0f2017] truncate">{displayName}</p>
                    <p className="text-xs text-[#6B7A74] mt-0.5 truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E2E4DF] text-sm font-semibold text-[#354841] hover:bg-[#f5f4ee] transition-colors">
                  <User className="size-4"/><>{t("Profilni tahrirlash")}</></Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-4"><>{t("Umumiy yo'l")}</></p>
              <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6 text-center">
                <div className="size-16 mx-auto bg-[#F5F4EE] border border-[#E2E4DF] rounded-full grid place-items-center mb-5">
                  <span className="text-3xl">{overallPercent === 100 ? "🏆" : overallPercent >= 50 ? "🚀" : "🏅"}</span>
                </div>
                <h3 className="font-bold text-[#0f2017] mb-2">
                  {overallPercent === 100 ? t("Barcha kurslar tugatildi!") : overallPercent === 0 ? t("Boshlang'ich") : t("Yaxshi ketyapsiz")}
                </h3>
                <p className="text-sm text-[#6B7A74] leading-relaxed">
                  {TOTAL_CHAPTERS - rows.length === 0
            ? t("Endi AI Tutor bilan bilimni mustahkamlang.") : t("Barcha kurslarni tugatish uchun yana {0} ta bob qoldi.", { "0": TOTAL_CHAPTERS - rows.length })}
                </p>
                <div className="mt-5 h-1.5 bg-[#F5F4EE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#163e32] rounded-full" style={{ width: `${overallPercent}%` }}/>
                </div>
                <p className="mt-2 text-right text-xs text-[#6B7A74]">{overallPercent}<>{t("% tayyor")}</></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>);
}
