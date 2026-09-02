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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  const refresh = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  return { profile, loading, error, refresh };
}
