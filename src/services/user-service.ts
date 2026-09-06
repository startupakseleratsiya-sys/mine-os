import { createClient } from "@/lib/supabase-server";

export type Profile = {
  id: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
};

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Profil qatori. Yo'q bo'lsa (yoki baza sozlanmagan bo'lsa) null — sahifa yiqilmaydi. */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, role, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("Profil o'qishda xato:", error.message);
    return null;
  }
  return data as Profile | null;
}

/** Foydalanuvchining AI suhbatlari soni. */
export async function getChatSessionCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("chat_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) return 0;
  return count ?? 0;
}
