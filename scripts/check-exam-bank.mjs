// CP3P savollar bazasini tekshirish: tuzilma, javob kaliti, taqsimot va «test yechish hiylalari»ga chidamlilik.
// Ishga tushirish: npm run check:exam  (deploy darvozasida ham).
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dir = path.join(root, "src/content/exam/foundation");
const AREAS = { A: "concept", B: "scope", C: "rationale", D: "structure", E: "finance", F: "process", G: "glossary" };
const MOCK_COUNT = { concept: 7, scope: 8, rationale: 8, structure: 7, finance: 7, process: 6, glossary: 7 };
const TWO_STATEMENT = ["Only 1 is true", "Only 2 is true", "Both are true", "Neither is true"];
const STYLES = new Set(["which-describes", "missing-words", "not", "advantage", "two-statement", "applied"]);

const all = [];
for (const [letter, area] of Object.entries(AREAS)) {
  const items = JSON.parse(fs.readFileSync(path.join(dir, `batch-${letter}.json`), "utf8"));
  assert.ok(Array.isArray(items) && items.length >= MOCK_COUNT[area] * 4, `${letter}: kamida ${MOCK_COUNT[area] * 4} ta savol kerak (${items.length})`);
  for (const q of items) all.push({ ...q, area, batch: letter });
}

const problems = [];
const ids = new Set();
const stems = new Set();
let longestCorrect = 0;
let comparable = 0;
const positions = [0, 0, 0, 0];

for (const q of all) {
  const where = `${q.batch}:${q.id}`;
  const fail = (m) => problems.push(`${where} — ${m}`);
  if (ids.has(q.id)) fail("takroriy id");
  ids.add(q.id);
  const stemKey = q.stem.trim().toLowerCase();
  if (stems.has(stemKey)) fail("takroriy savol matni");
  stems.add(stemKey);
  if (typeof q.stem !== "string" || q.stem.trim().length < 15) fail("savol matni juda qisqa");
  if (!Array.isArray(q.options) || q.options.length !== 4) { fail("4 ta variant bo'lishi shart"); continue; }
  if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== 4) fail("variantlar takrorlanadi");
  if (q.options.some((o) => !o.trim())) fail("bo'sh variant");
  if (q.options.some((o) => /\b(all|none) of the above\b/i.test(o))) fail("«all/none of the above» ishlatilgan");
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) { fail("answer 0–3 bo'lishi kerak"); continue; }
  positions[q.answer] += 1;
  if (!Array.isArray(q.rationale) || q.rationale.length !== 4) { fail("4 ta izoh bo'lishi shart"); continue; }
  q.rationale.forEach((r, i) => {
    const want = i === q.answer ? "Correct." : "Incorrect.";
    if (typeof r !== "string" || !r.startsWith(want) || r.trim().length < want.length + 10) fail(`izoh ${i}: «${want}» bilan boshlanib, sabab ko'rsatishi kerak`);
  });
  if (![1, 2].includes(q.level)) fail("level 1 yoki 2");
  if (!STYLES.has(q.style)) fail(`noma'lum style: ${q.style}`);
  if (q.style === "two-statement" && JSON.stringify(q.options) !== JSON.stringify(TWO_STATEMENT)) fail("two-statement variantlari standart bo'lishi kerak");
  if (typeof q.ref !== "string" || !/^(Ch 1 §|Ch 1 App A|Glossary: )/.test(q.ref)) fail(`ref noto'g'ri: ${q.ref}`);
  if (!q.topic || !/^[a-z0-9-]+$/.test(q.topic)) fail("topic kebab-case bo'lishi kerak");
  if (q.style !== "two-statement") {
    comparable += 1;
    const lens = q.options.map((o) => o.length);
    const max = Math.max(...lens);
    if (lens[q.answer] === max && lens.filter((l) => l === max).length === 1 && max - [...lens].sort((a, b) => b - a)[1] > 25) longestCorrect += 1;
  }
}

// To'g'ri javob o'rni teng taqsimlangan bo'lsin (har biri 20–30%).
const total = all.length;
positions.forEach((n, i) => {
  const share = n / total;
  if (share < 0.2 || share > 0.3) problems.push(`javob o'rni ${"ABCD"[i]}: ${(share * 100).toFixed(1)}% (20–30% bo'lishi kerak)`);
});
// «Eng uzun variant — to'g'ri» naqshi sezilarli bo'lmasin.
if (longestCorrect / comparable > 0.15) problems.push(`to'g'ri javob aniq eng uzun variant: ${longestCorrect}/${comparable} (≤15% bo'lishi kerak)`);

if (problems.length) {
  console.error(`Savollar bazasida ${problems.length} ta muammo:\n- ` + problems.join("\n- "));
  process.exit(1);
}
const byArea = Object.values(AREAS).map((a) => `${a} ${all.filter((q) => q.area === a).length}`).join(", ");
console.log(`Verified ${total} Foundation questions (${byArea}); answer positions A/B/C/D ${positions.join("/")}; obvious-longest-correct ${longestCorrect}/${comparable}.`);
