"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { getChapter } from "@/content/courses";

export type ProgressResult = { ok: true } | { ok: false; error: string };

/** Bobni tugatilgan/tugatilmagan deb belgilash. Foydalanuvchi sessiyadan olinadi (clientdan id kelmaydi). */
export async function setLessonComplete(
  courseSlug: string,
  chapterId: string,
  completed: boolean
): Promise<ProgressResult> {
  if (!getChapter(courseSlug, chapterId)) {
    return { ok: false, error: "Bunday bob topilmadi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Kirish talab qilinadi." };

  const query = completed
    ? supabase.from("lesson_progress").upsert(
        { user_id: user.id, course_slug: courseSlug, chapter_id: chapterId, completed_at: new Date().toISOString() },
        { onConflict: "user_id,course_slug,chapter_id" }
      )
    : supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("course_slug", courseSlug)
        .eq("chapter_id", chapterId);

  const { error } = await query;
  if (error) {
    console.error("lesson_progress yozishda xato:", error.message);
    return {
      ok: false,
      error:
        error.code === "PGRST205"
          ? "Baza hali sozlanmagan (lesson_progress jadvali yo'q)."
          : "Saqlab bo'lmadi. Qayta urinib ko'ring.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath(`/study/${courseSlug}/${chapterId}`);
  return { ok: true };
}
