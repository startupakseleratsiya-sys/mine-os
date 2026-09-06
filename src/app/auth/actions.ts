"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase-server";

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Parolni tiklash xati. Xavfsizlik uchun email mavjud-yo'qligini oshkor qilmaydi. */
export async function sendPasswordReset(email: string): Promise<ActionResult> {
  const clean = email.trim().toLowerCase();
  if (!clean.includes("@")) return { ok: false, error: "To'g'ri email manzilini kiriting." };

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(clean, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) {
    console.error("resetPasswordForEmail:", error.message);
    if (error.message.toLowerCase().includes("rate limit")) {
      return { ok: false, error: "Ko'p urinish. Bir necha daqiqadan so'ng qayta urinib ko'ring." };
    }
  }
  return { ok: true };
}
