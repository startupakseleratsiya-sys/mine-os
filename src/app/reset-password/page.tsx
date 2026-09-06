"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { AuthShell } from "@/features/auth/components/auth-shell";

/**
 * Parolni tiklash havolasi /auth/callback orqali shu yerga keladi (recovery sessiya bilan).
 * Sessiya bo'lmasa — havola eskirgan.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "no-session">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setStatus(data.user ? "ready" : "no-session");
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) return setError("Parol kamida 8 ta belgidan iborat bo'lsin.");
    if (password !== confirm) return setError("Parollar mos kelmadi.");
    setError("");
    setSaving(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setError(
        msg.includes("same password")
          ? "Yangi parol eskisidan farq qilishi kerak."
          : msg
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthShell title="Yangi parol o'rnating." description="Xavfsizlik uchun kamida 8 ta belgi, ichida raqam bo'lsin.">
      {status === "checking" && (
        <div className="mt-10 flex justify-center">
          <LoaderCircle className="size-6 animate-spin text-[#163e32]" />
        </div>
      )}

      {status === "no-session" && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Havola eskirgan yoki allaqachon ishlatilgan.{" "}
          <Link href="/sign-in" className="font-semibold underline">
            Kirish sahifasiga
          </Link>{" "}
          qaytib, &quot;Parolni unutdingizmi?&quot; orqali yangi havola oling.
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#53645d]">
              <LockKeyhole className="size-3.5" /> Yangi parol
            </span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="auth-input pr-12"
                placeholder="Kamida 8 ta belgi"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Parolni yashirish" : "Parolni ko'rsatish"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8984] hover:text-[#13251f]"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#53645d]">
              <Check className="size-3.5" /> Parolni takrorlang
            </span>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              className="auth-input"
              placeholder="Yana bir marta"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </p>
          )}
          {done && (
            <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              Parol yangilandi. Kabinetga o&apos;tilmoqda...
            </p>
          )}

          <button
            type="submit"
            disabled={saving || done}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#163e32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <LoaderCircle className="size-4 animate-spin" /> : "Parolni saqlash"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
