"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function updateUserProfile(userId: string, fullName: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ full_name: fullName })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}
