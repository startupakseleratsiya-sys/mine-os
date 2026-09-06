"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CircleDollarSign, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sahifa xatosi:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F4EE] flex flex-col items-center justify-center gap-5 p-8 text-center text-[#13251f]">
      <span className="grid size-14 place-items-center rounded-full bg-[#163e32] text-white">
        <CircleDollarSign className="size-6" />
      </span>
      <h1 className="text-2xl font-bold">Nimadir noto&apos;g&apos;ri ketdi</h1>
      <p className="max-w-sm text-sm text-[#6B7A74]">
        Sahifani yuklashda xatolik yuz berdi. Qayta urinib ko&apos;ring yoki bosh sahifaga qayting.
      </p>
      {error.digest && <p className="text-[11px] text-[#9aa39f]">Kod: {error.digest}</p>}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-[#163e32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e3026]"
        >
          <RotateCcw className="size-4" /> Qayta urinish
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-xl border border-[#E2E4DF] bg-white px-5 py-2.5 text-sm font-semibold hover:bg-[#f5f4ee]"
        >
          Bosh sahifa
        </Link>
      </div>
    </div>
  );
}
