"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  CircleDollarSign,
  Edit3,
  LoaderCircle,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useProfile } from "@/hooks/use-profile";
import { updateUserProfile, signOut } from "@/app/actions/auth";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, refresh } = useProfile(user?.id);

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isLoading = userLoading || profileLoading;

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "Foydalanuvchi";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function startEditing() {
    setNameInput(profile?.full_name ?? "");
    setEditing(true);
    setSaved(false);
    setError("");
  }

  function cancelEditing() {
    setEditing(false);
    setError("");
  }

  async function handleSave() {
    if (!user?.id) return;
    const trimmed = nameInput.trim();
    if (!trimmed) return setError("Ism bo'sh bo'lishi mumkin emas.");
    if (trimmed.length < 2) return setError("Ism kamida 2 ta belgidan iborat bo'lsin.");

    setSaving(true);
    setError("");
    try {
      await updateUserProfile(user.id, trimmed);
      await refresh();
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f1eb] flex items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[#163e32]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f3f1eb] flex flex-col items-center justify-center gap-4">
        <p className="text-[#65736d]">Kirish talab qilinadi.</p>
        <Link href="/sign-in" className="text-sm font-semibold text-[#163e32] underline">
          Kirish sahifasiga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f1eb] text-[#13251f]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#13251f]/10 bg-[#f8f7f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[800px] items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
              <CircleDollarSign className="size-4" />
            </span>
            <span className="font-semibold tracking-tight hidden sm:block">finora</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#13251f]/12 bg-white px-4 py-2 text-xs font-semibold hover:bg-[#f5f4ee] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#527264] mb-3">
            Hisob sozlamalari
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mening profilim</h1>
        </div>

        <div className="space-y-5">
          {/* Avatar + name card */}
          <div className="bg-white rounded-3xl border border-[#E2E4DF] p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="size-24 rounded-full bg-[#163e32] grid place-items-center text-white text-3xl font-bold shadow-xl shadow-[#163e32]/20">
                  {initials}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-white border-2 border-[#163e32] text-[#163e32] hover:bg-[#163e32] hover:text-white transition-colors"
                  aria-label="Avatar o'zgartirish"
                >
                  <Camera className="size-3.5" />
                </button>
              </div>

              {/* Name + role */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full max-w-sm">
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void handleSave();
                          if (e.key === "Escape") cancelEditing();
                        }}
                        className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-[#163e32] outline-none py-1"
                        placeholder="Ismingiz"
                        maxLength={60}
                      />
                      <button
                        onClick={() => void handleSave()}
                        disabled={saving}
                        className="grid size-9 place-items-center rounded-full bg-[#163e32] text-white hover:bg-[#0e3026] disabled:opacity-50 transition-colors"
                        aria-label="Saqlash"
                      >
                        {saving ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <Save className="size-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="grid size-9 place-items-center rounded-full border border-[#E2E4DF] hover:bg-[#f5f4ee] transition-colors"
                        aria-label="Bekor qilish"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#0f2017]">{displayName}</h2>
                      <button
                        onClick={startEditing}
                        className="grid size-8 place-items-center rounded-lg text-[#65736d] hover:bg-[#f5f4ee] hover:text-[#0f2017] transition-colors"
                        aria-label="Ismni tahrirlash"
                      >
                        <Edit3 className="size-4" />
                      </button>
                    </>
                  )}
                </div>

                <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-[#dce7dd] text-[#2a5e47] uppercase tracking-wider">
                  {profile?.role === "admin" ? "Admin" : "O'quvchi"}
                </span>

                {error && (
                  <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                {saved && (
                  <p className="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <Check className="size-3.5" />
                    Profil saqlandi!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="bg-white rounded-3xl border border-[#E2E4DF] p-7">
            <h3 className="text-sm font-bold text-[#0f2017] mb-5 flex items-center gap-2">
              <User className="size-4 text-[#65736d]" />
              Hisob ma'lumotlari
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#f5f4ee]">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-[#65736d]" />
                  <div>
                    <p className="text-xs text-[#65736d] font-medium mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-[#0f2017]">{user.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                  Tasdiqlangan
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#f5f4ee]">
                <div>
                  <p className="text-xs text-[#65736d] font-medium mb-0.5">Ro'yxatdan o'tgan sana</p>
                  <p className="text-sm font-semibold text-[#0f2017]">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-xs text-[#65736d] font-medium mb-0.5">Hisob turi</p>
                  <p className="text-sm font-semibold text-[#0f2017]">
                    {profile?.role === "admin" ? "Administrator" : "Standart foydalanuvchi"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-3xl border border-[#E2E4DF] p-7">
            <h3 className="text-sm font-bold text-[#0f2017] mb-5 flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#65736d]" />
              Xavfsizlik
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0f2017] mb-0.5">Parol</p>
                <p className="text-xs text-[#65736d]">Parolni o'zgartirish uchun emailga havola yuboriladi</p>
              </div>
              <button className="text-xs font-semibold text-[#163e32] hover:underline">
                O'zgartirish
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-3xl border border-red-100 p-7">
            <h3 className="text-sm font-bold text-red-700 mb-5 flex items-center gap-2">
              <LogOut className="size-4" />
              Hisobdan chiqish
            </h3>
            <form action={signOut}>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Tizimdan chiqish
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
