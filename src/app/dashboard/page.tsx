import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CircleDollarSign,
  GraduationCap,
  LogOut,
  MessageSquareText,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { getCurrentUser, getProfile, getUserProgress } from "@/services/user-service";
import { signOut } from "@/app/actions/auth";

export default async function DashboardPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    return (
      <div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center justify-center gap-4 p-8 text-center">
        <CircleDollarSign className="size-12 text-[#163e32]" />
        <h1 className="text-2xl font-bold text-[#0f2017]">Supabase sozlanmagan</h1>
        <p className="text-[#6B7A74] max-w-sm">
          Iltimos, <code className="bg-white px-2 py-1 rounded text-sm border border-[#E2E4DF]">.env.local</code> fayliga
          Supabase URL va Anon Key qiymatlarini kiriting va serverni qayta ishga tushiring.
        </p>
        <Link href="/" className="text-sm font-semibold text-[#163e32] underline">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }
  if (!user) redirect("/sign-in");

  const [profile, progress] = await Promise.all([
    getProfile(user.id),
    getUserProgress(user.id),
  ]);

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Foydalanuvchi";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const totalLessons = progress.reduce(
    (sum: number, p: { completed_lessons: number }) => sum + p.completed_lessons,
    0
  );

  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#13251F] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E4DF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white">
              <CircleDollarSign className="size-4.5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-[#0f2017] hidden sm:block">
              finora
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/dashboard", icon: TrendingUp, label: "Dashboard" },
              { href: "/courses", icon: BookOpen, label: "Kurslar" },
              { href: "/tutor", icon: MessageSquareText, label: "AI Tutor" },
              { href: "/calculators", icon: Calculator, label: "Kalkulyator" },
              { href: "/progress", icon: Target, label: "Progress" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#65736d] hover:bg-[#f5f4ee] hover:text-[#0f2017] transition-colors"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <span className="hidden sm:block text-sm font-semibold text-[#354841]">
                {displayName}
              </span>
              <div className="size-9 rounded-full bg-[#163e32] grid place-items-center text-white text-sm font-bold">
                {initials}
              </div>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Chiqish"
                className="grid size-9 place-items-center rounded-lg text-[#65736d] hover:bg-[#f5f4ee] hover:text-red-600 transition-colors border border-[#E2E4DF]"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Greeting */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-2">
            Xush kelibsiz 👋
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2017] tracking-tight">
            Salom, {displayName.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-[#6B7A74]">O'rganishni davom ettiramizmi?</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Tugatilgan darslar", value: totalLessons.toString(), icon: BookOpen, color: "text-emerald-600" },
            { label: "Faol kurslar", value: progress.length.toString(), icon: GraduationCap, color: "text-sky-600" },
            { label: "O'rganish streigi", value: "3 kun", icon: TrendingUp, color: "text-amber-600" },
            { label: "AI suhbatlar", value: "12", icon: MessageSquareText, color: "text-violet-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-[#E2E4DF]">
              <Icon className={`size-5 ${color} mb-3`} />
              <p className="text-2xl font-extrabold text-[#0f2017]">{value}</p>
              <p className="text-xs text-[#6B7A74] mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active course — wide */}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-4">
              Faol kurs
            </p>
            <div className="bg-white rounded-3xl border border-[#E2E4DF] p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-[#dce7dd] text-[#2a5e47] uppercase tracking-wider mb-4">
                    Joriy daraja
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0f2017] tracking-tight mb-1">
                    Shaxsiy budjet: Moliyaviy barqarorlik
                  </h2>
                  <p className="text-[#6B7A74] text-sm mb-6">
                    1-Bob: Moliyaviy rejalashtirishga kirish
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-[#F5F4EE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#163e32] rounded-full transition-all duration-1000"
                        style={{ width: "25%" }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#354841] shrink-0">25%</span>
                  </div>
                </div>
                <Link
                  href="/study/shaxsiy-budjet/mod-1"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#163e32] text-white font-bold rounded-2xl shadow-lg shadow-[#163e32]/15 hover:bg-[#0e3026] transition-all hover:-translate-y-0.5 shrink-0 text-sm"
                >
                  Davom etish
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Quick actions */}
            <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mt-8 mb-4">
              Tezkor harakatlar
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: "/tutor", icon: MessageSquareText, label: "AI Tutor", desc: "Savol bering", color: "bg-violet-50 text-violet-600" },
                { href: "/calculators", icon: Calculator, label: "Kalkulyator", desc: "Hisoblang", color: "bg-amber-50 text-amber-600" },
                { href: "/progress", icon: TrendingUp, label: "Progress", desc: "Natijalar", color: "bg-sky-50 text-sky-600" },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="group bg-white rounded-2xl border border-[#E2E4DF] p-5 flex items-center gap-4 hover:border-[#a7c4b1] hover:shadow-md transition-all"
                >
                  <span className={`grid size-10 place-items-center rounded-xl ${color}`}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#0f2017]">{label}</p>
                    <p className="text-xs text-[#6B7A74]">{desc}</p>
                  </div>
                  <ArrowRight className="size-4 text-[#c5cfc9] ml-auto group-hover:text-[#163e32] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Profile card */}
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-4">
                Profil
              </p>
              <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="size-14 rounded-full bg-[#163e32] grid place-items-center text-white text-xl font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#0f2017]">{displayName}</p>
                    <p className="text-xs text-[#6B7A74] mt-0.5">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E2E4DF] text-sm font-semibold text-[#354841] hover:bg-[#f5f4ee] transition-colors"
                >
                  <User className="size-4" />
                  Profilni tahrirlash
                </Link>
              </div>
            </div>

            {/* Achievement */}
            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-[#6B7A74] uppercase mb-4">
                Yutuqlar
              </p>
              <div className="bg-white rounded-3xl border border-[#E2E4DF] p-6 text-center">
                <div className="size-16 mx-auto bg-[#F5F4EE] border border-[#E2E4DF] rounded-full grid place-items-center mb-5">
                  <span className="text-3xl">🏅</span>
                </div>
                <h3 className="font-bold text-[#0f2017] mb-2">Tayyorgarlik</h3>
                <p className="text-sm text-[#6B7A74] leading-relaxed">
                  Moliyaviy maqsadga yetish uchun yana 3 ta bob qoldi.
                </p>
                <div className="mt-5 h-1.5 bg-[#F5F4EE] rounded-full overflow-hidden">
                  <div className="h-full w-[25%] bg-[#163e32] rounded-full" />
                </div>
                <p className="mt-2 text-right text-xs text-[#6B7A74]">25% tayyor</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
