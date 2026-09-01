import { Suspense } from "react";
import { UsersTable } from "@/features/admin/components/UsersTable";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#13251f]">Boshqaruv Paneli</h1>
        <p className="mt-1 text-sm text-[#65736d]">Tizimdagi so'nggi ma'lumotlar va foydalanuvchilar holati.</p>
      </header>
      
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#13251f]">Foydalanuvchilar</h2>
        </div>
        <Suspense fallback={<div className="h-40 flex items-center justify-center border border-[#13251f]/10 rounded-xl bg-white text-sm text-[#65736d]">Yuklanmoqda...</div>}>
          <UsersTable />
        </Suspense>
      </section>
    </div>
  );
}
