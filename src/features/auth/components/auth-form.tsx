"use client";

import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    if (!email.includes("@")) return setError("To‘g‘ri email manzilini kiriting.");
    if (password.length < 8) return setError("Parol kamida 8 ta belgidan iborat bo‘lishi kerak.");
    setError(""); setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    sessionStorage.setItem("finora_demo_user", JSON.stringify({ email, name: String(form.get("name") || email.split("@")[0]) }));
    router.push("/dashboard");
  }

  return <form onSubmit={submit} className="mt-8 space-y-4">
    {isSignUp && <Field label="Ism va familiya" icon={UserRound}><input name="name" required autoComplete="name" placeholder="Ismingiz" className="auth-input" /></Field>}
    <Field label="Email" icon={Mail}><input name="email" required type="email" autoComplete="email" placeholder="siz@example.com" className="auth-input" /></Field>
    <Field label="Parol" icon={LockKeyhole}><div className="relative"><input name="password" required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} placeholder="Kamida 8 ta belgi" className="auth-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8984]">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></Field>
    {isSignUp && <div className="grid grid-cols-2 gap-2 text-[11px] text-[#68756f]"><span className="flex items-center gap-1.5"><Check className={`size-3.5 ${password.length >= 8 ? "text-emerald-600" : "text-[#9aa39f]"}`} /> 8+ belgi</span><span className="flex items-center gap-1.5"><Check className={`size-3.5 ${/[0-9]/.test(password) ? "text-emerald-600" : "text-[#9aa39f]"}`} /> Kamida 1 raqam</span></div>}
    {!isSignUp && <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-[#68756f]"><input type="checkbox" className="accent-[#163e32]" /> Eslab qolish</label><button type="button" className="font-semibold text-[#315d4c]">Parolni unutdingizmi?</button></div>}
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
    <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#163e32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e3026] disabled:opacity-60">{loading ? <LoaderCircle className="size-4 animate-spin" /> : <>{isSignUp ? "Hisob yaratish" : "Kirish"}<ArrowRight className="size-4" /></>}</button>
    <p className="pt-2 text-center text-xs text-[#738079]">{isSignUp ? "Hisobingiz bormi?" : "Hali hisobingiz yo‘qmi?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-[#315d4c]">{isSignUp ? "Kirish" : "Ro‘yxatdan o‘tish"}</Link></p>
  </form>;
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof Mail; children: React.ReactNode }) { return <label className="block"><span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#53645d]"><Icon className="size-3.5" />{label}</span>{children}</label>; }
