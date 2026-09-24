"use client";
import { useI18n } from "@/i18n/provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, LogOut, CircleDollarSign, ArrowLeft } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
const navLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Foydalanuvchilar" },
];
export function AdminSidebar() {
    const { t } = useI18n();
    const pathname = usePathname();
    return (<aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#13251f]/10 bg-white px-4 py-4 md:py-6 flex md:flex-col md:min-h-screen shrink-0 gap-4">
      <div className="flex items-center gap-2.5 px-2 md:mb-8">
        <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white">
          <CircleDollarSign className="size-4.5"/>
        </span>
        <span className="font-semibold tracking-tight hidden sm:block"><>{t("Finora Admin")}</></span>
      </div>

      <nav className="flex md:flex-col flex-1 gap-1 overflow-x-auto">
        {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (<Link key={href} href={href} className={cn("flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-[#f3f1eb] text-[#13251f]" : "text-[#65736d] hover:bg-[#f3f1eb] hover:text-[#13251f]")}>
              <Icon className="size-4 shrink-0"/>
              <span className="hidden sm:inline">{t(label)}</span>
            </Link>);
        })}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65736d] hover:bg-[#f3f1eb] hover:text-[#13251f] transition-colors">
          <ArrowLeft className="size-4 shrink-0"/>
          <span className="hidden sm:inline"><>{t("Kabinetga")}</></span>
        </Link>
      </nav>

      <div className="md:mt-auto md:border-t border-[#13251f]/10 md:pt-4">
        <form action={signOut}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="size-4 shrink-0"/>
            <span className="hidden sm:inline"><>{t("Chiqish")}</></span>
          </button>
        </form>
      </div>
    </aside>);
}
