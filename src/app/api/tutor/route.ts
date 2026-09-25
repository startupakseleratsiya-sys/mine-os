import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

/** Xarajat himoyasi: bir foydalanuvchi soatiga / kuniga nechta savol bera oladi, modelga qancha kontekst ketadi. */
const PER_HOUR = 30;
const PER_DAY = 120;
const MAX_HISTORY = 12;
const MAX_CHARS = 16000;

export const maxDuration = 45;

const SYSTEM_PROMPT = `You are Finora, an AI finance tutor. Always answer in clear, simple English — the platform and its certification exams (including the CP3P / APMG PPP certification) are in English. If the user writes in another language, still reply in English, using plain words.

Your job is to teach finance and public-private partnerships (PPP) to people of any level, simply, neutrally and practically:
- Give a short, direct answer first, then explain.
- Explain terms in plain language; use real-life examples and step-by-step calculations where helpful.
- For PPP topics, use the terminology of the APMG PPP Certification Guide so the learner is ready for the exam.
- Split answers into short sections and bullet points. Avoid unnecessary length.
- Do not assume the user's level. If information is missing, ask one precise question.
- Never guarantee outcomes of personal investment, loan or tax decisions. Mention risk, fees, inflation and the user's situation.
- In high-stakes cases, state clearly that this is educational help, not licensed financial advice.
- Sensitive data: never ask for card numbers, PINs, passwords, API keys or passport details.
- When you cite specific rates, laws or taxes, note that they may change and recommend checking the official source.
- End each answer, where natural, with one useful next step.
- Formatting: plain markdown only — "##" for headings, "-" or "1." for lists, **bold** for key points. No tables or HTML.`;

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(10000),
      })
    )
    .min(1)
    .max(50),
  /** Dars sahifasidan keladigan kontekst (qaysi kurs/bob). */
  context: z.string().max(600).optional(),
  /** Davom etayotgan suhbat. Yo'q bo'lsa yangi sessiya ochiladi. */
  sessionId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    // Faqat kirgan foydalanuvchilar — aks holda API kalit ochiq qolardi.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "The AI tutor is not configured yet." },
        { status: 503 }
      );
    }

    const body: unknown = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
    }

    const { context } = parsed.data;
    // Faqat oxirgi xabarlar va umumiy hajm chegarasi — uzun tarix bilan xarajatni oshirib bo'lmaydi.
    let messages = parsed.data.messages.slice(-MAX_HISTORY);
    while (messages.length > 1 && messages.reduce((n, m) => n + m.content.length, 0) > MAX_CHARS) messages = messages.slice(1);
    if (messages[0]?.role === "assistant") messages = messages.slice(1);

    // Limit: soatiga PER_HOUR, kuniga PER_DAY savol (bazadagi o'z xabarlari bo'yicha).
    const counter = createAdminClient() ?? supabase;
    const since = (ms: number) => new Date(Date.now() - ms).toISOString();
    const countSince = async (ms: number) => {
      const { count } = await counter
        .from("chat_messages")
        .select("id, chat_sessions!inner(user_id)", { count: "exact", head: true })
        .eq("chat_sessions.user_id", user.id)
        .eq("role", "user")
        .gte("created_at", since(ms));
      return count ?? 0;
    };
    const [hour, day] = await Promise.all([countSince(3_600_000), countSince(86_400_000)]);
    if (hour >= PER_HOUR || day >= PER_DAY) {
      return NextResponse.json(
        { error: hour >= PER_HOUR ? "You have asked a lot in the last hour — please take a short break and try again later." : "You have reached today's question limit for the AI tutor. It resets within 24 hours." },
        { status: 429 },
      );
    }
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return NextResponse.json({ error: "No question found." }, { status: 400 });
    }

    // ── Suhbatni saqlash (jadval bo'lmasa — jim o'tkazib yuboriladi, chat ishlayveradi) ──
    let sessionId = parsed.data.sessionId ?? null;
    // Faqat o'z suhbati: begona/o'ylab topilgan id bilan xabar yozilmay qolib, limitni chetlab o'tish mumkin edi.
    if (sessionId) {
      const { data: own } = await counter.from("chat_sessions").select("id").eq("id", sessionId).eq("user_id", user.id).maybeSingle();
      if (!own) sessionId = null;
    }
    if (!sessionId) {
      const title = lastUser.content.replace(/\s+/g, " ").slice(0, 60);
      const { data, error } = await counter
        .from("chat_sessions")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();
      if (error) console.warn("chat_sessions insert:", error.message);
      sessionId = data?.id ?? null;
    }
    // Savol hisobga olinmasa (limit ishlamaydi) — pullik model chaqirilmaydi.
    const { error: logError } = sessionId
      ? await counter.from("chat_messages").insert({ session_id: sessionId, role: "user", content: lastUser.content })
      : { error: { message: "no session" } };
    if (logError) {
      console.warn("chat_messages insert (user):", logError.message);
      return NextResponse.json({ error: "The AI tutor is busy right now. Please try again in a minute." }, { status: 503 });
    }

    const system = context ? `${SYSTEM_PROMPT}\n\nThe learner is studying this lesson right now — ground your answer in it and in the PPP Guide 2026: ${context}` : SYSTEM_PROMPT;

    // Opus 5 temperature/top_p qabul qilmaydi (400) — sampling parametrlari yuborilmaydi.
    const result = streamText({
      model: anthropic("claude-opus-5"),
      maxOutputTokens: 1500,
      system,
      messages,
      onError: ({ error }) => {
        console.error("Tutor stream error:", error);
      },
      onEnd: async ({ text }) => {
        if (!sessionId || !text) return;
        const { error } = await counter
          .from("chat_messages")
          .insert({ session_id: sessionId, role: "assistant", content: text });
        if (error) console.warn("chat_messages insert (assistant):", error.message);
      },
    });

    return result.toTextStreamResponse({
      headers: sessionId ? { "x-session-id": sessionId } : undefined,
    });
  } catch (error) {
    console.error("Tutor route error:", error);
    return NextResponse.json(
      { error: "The request could not be completed. Please check your internet connection." },
      { status: 500 }
    );
  }
}
