// Darslar uchun tabiiy ovozli MP3 (OpenAI TTS): video slaydlari narration'i va audio dars bo'limlari.
// Kalit: OPENAI_API_KEY (muhitda yoki .env.local'da). PULLIK — faqat loyiha egasi roziligi bilan.
//   node scripts/generate-lesson-audio.mjs [lessonId ...]      (bo'sh = hammasi)
//   (ixtiyoriy) TTS_VOICE=coral  TTS_MODEL=gpt-4o-mini-tts  TTS_CONCURRENCY=4
// Natija: .audio-cache/<lessonId>/<n>.mp3 (slaydlar), p<n>.mp3 (audio dars bo'limlari) — keyin scripts/publish_lesson_audio.py
//         va src/content/cp3p/audio.json. Mavjud fayllar qayta yaratilmaydi (pul ikki marta ketmasin).
//         Yangi yozuvlardan keyin: python scripts/lesson_audio_durations.py (pleyer uchun davomiyliklar).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const envFile = path.join(root, ".env.local");
if (!process.env.OPENAI_API_KEY && fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = /^OPENAI_API_KEY=(.*)$/.exec(line.trim());
    if (m) process.env.OPENAI_API_KEY = m[1].replace(/^"|"$/g, "");
  }
}
const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("OPENAI_API_KEY is not set.");
  process.exit(1);
}
const model = process.env.TTS_MODEL ?? "gpt-4o-mini-tts";
const voice = process.env.TTS_VOICE ?? "coral";
const concurrency = Number(process.env.TTS_CONCURRENCY ?? 4);
const only = new Set(process.argv.slice(2));
const base = path.join(root, "src/content/cp3p");
const manifestPath = path.join(base, "audio.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const INSTRUCTIONS =
  "You are a warm, clear and encouraging teacher explaining a professional PPP certification topic to adult learners, many of them non-native English speakers. Speak naturally at a steady, unhurried pace with clear pronunciation. Say acronyms letter by letter unless they are words.";

// lesson-view.tsx dagi listenParts + narrator.ts dagi plainForSpeech bilan AYNAN bir xil bo'lishi shart.
function plainForSpeech(md) {
  return md
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/[*_#>`]/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/§/g, "section ")
    .replace(/\s+/g, " ")
    .trim();
}
export function listenParts(lesson) {
  return [
    ...lesson.sections.map((s) => ({ heading: s.heading, text: plainForSpeech(s.body) })),
    { heading: `Example: ${lesson.example.title}`, text: plainForSpeech(lesson.example.body) },
    { heading: "Exam traps", text: lesson.examTraps.map((t) => `${t.trap}. ${t.fix}`).join(" ") },
    { heading: "Summary", text: lesson.summary.join(" ") },
  ];
}

/** TTS kiritish chegarasi (~4000 belgi) — uzun matn gap chegarasida bo'linadi, MP3 bo'laklari ketma-ket ulanadi. */
function chunks(text, max = 3500) {
  const out = [];
  let cur = "";
  for (const s of text.split(/(?<=[.!?])\s+/)) {
    if ((cur + " " + s).length > max && cur) {
      out.push(cur);
      cur = s;
    } else cur = cur ? `${cur} ${s}` : s;
  }
  if (cur) out.push(cur);
  return out;
}

let chars = 0;
async function tts(text) {
  const parts = [];
  for (const c of chunks(text)) {
    for (let tryNo = 1; ; tryNo++) {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, voice, input: c, response_format: "mp3", instructions: INSTRUCTIONS }),
      });
      if (res.ok) {
        parts.push(Buffer.from(await res.arrayBuffer()));
        chars += c.length;
        break;
      }
      const body = await res.text();
      if ((res.status === 429 || res.status >= 500) && tryNo < 5) {
        await new Promise((r) => setTimeout(r, 2000 * tryNo));
        continue;
      }
      throw new Error(`${res.status} ${body.slice(0, 300)}`);
    }
  }
  return Buffer.concat(parts);
}

const jobs = [];
const lessons = [];
for (const level of ["foundation", "preparation", "execution"]) {
  const dir = path.join(base, level);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const lesson = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (only.size && !only.has(lesson.id)) continue;
    const outDir = path.join(root, ".audio-cache", lesson.id);
    fs.mkdirSync(outDir, { recursive: true });
    const parts = listenParts(lesson);
    lessons.push({ lesson, outDir, parts });
    lesson.slides.forEach((s, i) => jobs.push({ out: path.join(outDir, `${i + 1}.mp3`), text: s.narration }));
    parts.forEach((p, i) => jobs.push({ out: path.join(outDir, `p${i + 1}.mp3`), text: `${p.heading}. ${p.text}` }));
  }
}

const todo = jobs.filter((j) => !fs.existsSync(j.out));
const todoIds = new Set(todo.map((j) => path.basename(path.dirname(j.out))));
console.log(`${jobs.length} files, ${todo.length} to generate (${todo.reduce((s, j) => s + j.text.length, 0)} characters).`);
let done = 0;
let failed = 0;
async function worker() {
  while (todo.length) {
    const job = todo.shift();
    try {
      fs.writeFileSync(job.out, await tts(job.text));
      done += 1;
      if (done % 20 === 0) console.log(`${done} done`);
    } catch (e) {
      failed += 1;
      console.error(`FAILED ${path.relative(root, job.out)}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

// Manifestga faqat to'liq tayyor darslar yoziladi (qisman bo'lsa sayt brauzer ovoziga qaytadi).
for (const { lesson, outDir, parts } of lessons) {
  const slidesOk = lesson.slides.every((_, i) => fs.existsSync(path.join(outDir, `${i + 1}.mp3`)));
  const partsOk = parts.every((_, i) => fs.existsSync(path.join(outDir, `p${i + 1}.mp3`)));
  const prev = manifest[lesson.id] ?? {};
  const next = { slides: slidesOk ? lesson.slides.length : 0, parts: partsOk ? parts.length : 0 };
  // Yangi fayl paydo bo'lsa qayta yuklash kerak — published faqat hech narsa o'zgarmaganda saqlanadi.
  manifest[lesson.id] = { ...next, published: Boolean(prev.published) && prev.slides === next.slides && prev.parts === next.parts && todoIds.has(lesson.id) === false };
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Done: ${done} generated, ${failed} failed, ${chars} characters sent.`);
process.exit(failed ? 1 : 0);
