import "server-only";
import { createClient } from "@/lib/supabase-server";
import type { SavedPos } from "@/features/lesson/use-playlist";

/** Foydalanuvchining shu darsdagi pleyer o'rni (video va audio). Jadval yo'q/xato bo'lsa — bo'sh (brauzer nusxasi ishlaydi). */
export async function getMediaPositions(userId: string, lessonId: string): Promise<{ video: SavedPos | null; audio: SavedPos | null }> {
  const empty = { video: null, audio: null };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("media_progress").select("kind, part, offset_sec, updated_at").eq("user_id", userId).eq("lesson_id", lessonId);
    if (error || !data) return empty;
    const pick = (kind: string) => {
      const r = (data as { kind: string; part: number; offset_sec: number; updated_at: string }[]).find((x) => x.kind === kind);
      return r ? { i: r.part, off: r.offset_sec, at: Date.parse(r.updated_at) } : null;
    };
    return { video: pick("video"), audio: pick("audio") };
  } catch {
    return empty;
  }
}
