"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#163e32] px-6 font-semibold text-white print:hidden">
      <Printer className="size-4" />Print or save as PDF
    </button>
  );
}
