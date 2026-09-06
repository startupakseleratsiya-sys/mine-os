import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

export const maxDuration = 45;

const SYSTEM_PROMPT = `Siz Finora nomli AI moliyaviy o'qituvchisiz. Asosiy til — o'zbek tili (lotin yozuvi), lekin foydalanuvchi boshqa tilda yozsa o'sha tilda javob bering.

Vazifangiz moliyani har qanday darajadagi odamga sodda, xolis va amaliy qilib o'rgatish:
- Avval savolga qisqa va to'g'ridan-to'g'ri javob bering, keyin tushuntiring.
- Atamalarni oddiy tilda izohlang; kerak bo'lsa hayotiy misol va bosqichma-bosqich hisob ishlating.
- Javoblarni qisqa bo'limlar va punktlarga ajrating. Keraksiz uzunlikdan qoching.
- Foydalanuvchining bilim darajasini taxmin qilmang. Yetarli ma'lumot bo'lmasa bitta aniq savol bering.
- Shaxsiy investitsiya, kredit yoki soliq qarorida kafolat bermang. Tavakkalchilik, komissiya, inflyatsiya va foydalanuvchi holatini eslatib o'ting.
- Bu ta'limiy yordam ekanini, litsenziyalangan moliyaviy maslahat emasligini yuqori xavfli holatlarda aniq ayting.
- Maxfiy ma'lumotlar: karta raqami, PIN, parol, API kalit yoki pasport ma'lumotini so'ramang.
- O'zbekiston kontekstida aniq stavka, qonun yoki soliq aytsangiz, ma'lumot o'zgarishi mumkinligini belgilang va rasmiy manbani tekshirishni tavsiya qiling.
- Har javob oxirida, tabiiy bo'lsa, bitta foydali keyingi qadam taklif qiling.
- Formatlash: faqat oddiy markdown — sarlavha uchun "##", ro'yxat uchun "-" yoki "1.", muhim joy uchun **qalin**. Jadval va HTML ishlatmang.`;

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
      return NextResponse.json({ error: "Kirish talab qilinadi." }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI hali sozlanmagan. ANTHROPIC_API_KEY ni .env.local fayliga kiriting." },
        { status: 503 }
      );
    }

    const body: unknown = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Noto'g'ri so'rov formati." }, { status: 400 });
    }

    const { messages, context } = parsed.data;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return NextResponse.json({ error: "Savol topilmadi." }, { status: 400 });
    }

    // ── Suhbatni saqlash (jadval bo'lmasa — jim o'tkazib yuboriladi, chat ishlayveradi) ──
    let sessionId = parsed.data.sessionId ?? null;
    if (!sessionId) {
      const title = lastUser.content.replace(/\s+/g, " ").slice(0, 60);
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();
      if (error) console.warn("chat_sessions insert:", error.message);
      sessionId = data?.id ?? null;
    }
    if (sessionId) {
      const { error } = await supabase
        .from("chat_messages")
        .insert({ session_id: sessionId, role: "user", content: lastUser.content });
      if (error) console.warn("chat_messages insert (user):", error.message);
    }

    const system = context ? `${SYSTEM_PROMPT}\n\nJoriy kontekst: ${context}` : SYSTEM_PROMPT;

    // Opus 5 temperature/top_p qabul qilmaydi (400) — sampling parametrlari yuborilmaydi.
    const result = streamText({
      model: anthropic("claude-opus-5"),
      system,
      messages,
      onError: ({ error }) => {
        console.error("Tutor stream error:", error);
      },
      onEnd: async ({ text }) => {
        if (!sessionId || !text) return;
        const { error } = await supabase
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
      { error: "So'rovni bajarib bo'lmadi. Internet aloqasini tekshiring." },
      { status: 500 }
    );
  }
}
