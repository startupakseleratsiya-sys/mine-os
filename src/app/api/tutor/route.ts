import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

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
- Har javob oxirida, tabiiy bo'lsa, bitta foydali keyingi qadam taklif qiling.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI hali sozlanmagan. ANTHROPIC_API_KEY ni .env.local fayliga kiriting." },
        { status: 503 }
      );
    }

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20240620'),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Tutor route error", error);
    return NextResponse.json(
      { error: "So‘rovni bajarib bo‘lmadi. Internet aloqasini tekshiring." },
      { status: 500 }
    );
  }
}

