"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Brauzerning o'z ovozi (Web Speech API) bilan o'qib berish — pulsiz, API kalitsiz.
 * Chrome uzun matnni ~15 soniyada uzib qo'yadi, shuning uchun matn gaplarga bo'linib navbat bilan aytiladi.
 * Eng tabiiy inglizcha ovoz tanlanadi (Edge «Natural», Google, Samantha…).
 */

export function splitSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?:;])\s+(?=[A-Z0-9“"(])/)
    .flatMap((s) => (s.length > 220 ? s.split(/(?<=,)\s+/) : [s]))
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Markdown belgilarini olib tashlab, ovoz uchun toza matn. */
export function plainForSpeech(md: string) {
  return md
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/[*_#>`]/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/§/g, "section ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online/i.test(v.name) ? 100 : 0) +
    (/aria|jenny|guy|sonia|libby|ryan|emma|brian|ava|andrew/i.test(v.name) ? 30 : 0) +
    (/google/i.test(v.name) ? 20 : 0) +
    (/samantha|daniel|karen|moira/i.test(v.name) ? 15 : 0) +
    (/en[-_](GB|US)/i.test(v.lang) ? 5 : 0);
  return en.sort((a, b) => score(b) - score(a))[0] ?? null;
}

export function useNarrator() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const tokenRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices());
      setSupported(true);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  /** Gaplarni ketma-ket aytadi; har gap boshida onSentence(i), oxirida onDone(). */
  const speak = useCallback(
    (sentences: string[], opts: { rate?: number; start?: number; onSentence?: (i: number) => void; onDone?: () => void } = {}) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const token = ++tokenRef.current;
      setSpeaking(true);
      const say = (i: number) => {
        if (token !== tokenRef.current) return;
        if (i >= sentences.length) {
          setSpeaking(false);
          opts.onDone?.();
          return;
        }
        const u = new SpeechSynthesisUtterance(sentences[i]);
        if (voiceRef.current) u.voice = voiceRef.current;
        u.lang = voiceRef.current?.lang ?? "en-GB";
        u.rate = opts.rate ?? 1;
        u.onstart = () => token === tokenRef.current && opts.onSentence?.(i);
        u.onend = () => say(i + 1);
        u.onerror = (e) => {
          // «interrupted/canceled» — biz to'xtatdik; boshqa xatoda keyingi gapga o'tamiz.
          if (e.error === "interrupted" || e.error === "canceled") return;
          say(i + 1);
        };
        window.speechSynthesis.speak(u);
      };
      say(opts.start ?? 0);
    },
    [],
  );

  return { supported, speaking, speak, stop, voiceName: () => voiceRef.current?.name ?? null };
}
