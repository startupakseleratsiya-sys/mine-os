"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

export type Profile = {
  id: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Qaysi userId uchun so'rov tugagani — loading shundan hisoblanadi
  // (effekt ichida sinxron setState qilinmaydi: react-hooks/set-state-in-effect).
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const loading = Boolean(userId) && loadedFor !== userId;

  useEffect(() => {
    let mounted = true;
    if (!userId) return;

    const supabase = createClient();
    supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error: err }) => {
        if (!mounted) return;
        if (err) {
          console.error("Error fetching profile:", err);
          setError(err.message);
        } else {
          setProfile(data as Profile);
        }
        setLoadedFor(userId);
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  const refresh = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (err) {
      console.error("Error refreshing profile:", err);
    } else {
      setProfile(data as Profile);
    }
  };

  return { profile, loading, error, refresh };
}
