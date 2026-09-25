"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export type ProfileResult = { ok: true } | { ok: false; error: string };

/**
 * Ismni yangilash. Foydalanuvchi sessiyadan olinadi — clientdan id qabul qilinmaydi.
 * Xato throw qilinmaydi (prod'da server action xatolari yashiriladi) — natija obyekt qaytadi.
 */
export async function updateUserProfile(fullName: string): Promise<ProfileResult> {
  const trimmed = fullName.trim();
  if (trimmed.length < 2 || trimmed.length > 60) {
    return { ok: false, error: "Your name must contain 2–60 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  // auth metadata'da ham saqlaymiz — profil jadvali bo'lmasa ham ism ko'rinadi.
  const { error: metaError } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
  if (metaError) return { ok: false, error: metaError.message };

  // Profil qatori bo'lmasa (trigger ishlamagan bo'lsa) yaratib qo'yamiz.
  const { error } = await supabase
    .from("users")
    .upsert({ id: user.id, full_name: trimmed }, { onConflict: "id" });
  if (error) {
    console.error("users upsert:", error.message);
    return {
      ok: false,
      error:
        error.code === "PGRST205"
          ? "Your name was saved, but the profile table has not been created yet."
          : error.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { ok: true };
}
