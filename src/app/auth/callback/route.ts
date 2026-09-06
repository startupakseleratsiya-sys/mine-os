import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-server";

/**
 * Email havolalari (tasdiqlash, parolni tiklash) shu yerga qaytadi.
 * Ikkala formatni qo'llab-quvvatlaydi:
 *  - PKCE: ?code=...            (standart email shablonlari)
 *  - Token hash: ?token_hash=...&type=recovery|signup|email
 * Muvaffaqiyatda `next` ga (faqat ichki yo'l), aks holda /sign-in?error=... ga yo'naltiradi.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("auth callback (code):", error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("auth callback (token_hash):", error.message);
  }

  return NextResponse.redirect(`${origin}/sign-in?error=link`);
}
