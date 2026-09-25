// CP3P darslari (src/content/cp3p/<level>/*.json): tuzilma, test (10 savol), slaydlar va tartib.
// Usage: node scripts/check-lessons.mjs            (all lessons)
//        node scripts/check-lessons.mjs <file.json> (one lesson, used while authoring)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const LEVELS = ["foundation", "preparation", "execution"];
const TWO = ["Only 1 is true", "Only 2 is true", "Both are true", "Neither is true"];

function check(file) {
  const bad = [];
  const fail = (m) => bad.push(`${path.basename(file)} — ${m}`);
  let l;
  try {
    l = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return [`${file}: invalid JSON (${e.message})`];
  }
  if (!/^[fpe]\d{2}-[a-z0-9-]+$/.test(l.id ?? "")) fail(`id must look like f01-some-slug (got ${l.id})`);
  if (!LEVELS.includes(l.level)) fail("level must be foundation|preparation|execution");
  if (!Number.isInteger(l.order) || l.order < 1) fail("order must be a positive integer");
  if (l.id && l.level && l.id[0] !== l.level[0]) fail("id prefix must match level");
  if (l.id && Number(l.id.slice(1, 3)) !== l.order) fail("id number must equal order");
  for (const k of ["title", "guideRef"]) if (typeof l[k] !== "string" || !l[k].trim()) fail(`missing ${k}`);
  if (!Number.isInteger(l.minutes) || l.minutes < 8 || l.minutes > 40) fail("minutes 8–40");
  const arr = (k, min, max) => {
    if (!Array.isArray(l[k]) || l[k].length < min || l[k].length > max) fail(`${k}: ${min}–${max} items`);
    return Array.isArray(l[k]) ? l[k] : [];
  };
  arr("objectives", 3, 6);
  const sections = arr("sections", 3, 9);
  const words = sections.reduce((s, x) => s + String(x.body ?? "").split(/\s+/).length, 0);
  if (words < 1100 || words > 3200) fail(`section text ${words} words (1,400–2,400 wanted)`);
  sections.forEach((s, i) => { if (!s.heading || !s.body) fail(`section ${i}: heading and body required`); });
  if (!l.example?.title || String(l.example?.body ?? "").split(/\s+/).length < 60) fail("example needs a title and a real body");
  arr("examTraps", 3, 6).forEach((t, i) => { if (!t.trap || !t.fix) fail(`examTraps ${i}: trap and fix`); });
  arr("keyTerms", 4, 12).forEach((t, i) => { if (!t.term || !t.meaning) fail(`keyTerms ${i}: term and meaning`); });
  arr("summary", 4, 8);
  arr("slides", 5, 10).forEach((s, i) => {
    if (!s.title || !Array.isArray(s.points) || s.points.length < 1 || s.points.length > 5) fail(`slide ${i}: title and 1–5 points`);
    const n = String(s.narration ?? "").split(/\s+/).length;
    if (n < 40 || n > 150) fail(`slide ${i}: narration ${n} words (60–110 wanted)`);
  });
  const quiz = arr("quiz", 10, 10);
  const pos = [0, 0, 0, 0];
  const stems = new Set();
  quiz.forEach((q, i) => {
    const w = `quiz ${i + 1}`;
    if (typeof q.question !== "string" || q.question.length < 15) fail(`${w}: question text`);
    if (stems.has(q.question)) fail(`${w}: duplicate`);
    stems.add(q.question);
    if (!Array.isArray(q.options) || q.options.length !== 4) return fail(`${w}: 4 options`);
    if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== 4) fail(`${w}: duplicate options`);
    if (q.options.some((o) => /\b(all|none) of the above\b/i.test(o))) fail(`${w}: no all/none of the above`);
    if (/two|statements/i.test(q.question) && q.options.every((o) => TWO.includes(o)) === false && q.options.some((o) => /^Only [12] is true$/.test(o))) fail(`${w}: two-statement options must be the standard four`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) return fail(`${w}: answer 0–3`);
    pos[q.answer] += 1;
    if (typeof q.explanation !== "string" || q.explanation.length < 30) fail(`${w}: explanation`);
  });
  if (quiz.length === 10 && Math.max(...pos) > 4) fail(`answer positions unbalanced ${pos.join("/")} (max 4 per letter)`);
  return bad;
}

const args = process.argv.slice(2);
const files = args.length
  ? args
  : LEVELS.flatMap((lvl) => {
      const dir = path.join(root, "src/content/cp3p", lvl);
      return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => path.join(dir, f)) : [];
    });
let problems = [];
for (const f of files) problems = problems.concat(check(f));
if (!args.length) {
  // Har darajada tartib 1..N uzluksiz bo'lsin.
  for (const lvl of LEVELS) {
    const dir = path.join(root, "src/content/cp3p", lvl);
    if (!fs.existsSync(dir)) continue;
    const orders = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).order).sort((a, b) => a - b);
    orders.forEach((o, i) => { if (o !== i + 1) problems.push(`${lvl}: lesson order must be 1..${orders.length} without gaps (got ${orders.join(",")})`); });
  }
}
if (problems.length) {
  console.error(`${problems.length} problem(s):\n- ` + [...new Set(problems)].join("\n- "));
  process.exit(1);
}
console.log(`OK ${files.length} lesson file(s).`);
