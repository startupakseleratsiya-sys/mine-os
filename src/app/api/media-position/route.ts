import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { track } from "@/lib/events";

/**
 * Dars pleyerining o'rnini saqlash (boshqa qurilmada ham «shu joydan davom»).
 * Oddiy fetch va navigator.sendBeacon (sahifa yopilayotganda) ikkalasi ham shu yerga keladi — cookie bilan.
 * clear: dars oxirigacha ko'rildi → o'rin o'chiriladi (keyingi safar boshidan).
 */
const Body = z.object({
  lessonId: z.string().min(1).max(80),
  kind: z.enum(["video", "audio"]),
  part: z.number().int().min(0).max(99).optional(),
  offset: z.number().min(0).max(3599).optional(),
  clear: z.boolean().optional(),
  played: z.boolean().optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.safeParse(JSON.parse(await req.text()));
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { lessonId, kind, part, offset, clear, played } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const db = createAdminClient();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });

  if (played) await track("media_played", user.id, { lesson: lessonId, kind });

  const res = clear
    ? await db.from("media_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId).eq("kind", kind)
    : part !== undefined && offset !== undefined
      ? await db.from("media_progress").upsert({ user_id: user.id, lesson_id: lessonId, kind, part, offset_sec: offset, updated_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id,kind" })
      : null;
  if (res?.error) {
    // 00004 hali qo'llanmagan bo'lsa — brauzerdagi nusxa baribir ishlaydi.
    console.warn("media_progress:", res.error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
