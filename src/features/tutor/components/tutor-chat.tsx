"use client";

import React, { useRef, useEffect, useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  CircleDollarSign,
  GraduationCap,
  MessageSquareText,
  Plus,
  ShieldCheck,
  UserRound,
  Mic,
  MicOff,
  Square,
} from "lucide-react";
import { Markdown } from "@/lib/markdown";
import { AvatarViewer } from "./avatar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTERS = [
  "Oylik budjetni qanday tuzaman?",
  "Murakkab foizni sodda tushuntir",
  "Kredit olishdan oldin nimani tekshiraman?",
  "Favqulodda jamg'arma qancha bo'lishi kerak?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-[#65736d] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}

/* Web Speech API brauzer tiplari (lib.dom'da yo'q) — faqat ishlatiladigan qismi. */
type SpeechResultLike = ArrayLike<{ transcript: string }> & { isFinal: boolean };
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechResultLike>;
};
type SpeechRecognitionErrorEventLike = { error: string };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export function TutorChat({
  embedded = false,
  context,
}: {
  /** Dars sahifasi yon panelida: sarlavha/avatar yo'q, h-full. */
  embedded?: boolean;
  /** Modelga beriladigan qo'shimcha kontekst (qaysi kurs/bob). */
  context?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // Ovozli kiritish: boshlangandagi matn + yakuniy bo'laklar; interim natija har safar ALMASHTIRILADI
  // (oldingi versiyada interim natijalar qo'shilib ketib matn takrorlanardi).
  const speechBaseRef = useRef("");
  const speechFinalRef = useRef("");

  useEffect(() => {
    const w = window as SpeechRecognitionWindow;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "uz-UZ";

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0]?.transcript ?? "";
        if (res.isFinal) speechFinalRef.current += transcript + " ";
        else interim += transcript;
      }
      const base = speechBaseRef.current;
      const joiner = base && !base.endsWith(" ") ? " " : "";
      setInput(base + joiner + speechFinalRef.current + interim);
    };
    rec.onerror = (event) => {
      if (event.error !== "aborted") console.warn("Speech recognition error:", event.error);
      setIsListening(false);
    };
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    // Effekt ichida sinxron setState — react-hooks/set-state-in-effect; microtask'ga kechiktiramiz.
    const t = setTimeout(() => setSpeechSupported(true), 0);

    return () => {
      clearTimeout(t);
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.stop();
      } catch {
        /* allaqachon to'xtagan */
      }
    };
  }, []);

  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isListening) {
      rec.stop();
      setIsListening(false);
      return;
    }
    speechBaseRef.current = input;
    speechFinalRef.current = "";
    try {
      rec.start();
      setIsListening(true);
    } catch {
      setError("Mikrofonni ishga tushirib bo'lmadi. Brauzer ruxsatini tekshiring.");
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 144) + "px";
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || isLoading) return;

      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }

      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: clean };
      const history = [...messages, userMsg];
      const assistantId = `a-${Date.now() + 1}`;

      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setInput("");
      setError("");
      setIsLoading(true);

      abortRef.current = new AbortController();
      let received = "";

      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            messages: history
              .filter((m) => m.content.trim().length > 0)
              .map((m) => ({ role: m.role, content: m.content }))
              .slice(-20),
            context,
            sessionId: sessionId ?? undefined,
          }),
        });

        if (!response.ok) {
          const errData = (await response.json().catch(() => ({}))) as { error?: string };
          if (response.status === 401) {
            throw new Error("Sessiya tugagan. Qayta kiring.");
          }
          throw new Error(errData.error ?? "Ulanishda xatolik yuz berdi");
        }
        if (!response.body) throw new Error("Bo'sh javob keldi");

        const newSession = response.headers.get("x-session-id");
        if (newSession && !sessionId) setSessionId(newSession);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          received += chunk;
          setMessages((current) =>
            current.map((msg) => (msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg))
          );
        }

        if (!received.trim()) {
          // Stream xatosiz, lekin bo'sh tugadi (masalan, model xatosi onError'ga tushgan).
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          setError("Javob kelmadi. Qayta urinib ko'ring.");
        }
      } catch (caught: unknown) {
        if (caught instanceof Error && caught.name === "AbortError") {
          // Foydalanuvchi to'xtatdi — kelgan qismini qoldiramiz.
          if (!received.trim()) setMessages((prev) => prev.filter((m) => m.id !== assistantId));
          return;
        }
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(caught instanceof Error ? caught.message : "Noma'lum xatolik yuz berdi.");
      } finally {
        setIsLoading(false);
        abortRef.current = null;
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [messages, isLoading, isListening, context, sessionId]
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setSessionId(null);
    setError("");
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className={`flex flex-col bg-[#f3f1eb] text-[#13251f] ${embedded ? "h-full" : "h-dvh"}`}>
      {!embedded && (
        <header className="shrink-0 border-b border-[#13251f]/10 bg-[#f8f7f2]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[900px] items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                aria-label="Dashboardga qaytish"
                className="grid size-9 place-items-center rounded-full border border-[#13251f]/10 bg-white hover:bg-[#f5f4ee] transition-colors"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white">
                  <CircleDollarSign className="size-4" />
                </span>
                <span className="font-semibold tracking-tight">finora</span>
              </Link>
            </div>
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-2 rounded-full border border-[#13251f]/12 bg-white/60 px-4 py-2 text-xs font-semibold hover:bg-white transition-colors"
            >
              <Plus className="size-3.5" />
              Yangi suhbat
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className={`mx-auto max-w-[900px] px-4 sm:px-6 ${embedded ? "py-4" : "py-6"}`}>
          {!embedded && (
            <div className="mb-6 w-full max-w-[360px] mx-auto h-[220px] sm:h-[260px] shadow-lg rounded-3xl overflow-hidden">
              <AvatarViewer isSpeaking={isLoading || isListening} />
            </div>
          )}

          {messages.length === 0 ? (
            <div className={`flex flex-col items-center justify-center text-center ${embedded ? "py-8" : "py-10"}`}>
              <div className="mx-auto grid size-14 place-items-center rounded-full border border-[#285744]/20 bg-[#e7ece6] text-[#285744]">
                <GraduationCap className="size-6" strokeWidth={1.5} />
              </div>
              <h1 className={`mt-5 font-semibold tracking-[-0.04em] ${embedded ? "text-xl" : "text-3xl sm:text-4xl"}`}>
                Bugun nimani tushunib olamiz?
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65736d]">
                Moliyaviy savolingizni oddiy tilda yozing. Men tushunchani misollar va aniq qadamlar bilan tushuntiraman.
              </p>
              <div className={`mx-auto mt-8 grid w-full max-w-2xl gap-3 ${embedded ? "" : "sm:grid-cols-2"}`}>
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => void sendMessage(starter)}
                    disabled={isLoading}
                    className="rounded-2xl border border-[#13251f]/10 bg-white/60 p-4 text-left text-sm font-medium leading-5 transition hover:-translate-y-0.5 hover:border-[#35624f]/30 hover:bg-white disabled:opacity-50"
                  >
                    {starter}
                  </button>
                ))}
              </div>
              {embedded && (
                <button onClick={clearChat} className="mt-6 text-xs font-semibold text-[#65736d] hover:text-[#13251f]">
                  <Plus className="inline size-3 mr-1" />
                  Yangi suhbat
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5 py-4">
              {embedded && (
                <div className="flex justify-end">
                  <button
                    onClick={clearChat}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#13251f]/12 bg-white/60 px-3 py-1.5 text-[11px] font-semibold hover:bg-white"
                  >
                    <Plus className="size-3" /> Yangi suhbat
                  </button>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-[#163e32]/20 bg-[#e7ece6] text-[#163e32]">
                      <MessageSquareText className="size-4" strokeWidth={1.7} />
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-[#dce7dd] text-[#13251f] whitespace-pre-wrap text-sm leading-6"
                        : "rounded-tl-sm border border-[#13251f]/8 bg-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      message.content
                    ) : message.content ? (
                      <Markdown text={message.content} />
                    ) : (
                      <TypingDots />
                    )}
                  </div>
                  {message.role === "user" && (
                    <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-[#13251f]/10 bg-white">
                      <UserRound className="size-4" />
                    </span>
                  )}
                </div>
              ))}
              <div ref={bottomRef} className="h-1" />
            </div>
          )}
        </div>
      </main>

      <div className="shrink-0">
        <div className={`mx-auto max-w-[900px] px-4 pb-4 pt-2 sm:px-6 ${embedded ? "" : "sm:pb-5 sm:pt-3"}`}>
          {error && (
            <div role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-[22px] border border-[#13251f]/12 bg-white p-2 shadow-[0_15px_40px_rgba(30,55,46,0.10)] focus-within:border-[#35624f]/40 transition-colors"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={8000}
              placeholder={isListening ? "Gapiring..." : "Masalan: 50/30/20 qoidasi nima?"}
              className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-[#89948f]"
            />

            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "To'xtatish" : "Ovozli kiritish"}
                aria-pressed={isListening}
                className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors ${
                  isListening
                    ? "bg-red-100 text-red-600 animate-pulse border border-red-200"
                    : "bg-[#f3f1eb] text-[#65736d] hover:bg-[#e7ece6] hover:text-[#13251f]"
                }`}
              >
                {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>
            )}

            {isLoading ? (
              <button
                type="button"
                onClick={stopGeneration}
                aria-label="To'xtatish"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-[#163e32] text-white hover:bg-[#0e3026]"
              >
                <Square className="size-4" fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Xabarni yuborish"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-[#163e32] text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowUp className="size-5" />
              </button>
            )}
          </form>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#7d8883]">
            <ShieldCheck className="size-3" />
            Finora xato qilishi mumkin. Muhim qarorlarni mustaqil tekshiring.
          </p>
        </div>
      </div>
    </div>
  );
}
