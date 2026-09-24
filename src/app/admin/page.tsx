import { getI18n } from "@/i18n/server";
import { Suspense } from "react";
import Link from "next/link";
import { BookOpenCheck, MessageSquareText, Users } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { UsersTable } from "@/features/admin/components/UsersTable";
import { COURSES, TOTAL_CHAPTERS } from "@/content/courses";
export const metadata = { title: "Admin" };
async function countRows(table: string) {
    const supabase = await createClient();
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error)
        return null;
    return count ?? 0;
}
async function courseCompletionCounts() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("lesson_progress").select("course_slug");
    if (error || !data)
        return null;
    const counts = new Map<string, number>();
    for (const row of data as {
        course_slug: string;
    }[]) {
        counts.set(row.course_slug, (counts.get(row.course_slug) ?? 0) + 1);
    }
    return counts;
}
async function Stats() {
    const { t } = await getI18n();
    const [users, lessons, chats, perCourse] = await Promise.all([
        countRows("users"),
        countRows("lesson_progress"),
        countRows("chat_sessions"),
        courseCompletionCounts(),
    ]);
    const fmt = (n: number | null) => (n === null ? "—" : n.toString());
    return (<>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
            { icon: Users, label: "Foydalanuvchilar", value: fmt(users), color: "text-sky-600" },
            { icon: BookOpenCheck, label: "Tugatilgan boblar", value: fmt(lessons), color: "text-emerald-600" },
            { icon: MessageSquareText, label: "AI suhbatlar", value: fmt(chats), color: "text-violet-600" },
        ].map(({ icon: Icon, label, value, color }) => (<div key={label} className="rounded-2xl border border-[#13251f]/10 bg-white p-5">
            <Icon className={`size-5 ${color} mb-3`}/>
            <p className="text-2xl font-extrabold text-[#13251f]">{value}</p>
            <p className="text-xs text-[#65736d] mt-1 font-medium">{t(label)}</p>
          </div>))}
      </div>
      {users === null && (<p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><>{t("Baza jadvallari topilmadi \u2014")}</><code><>{t("supabase/migrations/00001_initial_schema.sql")}</></code><>{t("ni SQL Editor'da ishga tushiring.")}</></p>)}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#13251f] mb-4"><>{t("Kurslar bo'yicha faollik")}</></h2>
        <div className="rounded-xl border border-[#13251f]/10 bg-white divide-y divide-[#13251f]/5">
          {COURSES.map((course) => {
            const done = perCourse?.get(course.slug) ?? 0;
            return (<div key={course.slug} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#13251f]">{t(course.shortTitle)}</p>
                  <p className="text-xs text-[#65736d]">{course.chapters.length}<>{" "}{t("bob \u00B7")}{" "}</>{t(course.level)}</p>
                </div>
                <p className="text-sm font-bold text-[#163e32]">{perCourse ? t("{0} tugatish", { "0": done }) : "—"}</p>
              </div>);
        })}
          <div className="px-6 py-3 text-xs text-[#65736d]"><>{t("Jami")}{" "}</>{TOTAL_CHAPTERS}<>{" "}{t("bob,")}{" "}</>{COURSES.length}<>{" "}{t("kurs.")}</></div>
        </div>
      </section>
    </>);
}
export default async function AdminDashboardPage() {
    const { t } = await getI18n();
    return (<div className="p-6 sm:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#13251f]"><>{t("Boshqaruv paneli")}</></h1>
        <p className="mt-1 text-sm text-[#65736d]"><>{t("Tizimdagi umumiy ko'rsatkichlar va foydalanuvchilar.")}</></p>
      </header>

      <Suspense fallback={<div className="h-28 rounded-2xl bg-white border border-[#13251f]/10 animate-pulse"/>}>
        <Stats />
      </Suspense>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#13251f]"><>{t("So'nggi foydalanuvchilar")}</></h2>
          <Link href="/admin/users" className="text-sm font-semibold text-[#163e32] hover:underline"><>{t("Barchasi \u2192")}</></Link>
        </div>
        <Suspense fallback={<div className="h-40 flex items-center justify-center border border-[#13251f]/10 rounded-xl bg-white text-sm text-[#65736d]"><>{t("Yuklanmoqda...")}</></div>}>
          <UsersTable limit={8}/>
        </Suspense>
      </section>
    </div>);
}
