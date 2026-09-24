import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { CircleDollarSign } from "lucide-react";
export default async function NotFound() {
    const { t } = await getI18n();
    return (<div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center justify-center gap-5 p-8 text-center text-[#13251f]">
      <span className="grid size-14 place-items-center rounded-full bg-[#163e32] text-white">
        <CircleDollarSign className="size-6"/>
      </span>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B7A74]">404</p>
      <h1 className="text-2xl font-bold"><>{t("Sahifa topilmadi")}</></h1>
      <p className="max-w-sm text-sm text-[#6B7A74]"><>{t("Bu manzil mavjud emas yoki ko'chirilgan.")}</></p>
      <div className="flex gap-3">
        <Link href="/dashboard" className="rounded-xl bg-[#163e32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3026]"><>{t("Kabinet")}</></Link>
        <Link href="/courses" className="rounded-xl border border-[#E2E4DF] bg-white px-5 py-2.5 text-sm font-semibold hover:bg-[#f5f4ee]"><>{t("Kurslar")}</></Link>
      </div>
    </div>);
}
