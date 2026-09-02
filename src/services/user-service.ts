import { createClient } from "@/lib/supabase-server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

export async function getUserProgress(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_progress")
    .select("*, courses(*)")
    .eq("user_id", userId)
    .order("last_accessed", { ascending: false });
  return data ?? [];
}
