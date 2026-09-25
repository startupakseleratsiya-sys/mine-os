import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { getCurrentUser, getProfile } from "@/services/user-service";

/** Admin bo'limi: rol serverda ham tekshiriladi (faqat proxy'ga tayanilmaydi). */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/admin");
  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f7f2]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
