"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
import { sendPasswordReset } from "@/app/auth/actions";

function friendlyAuthError(msg: string) {
  if (msg.includes("Invalid login credentials")) return "Email yoki parol noto'g'ri.";
  if (msg.includes("User already registered") || msg.includes("already been registered"))
    return "Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasiga o'ting.";
  if (msg.includes("Email not confirmed")) return "Email manzilingizni tasdiqlang. Pochta qutingizni tekshiring.";
  if (msg.toLowerCase().includes("rate limit")) return "Ko'p urinish. Bir oz kuting va qayta urinib ko'ring.";
  if (msg.includes("Password should be")) return "Parol kamida 8 ta belgidan iborat bo'lishi kerak.";
  if (msg.includes("Failed to fetch")) return "Server bilan aloqa yo'q. Internetni tekshiring.";
  return msg;
}

export function AuthForm({
  mode,
  next,
  notice,
}: {
  mode: "sign-in" | "sign-up";
  /** Kirishdan keyin qaytiladigan ichki yo'l (?next=) */
  next?: string;
  /** Sahifa yuklanganda ko'rsatiladigan xabar (?error=) */
  notice?: string;
}) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();

  const [view, setView] = useState<"form" | "forgot">("form");
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
    if (isSignUp && name.trim().length < 2) return setError("Ismingizni kiriting.");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          // Email tasdiqlash o'chirilgan — darhol kirgan.
          router.push("/onboarding");
          router.refresh();
          return;
        }
        // Supabase mavjud emailga ham "muvaffaqiyat" qaytaradi (identities bo'sh bo'ladi).
        if (data.user && data.user.identities?.length === 0) {
          setError("Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasiga o'ting.");
          return;
        }
        setSuccess("Email manzilingizga tasdiqlash xati yuborildi! Pochtangizni tekshiring.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        router.push(next ?? "/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Xatolik yuz berdi"));
    } finally {
      setLoading(false);
    }
  }

  async function submitForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const result = await sendPasswordReset(email);
    setLoading(false);
    if (!result.ok) return setError(result.error);
    setSuccess("Agar bu email ro'yxatda bo'lsa, parolni tiklash havolasi yuborildi. Pochtangizni tekshiring.");
  }

  if (view === "forgot") {
    return (
      <form onSubmit={submitForgot} className="mt-8 space-y-4">
        <p className="text-sm text-[#65736d]">
          Email manzilingizni kiriting — parolni yangilash havolasini yuboramiz.
        </p>
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

        {error && <Alert kind="error">{error}</Alert>}
        {success && <Alert kind="ok">{success}</Alert>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#163e32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : "Havola yuborish"}
        </button>
        <button
          type="button"
          onClick={() => {
            setView("form");
            setError("");
            setSuccess("");
          }}
          className="flex w-full items-center justify-center gap-1.5 pt-2 text-xs font-semibold text-[#315d4c] hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Kirishga qaytish
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {notice && !error && !success && <Alert kind="info">{notice}</Alert>}

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
            <Check className={`size-3.5 transition-colors ${password.length >= 8 ? "text-emerald-600" : "text-[#9aa39f]"}`} />
            8+ belgi
          </span>
          <span className="flex items-center gap-1.5">
            <Check className={`size-3.5 transition-colors ${/[0-9]/.test(password) ? "text-emerald-600" : "text-[#9aa39f]"}`} />
            Kamida 1 raqam
          </span>
        </div>
      )}

      {!isSignUp && (
        <div className="flex justify-end text-xs">
          <button
            type="button"
            onClick={() => {
              setView("forgot");
              setError("");
              setSuccess("");
            }}
            className="font-semibold text-[#315d4c] hover:underline"
          >
            Parolni unutdingizmi?
          </button>
        </div>
      )}

      {error && <Alert kind="error">{error}</Alert>}
      {success && <Alert kind="ok">{success}</Alert>}

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
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-[#315d4c] hover:underline">
          {isSignUp ? "Kirish" : "Ro'yxatdan o'tish"}
        </Link>
      </p>
    </form>
  );
}

function Alert({ kind, children }: { kind: "error" | "ok" | "info"; children: React.ReactNode }) {
  const styles =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : kind === "ok"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-800";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-xs ${styles}`}>
      {children}
    </p>
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
