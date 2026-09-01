"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUp, CircleDollarSign, GraduationCap, LoaderCircle, MessageSquareText, Plus, ShieldCheck, UserRound } from "lucide-react";
import { useRef, useEffect, useState, FormEvent } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

const starters = [
  "Oylik budjetni qanday tuzaman?", 
  "Murakkab foizni sodda tushuntir", 
  "Kredit olishdan oldin nimani tekshiraman?", 
  "Favqulodda jamg‘arma qancha bo‘lishi kerak?"
];

export function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage(text: string) {
    const clean = text.trim();
    if (!clean || isLoading) return;
    
    const nextMessages: Message[] = [...messages, { id: Date.now().toString(), role: "user", content: clean }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })).slice(-20) })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ulanishda xatolik yuz berdi");
      }
      
      if (!response.body) throw new Error("Bo'sh javob");
      
      const assistantId = (Date.now() + 1).toString();
      setMessages(current => [...current, { id: assistantId, role: "assistant", content: "" }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(current => current.map(msg => 
          msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Noma’lum xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return <div className="flex min-h-screen flex-col bg-[#f3f1eb] text-[#13251f]">
    <header className="border-b border-[#13251f]/10 bg-[#f8f7f2]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1100px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" aria-label="Dashboardga qaytish" className="grid size-10 place-items-center rounded-full border border-[#13251f]/10 transition hover:bg-white"><ArrowLeft className="size-4" /></Link>
          <Link href="/" className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-full bg-[#163e32] text-white"><CircleDollarSign className="size-4.5" /></span><span className="font-semibold tracking-tight">finora</span></Link>
        </div>
        <button onClick={() => { setMessages([]); setError(""); }} className="inline-flex items-center gap-2 rounded-full border border-[#13251f]/12 bg-white/60 px-4 py-2.5 text-xs font-semibold"><Plus className="size-4" /> Yangi suhbat</button>
      </div>
    </header>

    <main className="mx-auto flex w-full max-w-[850px] flex-1 flex-col px-5 sm:px-8">
      {messages.length === 0 ? (
        <div className="my-auto py-14 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full border border-[#285744]/20 bg-[#e7ece6] text-[#285744]"><GraduationCap className="size-6" strokeWidth={1.6} /></div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Bugun nimani tushunib olamiz?</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#65736d]">Moliyaviy savolingizni oddiy tilda yozing. Men tushunchani misollar va aniq qadamlar bilan tushuntiraman.</p>
          <div className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
            {starters.map((starter) => (
              <button key={starter} onClick={() => void sendMessage(starter)} className="rounded-2xl border border-[#13251f]/10 bg-white/60 p-4 text-left text-sm font-medium leading-5 transition hover:-translate-y-0.5 hover:border-[#35624f]/30 hover:bg-white">{starter}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-10">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#163e32]/20 bg-[#e7ece6] text-[#163e32]"><MessageSquareText className="size-4.5" strokeWidth={1.7} /></span>}
              <div className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-6 ${message.role === "user" ? "rounded-tr-sm bg-[#dce7dd]" : "rounded-tl-sm border border-[#13251f]/8 bg-white"}`}>
                {message.content}
              </div>
              {message.role === "user" && <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#13251f]/10 bg-white"><UserRound className="size-4.5" /></span>}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex items-center gap-3 text-sm text-[#65736d]">
               <span className="grid size-9 place-items-center rounded-full border border-[#163e32]/20 bg-[#e7ece6] text-[#163e32]"><MessageSquareText className="size-4.5" strokeWidth={1.7} /></span>
               <LoaderCircle className="size-4 animate-spin" /> Yozmoqda...
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
      
      {error && (
        <div role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-[#f3f1eb] via-[#f3f1eb] to-transparent pb-5 pt-6">
        <form onSubmit={submit} className="flex items-end gap-3 rounded-[22px] border border-[#13251f]/12 bg-white p-2.5 shadow-[0_15px_40px_rgba(30,55,46,0.10)]">
          <textarea 
            ref={inputRef} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(event) => { 
              if (event.key === "Enter" && !event.shiftKey) { 
                event.preventDefault(); 
                void sendMessage(input); 
              } 
            }} 
            rows={1} 
            maxLength={8000} 
            placeholder="Masalan: 50/30/20 qoidasi nima?" 
            className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-[#89948f]" 
          />
          <button disabled={!input.trim() || isLoading} aria-label="Xabarni yuborish" className="grid size-11 shrink-0 place-items-center rounded-full bg-[#163e32] text-white transition hover:bg-[#0e3026] disabled:cursor-not-allowed disabled:opacity-35">
            <ArrowUp className="size-5" />
          </button>
        </form>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#7d8883]">
          <ShieldCheck className="size-3" /> Finora xato qilishi mumkin. Muhim qarorlarni mustaqil tekshiring.
        </p>
      </div>
    </main>
  </div>;
}
