"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) return setError("To'g'ri email manzilini kiriting.");
    if (password.length < 8) return setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak.");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        setSuccess(
          "Email manzilingizga tasdiqlash xati yuborildi! Pochtangizni tekshiring."
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      if (msg.includes("Invalid login credentials")) {
        setError("Email yoki parol noto'g'ri.");
      } else if (msg.includes("User already registered")) {
        setError("Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasiga o'ting.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Email manzilingizni tasdiqlang. Pochta qutingizni tekshiring.");
      } else if (msg.includes("Email rate limit exceeded")) {
        setError("Ko'p urinish. Bir oz kuting va qayta urinib ko'ring.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {isSignUp && (
        <Field label="Ism va familiya" icon={UserRound}>
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Ismingiz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
          />
        </Field>
      )}

      <Field label="Email" icon={Mail}>
        <input
          name="email"
          required
          type="email"
          autoComplete="email"
          placeholder="siz@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
      </Field>

      <Field label="Parol" icon={LockKeyhole}>
        <div className="relative">
          <input
            name="password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Kamida 8 ta belgi"
            className="auth-input pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8984] hover:text-[#13251f] transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>

      {isSignUp && (
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#68756f]">
          <span className="flex items-center gap-1.5">
            <Check
              className={`size-3.5 transition-colors ${
                password.length >= 8 ? "text-emerald-600" : "text-[#9aa39f]"
              }`}
            />
            8+ belgi
          </span>
          <span className="flex items-center gap-1.5">
            <Check
              className={`size-3.5 transition-colors ${
                /[0-9]/.test(password) ? "text-emerald-600" : "text-[#9aa39f]"
              }`}
            />
            Kamida 1 raqam
          </span>
        </div>
      )}

      {!isSignUp && (
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-[#68756f] cursor-pointer">
            <input type="checkbox" className="accent-[#163e32]" /> Eslab qolish
          </label>
          <button type="button" className="font-semibold text-[#315d4c] hover:underline">
            Parolni unutdingizmi?
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#163e32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <>
            {isSignUp ? "Hisob yaratish" : "Kirish"}
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      <p className="pt-2 text-center text-xs text-[#738079]">
        {isSignUp ? "Hisobingiz bormi?" : "Hali hisobingiz yo'qmi?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-semibold text-[#315d4c] hover:underline"
        >
          {isSignUp ? "Kirish" : "Ro'yxatdan o'tish"}
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#53645d]">
        <Icon className="size-3.5" />
        {label}
      </span>
      {children}
    </label>
  );
}
