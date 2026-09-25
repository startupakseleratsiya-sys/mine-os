"use client";

/**
 * Test uchun yengil «o'yin effektlari»: qisqa WebAudio signal va bir martalik pop animatsiya.
 * Kutubxonasiz, cheksiz animatsiyasiz; prefers-reduced-motion'da animatsiya o'chadi.
 */

const MUTE_KEY = "finora-sound-muted";

export function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeMuted(muted: boolean) {
  try {
    if (muted) localStorage.setItem(MUTE_KEY, "1");
    else localStorage.removeItem(MUTE_KEY);
  } catch {
    /* saqlab bo'lmasa — faqat shu sahifada amal qiladi */
  }
}

let ctx: AudioContext | null = null;

/** Foydalanuvchi bosganida chaqiriladi — brauzer ovozni faqat shu paytda ochishga ruxsat beradi. */
export function unlockAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    ctx = null;
  }
}

/** To'g'ri — ikki ko'tariluvchi yumshoq nota; noto'g'ri — bitta past, qisqa nota. */
export function playTone(correct: boolean) {
  if (!ctx) return;
  try {
    const notes = correct ? [660, 880] : [220];
    const t0 = ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      const start = t0 + i * 0.09;
      const len = correct ? 0.12 : 0.18;
      osc.type = correct ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + len);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(start);
      osc.stop(start + len + 0.02);
    });
  } catch {
    /* ovoz ixtiyoriy */
  }
}

function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

/** Ref callback: element paydo bo'lganda bir marta «pop» qiladi (Web Animations API, CSS kerak emas). */
export function popIn(delay = 0) {
  return (el: HTMLElement | null) => {
    if (!el || reducedMotion() || typeof el.animate !== "function") return;
    el.animate(
      [
        { transform: "scale(0.3)", opacity: 0 },
        { transform: "scale(1.25)", opacity: 1, offset: 0.6 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 420, delay, easing: "cubic-bezier(.2,.8,.3,1.2)", fill: "backwards" },
    );
  };
}

/** Ref callback: «+10 XP» pastdan sakrab chiqib, joyiga o'tiradi. */
export function floatUp(el: HTMLElement | null) {
  // Kamroq harakat rejimida — oddiy, qimirlamaydigan belgi bo'lib qoladi.
  if (!el || reducedMotion() || typeof el.animate !== "function") return;
  el.animate(
    [
      { transform: "translateY(10px)", opacity: 0 },
      { transform: "translateY(-8px)", opacity: 1, offset: 0.45 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 650, easing: "ease-out", fill: "backwards" },
  );
}
