import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * Analitika hodisasi (KPI: dars ochilishi, test boshlanishi/tugashi, media tinglanishi).
 * Hech qachon foydalanuvchi oqimini to'xtatmaydi: jadval hali yo'q bo'lsa (00004 qo'llanmagan) yoki kalit
 * bo'lmasa — jimgina o'tkazib yuboriladi (xato bir marta log qilinadi).
 */
export type EventName = "lesson_opened" | "test_started" | "test_finished" | "media_played";

let warned = false;

export async function track(name: EventName, userId: string | null, props: Record<string, string | number | boolean | null> = {}) {
  const db = createAdminClient();
  if (!db) return;
  try {
    const { error } = await db.from("events").insert({ name, user_id: userId, props });
    if (error && !warned) {
      warned = true;
      console.warn(`events yozilmadi (${error.code ?? ""}): ${error.message} — 00004 qo'llanganmi?`);
    }
  } catch {
    /* tarmoq xatosi — analitika uchun foydalanuvchini to'xtatmaymiz */
  }
}
