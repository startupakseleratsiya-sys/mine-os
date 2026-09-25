"use client";
import { useI18n } from "@/i18n/provider";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound, } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { sendPasswordReset } from "@/app/auth/actions";
function friendlyAuthError(msg: string) {
    if (msg.includes("Invalid login credentials"))
        return "Incorrect email or password.";
    if (msg.includes("User already registered") || msg.includes("already been registered"))
        return "This email is already registered. Please sign in.";
    if (msg.includes("Email not confirmed"))
        return "Confirm your email address. Check your inbox.";
    if (msg.toLowerCase().includes("rate limit"))
        return "Too many attempts. Wait a moment and try again.";
    if (msg.includes("Password should be"))
        return "Your password must contain at least 8 characters.";
    if (msg.includes("Failed to fetch"))
        return "Cannot reach the server. Check your internet connection.";
    return msg;
}
export function AuthForm({ mode, next, notice, }: {
    mode: "sign-in" | "sign-up";
    /** Kirishdan keyin qaytiladigan ichki yo'l (?next=) */
    next?: string;
    /** Sahifa yuklanganda ko'rsatiladigan xabar (?error=) */
    notice?: string;
}) {
    const { t } = useI18n();
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
        if (!email.includes("@"))
            return setError("Enter a valid email address.");
        if (password.length < 8)
            return setError("Your password must contain at least 8 characters.");
        if (isSignUp && name.trim().length < 2)
            return setError("Enter your name.");
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
                if (signUpError)
                    throw signUpError;
                if (data.session) {
                    // Email tasdiqlash o'chirilgan — darhol kirgan.
                    router.push("/onboarding");
                    router.refresh();
                    return;
                }
                // Supabase mavjud emailga ham "muvaffaqiyat" qaytaradi (identities bo'sh bo'ladi).
                if (data.user && data.user.identities?.length === 0) {
                    setError("This email is already registered. Please sign in.");
                    return;
                }
                setSuccess("A confirmation email has been sent. Check your inbox.");
            }
            else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });
                if (signInError)
                    throw signInError;
                router.push(next ?? "/dashboard");
                router.refresh();
            }
        }
        catch (err: unknown) {
            setError(friendlyAuthError(err instanceof Error ? err.message : "An error occurred"));
        }
        finally {
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
        if (!result.ok)
            return setError(result.error);
        setSuccess("If this email is registered, a password reset link has been sent. Check your inbox.");
    }
    if (view === "forgot") {
        return (<form onSubmit={submitForgot} className="mt-8 space-y-4">
        <p className="text-sm text-[#65736d]"><>{t("Enter your email and we will send a password reset link.")}</></p>
        <Field label={t("Email")} icon={Mail}>
          <input name="email" required type="email" autoComplete="email" placeholder={t("you@example.com")} value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input"/>
        </Field>

        {error && <Alert kind="error">{t(error)}</Alert>}
        {success && <Alert kind="ok">{t(success)}</Alert>}

        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#163e32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? <LoaderCircle className="size-4 animate-spin"/> : t("Send link")}
        </button>
        <button type="button" onClick={() => {
                setView("form");
                setError("");
                setSuccess("");
            }} className="flex w-full items-center justify-center gap-1.5 pt-2 text-xs font-semibold text-[#315d4c] hover:underline">
          <ArrowLeft className="size-3.5"/><>{t("Back to sign in")}</></button>
      </form>);
    }
    return (<form onSubmit={submit} className="mt-8 space-y-4">
      {notice && !error && !success && <Alert kind="info">{t(notice)}</Alert>}

      {isSignUp && (<Field label={t("Full name")} icon={UserRound}>
          <input name="name" required autoComplete="name" placeholder={t("Your name")} value={name} onChange={(e) => setName(e.target.value)} className="auth-input"/>
        </Field>)}

      <Field label={t("Email")} icon={Mail}>
        <input name="email" required type="email" autoComplete="email" placeholder={t("you@example.com")} value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input"/>
      </Field>

      <Field label={t("Password")} icon={LockKeyhole}>
        <div className="relative">
          <input name="password" required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} placeholder={t("At least 8 characters")} className="auth-input pr-12"/>
          <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? t("Hide password") : t("Show password")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e8984] hover:text-[#13251f] transition-colors">
            {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
          </button>
        </div>
      </Field>

      {isSignUp && (<div className="grid grid-cols-2 gap-2 text-[11px] text-[#68756f]">
          <span className="flex items-center gap-1.5">
            <Check className={`size-3.5 transition-colors ${password.length >= 8 ? "text-emerald-600" : "text-[#9aa39f]"}`}/><>{t("8+ characters")}</></span>
          <span className="flex items-center gap-1.5">
            <Check className={`size-3.5 transition-colors ${/[0-9]/.test(password) ? "text-emerald-600" : "text-[#9aa39f]"}`}/><>{t("At least 1 number")}</></span>
        </div>)}

      {!isSignUp && (<div className="flex justify-end text-xs">
          <button type="button" onClick={() => {
                setView("forgot");
                setError("");
                setSuccess("");
            }} className="font-semibold text-[#315d4c] hover:underline"><>{t("Forgot password?")}</></button>
        </div>)}

      {error && <Alert kind="error">{t(error)}</Alert>}
      {success && <Alert kind="ok">{t(success)}</Alert>}

      <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#163e32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? (<LoaderCircle className="size-4 animate-spin"/>) : (<>
            {isSignUp ? t("Create account") : t("Sign in")}
            <ArrowRight className="size-4"/>
          </>)}
      </button>

      <p className="pt-2 text-center text-xs text-[#738079]">
        {isSignUp ? t("Already have an account?") : t("Do not have an account yet?")}{" "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-[#315d4c] hover:underline">
          {isSignUp ? t("Sign in") : t("Sign up")}
        </Link>
      </p>
    </form>);
}
function Alert({ kind, children }: {
    kind: "error" | "ok" | "info";
    children: React.ReactNode;
}) {
    const styles = kind === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : kind === "ok"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-800";
    return (<p role={kind === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-xs ${styles}`}>
      {children}
    </p>);
}
function Field({ label, icon: Icon, children, }: {
    label: string;
    icon: typeof Mail;
    children: React.ReactNode;
}) {
    const { t } = useI18n();
    return (<label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#53645d]">
        <Icon className="size-3.5"/>
        {t(label)}
      </span>
      {children}
    </label>);
}
