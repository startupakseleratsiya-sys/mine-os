import Link from "next/link";
import { Users, BookOpen, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-[#13251f]/10 bg-white px-4 py-6 flex flex-col min-h-screen">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="grid size-8 place-items-center rounded-lg bg-[#163e32] text-white font-bold">F</span>
        <span className="font-semibold tracking-tight text-lg">Finora Admin</span>
      </div>

      <nav className="flex-1 space-y-1">
        <Link href="/admin" className="flex items-center gap-3 rounded-lg bg-[#f3f1eb] px-3 py-2 text-sm font-medium text-[#13251f]">
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#65736d] hover:bg-[#f3f1eb] hover:text-[#13251f]">
          <Users className="size-4" />
          Foydalanuvchilar
        </Link>
        <Link href="/admin/courses" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#65736d] hover:bg-[#f3f1eb] hover:text-[#13251f]">
          <BookOpen className="size-4" />
          Kurslar
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#65736d] hover:bg-[#f3f1eb] hover:text-[#13251f]">
          <Settings className="size-4" />
          Sozlamalar
        </Link>
      </nav>

      <div className="mt-auto border-t border-[#13251f]/10 pt-4">
        <form action={async () => {
          'use server'
          const supabase = await createClient()
          await supabase.auth.signOut()
          redirect('/sign-in')
        }}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="size-4" />
            Chiqish
          </button>
        </form>
      </div>
    </aside>
  );
}
