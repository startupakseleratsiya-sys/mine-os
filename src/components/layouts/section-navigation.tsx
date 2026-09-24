"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
const NAV_ITEMS = [
    { href: "/dashboard", label: "Kabinet" },
    { href: "/courses", label: "Kurslar" },
    { href: "/tutor", label: "AI ustoz" },
    { href: "/calculators", label: "Kalkulyator" },
    { href: "/progress", label: "Natijalar" },
];
export function SectionNavigation({ mobile = false }: {
    mobile?: boolean;
}) {
    const { t } = useI18n();
    const pathname = usePathname();
    return (<nav aria-label={t("Asosiy bo\u2018limlar")} className={mobile
            ? "flex gap-1 overflow-x-auto px-3 pb-2 md:hidden"
            : "hidden items-center gap-1 md:flex"}>
      {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
                || (href === "/courses" && pathname.startsWith("/study/"));
            return (<Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163e32] ${active
                    ? "bg-[#163e32] text-white"
                    : "text-[#65736d] hover:bg-white hover:text-[#0f2017]"}`}>
            {t(label)}
          </Link>);
        })}
    </nav>);
}
