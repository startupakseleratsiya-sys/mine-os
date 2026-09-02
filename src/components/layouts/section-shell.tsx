import Link from "next/link";
import { ArrowLeft, CircleDollarSign, BookOpen, Calculator, MessageSquareText, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Kurslar" },
  { href: "/tutor", label: "AI Tutor" },
  { href: "/calculators", label: "Kalkulyator" },
  { href: "/progress", label: "Progress" },
];

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f1eb] text-[#13251f]">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-[#13251f]/10 bg-[#f8f7f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1120px] items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
              <CircleDollarSign className="size-4" />
            </span>
            <span className="font-semibold tracking-tight hidden sm:block">finora</span>
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#65736d] hover:bg-white hover:text-[#0f2017] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Back button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#13251f]/12 bg-white px-4 py-2.5 text-xs font-semibold hover:bg-[#f5f4ee] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Kabinetga qaytish</span>
            <span className="sm:hidden">Qaytish</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[1120px] px-4 py-12 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#527264]">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#66736e]">
          {description}
        </p>
        <div className="mt-12">{children}</div>
      </main>
    </div>
  );
}
