// Darslarning ovozli tushuntirishini (har slayd narration'i) tabiiy ovozli MP3 ga aylantiradi.
// PULLIK API — faqat loyiha egasi ishga tushiradi. Kalit muhit o'zgaruvchisida:
//   OPENAI_API_KEY=...      node scripts/generate-lesson-audio.mjs [lessonId ...]
//   (ixtiyoriy) TTS_VOICE=alloy|ash|coral|sage|...  TTS_MODEL=gpt-4o-mini-tts
// Natija: public/audio/<lessonId>/<n>.mp3 va src/content/cp3p/audio.json (sayt shu fayllarni avtomatik ishlatadi;
// fayl bo'lmasa brauzer ovozi ishlaydi). Mavjud fayllar qayta yaratilmaydi (pul ikki marta ketmasin).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("OPENAI_API_KEY is not set.");
  process.exit(1);
}
const model = process.env.TTS_MODEL ?? "gpt-4o-mini-tts";
const voice = process.env.TTS_VOICE ?? "coral";
const only = new Set(process.argv.slice(2));
const base = path.join(root, "src/content/cp3p");
const manifestPath = path.join(base, "audio.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};

let chars = 0;
for (const level of ["foundation", "preparation", "execution"]) {
  const dir = path.join(base, level);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const lesson = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (only.size && !only.has(lesson.id)) continue;
    const outDir = path.join(root, "public/audio", lesson.id);
    fs.mkdirSync(outDir, { recursive: true });
    for (let i = 0; i < lesson.slides.length; i++) {
      const out = path.join(outDir, `${i + 1}.mp3`);
      if (fs.existsSync(out)) continue;
      const text = lesson.slides[i].narration;
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, voice, input: text, format: "mp3", instructions: "A warm, clear, encouraging teacher explaining a professional certification topic to non-native English speakers. Natural pace, clear pronunciation." }),
      });
      if (!res.ok) {
        console.error(`${lesson.id} slide ${i + 1}: ${res.status} ${await res.text()}`);
        process.exit(1);
      }
      fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
      chars += text.length;
      console.log(`${lesson.id} ${i + 1}/${lesson.slides.length}`);
    }
    manifest[lesson.id] = lesson.slides.length;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }
}
console.log(`Done. ${chars} characters sent to TTS.`);
