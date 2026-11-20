"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, ClipboardCheck, House, MessageCircle } from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", short: "Home", icon: House },
    { href: "/courses", label: "Courses", short: "Courses", icon: BookOpen },
    { href: "/audit", label: "Audit testi", short: "Audit", icon: ClipboardCheck },
    { href: "/tutor", label: "AI tutor", short: "Tutor", icon: MessageCircle },
    { href: "/progress", label: "Results", short: "Results", icon: BarChart3 },
];

function isActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
        || (href === "/courses" && pathname.startsWith("/study/"));
}

export function SectionNavigation({ mobile = false }: {
    mobile?: boolean;
}) {
    const { t } = useI18n();
    const pathname = usePathname();
    if (mobile) {
        // Mobil: 5 ta bo'lim bitta qatorda, ikonka + qisqa nom — hech biri ekrandan chiqib ketmaydi.
        return (<nav aria-label={t("Main sections")} className="grid grid-cols-5 gap-1 px-2 pb-2 md:hidden">
        {NAV_ITEMS.map(({ href, label, short, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (<Link key={href} href={href} aria-label={t(label)} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-medium leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163e32] ${active
                        ? "bg-[#163e32] text-white"
                        : "text-[#65736d] hover:bg-white hover:text-[#0f2017]"}`}>
              <Icon className="size-4" aria-hidden/>
              <span className="truncate">{short}</span>
            </Link>);
            })}
      </nav>);
    }
    return (<nav aria-label={t("Main sections")} className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (<Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163e32] ${active
                    ? "bg-[#163e32] text-white"
                    : "text-[#65736d] hover:bg-white hover:text-[#0f2017]"}`}>
            {t(label)}
          </Link>);
        })}
    </nav>);
}
