"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase-server";

async function siteOrigin() {
  // Parolni tiklash xatidagi havola so'rov sarlavhasidan emas, sozlangan manzildan olinadi (host header soxtalashtirilmasin).
  const fixed = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_ENV === "production" ? "https://ai-finance-tutor.vercel.app" : null);
  if (fixed) return fixed.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Parolni tiklash xati. Xavfsizlik uchun email mavjud-yo'qligini oshkor qilmaydi. */
export async function sendPasswordReset(email: string): Promise<ActionResult> {
  const clean = email.trim().toLowerCase();
  if (!clean.includes("@")) return { ok: false, error: "Enter a valid email address." };

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(clean, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) {
    console.error("resetPasswordForEmail:", error.message);
    if (error.message.toLowerCase().includes("rate limit")) {
      return { ok: false, error: "Too many attempts. Try again in a few minutes." };
    }
  }
  return { ok: true };
}
