"use client";

import React, { useRef, useEffect, useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  CircleDollarSign,
  GraduationCap,
  LoaderCircle,
  MessageSquareText,
  Plus,
  ShieldCheck,
  UserRound,
  Mic,
  MicOff,
} from "lucide-react";

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

/* ── Markdown-lite renderer ── */
function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-6">
      {lines.map((line, i) => {
        if (line.startsWith("### "))
          return <p key={i} className="font-bold text-base mt-2">{line.slice(4)}</p>;
        if (line.startsWith("## "))
          return <p key={i} className="font-bold text-lg mt-2">{line.slice(3)}</p>;
        if (line.startsWith("**") && line.endsWith("**"))
          return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
        if (line.startsWith("- ") || line.startsWith("• "))
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-2 size-1.5 rounded-full bg-current shrink-0" />
              <span>{line.slice(2)}</span>
            </div>
          );
        if (line.match(/^\d+\.\s/))
          return <p key={i} className="pl-1">{line}</p>;
        if (line.trim() === "") return <div key={i} className="h-1" />;
        // Bold inline **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

/* ── Typing dots ── */
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

export function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "uz-UZ";

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
             setInput((prev) => {
               // A bit of logic to append cleanly
               const space = prev.length > 0 && !prev.endsWith(" ") ? " " : "";
               return prev + space + currentTranscript;
             });
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Smooth scroll to bottom after new messages
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Auto-resize textarea
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

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: clean,
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setError("");
      setIsLoading(true);

      const assistantId = `a-${Date.now() + 1}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            messages: nextMessages
              .filter((m) => m.content.trim().length > 0)
              .map((m) => ({ role: m.role, content: m.content }))
              .slice(-20),
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(errData.error ?? "Ulanishda xatolik yuz berdi");
        }

        if (!response.body) throw new Error("Bo'sh javob keldi");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((current) =>
            current.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      } catch (caught: unknown) {
        if (caught instanceof Error && caught.name === "AbortError") return;
        // Remove the empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(
          caught instanceof Error
            ? caught.message
            : "Noma'lum xatolik yuz berdi."
        );
      } finally {
        setIsLoading(false);
        abortRef.current = null;
        // Re-focus input after response
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [messages, isLoading]
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

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const showTypingIndicator =
    isLoading && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex h-screen flex-col bg-[#f3f1eb] text-[#13251f]">
      {/* Header */}
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

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6 py-6">
          {/* Avatar Container */}
          <div className="mb-8 w-full max-w-[400px] mx-auto h-[300px] shadow-lg rounded-3xl overflow-hidden">
             <AvatarViewer isSpeaking={isLoading || isListening} />
          </div>

          {messages.length === 0 ? (
            /* Welcome screen */
            <div className="flex min-h-full flex-col items-center justify-center py-20 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full border border-[#285744]/20 bg-[#e7ece6] text-[#285744]">
                <GraduationCap className="size-7" strokeWidth={1.5} />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Bugun nimani tushunib olamiz?
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65736d]">
                Moliyaviy savolingizni oddiy tilda yozing. Men tushunchani
                misollar va aniq qadamlar bilan tushuntiraman.
              </p>
              <div className="mx-auto mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
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
            </div>
          ) : (
            /* Chat messages */
            <div className="space-y-5 py-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-[#163e32]/20 bg-[#e7ece6] text-[#163e32]">
                      <MessageSquareText className="size-4" strokeWidth={1.7} />
                    </span>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-[#dce7dd] text-[#13251f]"
                        : "rounded-tl-sm border border-[#13251f]/8 bg-white"
                    }`}
                  >
                    {message.content ? (
                      <MessageContent text={message.content} />
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

              {/* Typing indicator — only when waiting for first chunk */}
              {showTypingIndicator && (
                <div className="flex items-start gap-3">
                  <span className="grid size-8 place-items-center rounded-full border border-[#163e32]/20 bg-[#e7ece6] text-[#163e32]">
                    <MessageSquareText className="size-4" strokeWidth={1.7} />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm border border-[#13251f]/8 bg-white px-5 py-4">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-1" />
            </div>
          )}
        </div>
      </main>

      {/* Input bar */}
      <div className="shrink-0">
        <div className="mx-auto max-w-[900px] px-4 pb-5 pt-3 sm:px-6">
          {error && (
            <div
              role="alert"
              className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-3 rounded-[22px] border border-[#13251f]/12 bg-white p-2.5 shadow-[0_15px_40px_rgba(30,55,46,0.10)] focus-within:border-[#35624f]/40 transition-colors"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={8000}
              placeholder="Masalan: 50/30/20 qoidasi nima?"
              className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-[#89948f]"
            />
            
            <button
              type="button"
              onClick={toggleListening}
              title="Ovozli kiritish"
              className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors ${
                isListening 
                  ? "bg-red-100 text-red-600 animate-pulse border border-red-200" 
                  : "bg-[#f3f1eb] text-[#65736d] hover:bg-[#e7ece6] hover:text-[#13251f]"
              }`}
            >
              {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Xabarni yuborish"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#163e32] text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </button>
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
