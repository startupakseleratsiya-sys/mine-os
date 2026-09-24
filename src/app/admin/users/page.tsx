import { getI18n } from "@/i18n/server";
import { Suspense } from "react";
import { UsersTable } from "@/features/admin/components/UsersTable";
export const metadata = { title: "Foydalanuvchilar" };
export default async function AdminUsersPage() {
    const { t } = await getI18n();
    return (<div className="p-6 sm:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#13251f]"><>{t("Foydalanuvchilar")}</></h1>
        <p className="mt-1 text-sm text-[#65736d]"><>{t("Ro'yxatdan o'tgan barcha foydalanuvchilar va ularning rollari.")}</></p>
      </header>
      <Suspense fallback={<div className="h-40 flex items-center justify-center border border-[#13251f]/10 rounded-xl bg-white text-sm text-[#65736d]"><>{t("Yuklanmoqda...")}</></div>}>
        <UsersTable />
      </Suspense>
    </div>);
}
