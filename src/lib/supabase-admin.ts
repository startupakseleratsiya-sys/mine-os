import "server-only";
import { createClient as createSupabase, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Faqat serverda: natija/progress yozish uchun service-role mijoz.
 * Foydalanuvchilar bu jadvallarga o'zlari yoza olmaydi (00003 migratsiya) — aks holda testsiz darsni «o'tgan»
 * yoki soxta imtihon natijasi bilan sertifikat olishi mumkin edi. Chaqiruvchi user'ni oldin tekshirishi SHART.
 * Kalit yo'q bo'lsa (lokal dev) — null: chaqiruvchi foydalanuvchi mijoziga qaytadi.
 */
let cached: SupabaseClient | null | undefined;

export function createAdminClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? createSupabase(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  if (!cached) console.warn("SUPABASE_SERVICE_ROLE_KEY yo'q — natijalar foydalanuvchi mijozi orqali yoziladi.");
  return cached;
}
