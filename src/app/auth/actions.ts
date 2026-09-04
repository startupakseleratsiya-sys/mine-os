"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/auth?error=Siz_kiritgan_parol_yoki_email_xato");
  }

  return redirect("/onboarding");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect(`/auth?error=${error.message}`);
  }

  // Muvaffaqiyatli ro'yxatdan o'tgach
  return redirect("/onboarding");
}
