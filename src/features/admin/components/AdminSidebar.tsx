"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BookOpen,
  Settings,
  LayoutDashboard,
  LogOut,
  CircleDollarSign,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Foydalanuvchilar" },
  { href: "/admin/courses", icon: BookOpen, label: "Kurslar" },
  { href: "/admin/settings", icon: Settings, label: "Sozlamalar" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#13251f]/10 bg-white px-4 py-6 flex flex-col min-h-screen shrink-0">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <span className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white">
          <CircleDollarSign className="size-4.5" />
        </span>
        <span className="font-semibold tracking-tight">Finora Admin</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#f3f1eb] text-[#13251f]"
                  : "text-[#65736d] hover:bg-[#f3f1eb] hover:text-[#13251f]"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#13251f]/10 pt-4">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Chiqish
          </button>
        </form>
      </div>
    </aside>
  );
}
