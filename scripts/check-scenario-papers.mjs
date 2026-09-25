// CP3P Preparation/Execution scenario papers: structure, marks, question types and answer balance.
// Usage: node scripts/check-scenario-papers.mjs            (every paper in src/content/exam/{preparation,execution})
//        node scripts/check-scenario-papers.mjs <file.json> (one paper, used while authoring)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const AREAS = {
  preparation: ["EF", "IP", "AP", "SC"],
  execution: ["SC", "TA", "CC", "OM"],
};
const TYPES = new Set(["classic", "multiple-response", "matching", "sequencing", "assertion-reason"]);
const REF = /^(Ch [2-7] §[0-9][0-9.]*|Ch [2-7] Box [0-9.]+|Glossary: )/;

function checkPaper(file) {
  const problems = [];
  const fail = (where, m) => problems.push(`${path.basename(file)} ${where} — ${m}`);
  let paper;
  try {
    paper = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return { problems: [`${file}: invalid JSON (${e.message})`], stats: null };
  }
  const areas = AREAS[paper.level];
  if (!areas) fail("paper", `level must be preparation|execution, got ${paper.level}`);
  for (const k of ["id", "title", "sector", "scenario"]) if (typeof paper[k] !== "string" || !paper[k].trim()) fail("paper", `missing ${k}`);
  if (typeof paper.scenario === "string" && paper.scenario.split(/\s+/).length < 450) fail("paper", "scenario shorter than 450 words");
  if (!Array.isArray(paper.questions) || paper.questions.length !== 4) {
    fail("paper", "exactly 4 questions required");
    return { problems, stats: null };
  }
  const typeCount = {};
  const positions = {};
  let level2 = 0;
  const lineIds = new Set();
  paper.questions.forEach((q, qi) => {
    const qw = `Q${qi + 1}`;
    if (q.number !== qi + 1) fail(qw, "number must be 1..4 in order");
    if (areas && q.area !== areas[qi]) fail(qw, `area must be ${areas[qi]} (got ${q.area})`);
    if (typeof q.title !== "string" || !q.title.trim()) fail(qw, "missing title");
    if (q.additionalInfo !== null && (typeof q.additionalInfo !== "string" || q.additionalInfo.trim().length < 80)) fail(qw, "additionalInfo must be null or real text");
    if (!Array.isArray(q.parts) || q.parts.length < 2) { fail(qw, "at least 2 parts"); return; }
    let marks = 0;
    let prevLevel = 0;
    const qTypes = new Set();
    q.parts.forEach((p, pi) => {
      const pw = `${qw} part ${p.id ?? pi}`;
      if (!TYPES.has(p.type)) { fail(pw, `unknown type ${p.type}`); return; }
      qTypes.add(p.type);
      typeCount[p.type] = (typeCount[p.type] ?? 0) + 1;
      if (![2, 3, 4].includes(p.level)) fail(pw, "level must be 2, 3 or 4");
      if (p.level < prevLevel) fail(pw, "parts must be in ascending learning level");
      prevLevel = Math.max(prevLevel, p.level);
      if (typeof p.instruction !== "string" || p.instruction.trim().length < 20) fail(pw, "instruction missing");
      if (p.usesAdditionalInfo && !q.additionalInfo) fail(pw, "usesAdditionalInfo but question has no additionalInfo");
      if (p.usesAdditionalInfo && !/additional information/i.test(p.instruction)) fail(pw, "instruction must tell the candidate to use the additional information");
      const shared = p.type === "matching" || p.type === "sequencing";
      if (shared) {
        if (!Array.isArray(p.columnOptions) || p.columnOptions.length < 3 || p.columnOptions.length > 7) fail(pw, "columnOptions: 3–7 items");
        if (p.type === "sequencing" && Array.isArray(p.columnOptions) && p.columnOptions.length !== (p.lines ?? []).length) fail(pw, "sequencing: one position per line");
      } else if (p.columnOptions) fail(pw, "columnOptions only for matching/sequencing");
      if (!Array.isArray(p.lines) || p.lines.length < 1) { fail(pw, "no lines"); return; }
      if (shared && p.lines.length < 3) fail(pw, "matching/sequencing need at least 3 lines");
      const seqAnswers = [];
      p.lines.forEach((l, li) => {
        const lw = `${pw} line ${l.id ?? li}`;
        marks += 1;
        if (p.level === 2) level2 += 1;
        if (lineIds.has(l.id)) fail(lw, "duplicate line id");
        lineIds.add(l.id);
        if (typeof l.stem !== "string" || l.stem.trim().length < 10) fail(lw, "stem missing");
        if (typeof l.explanation !== "string" || l.explanation.trim().length < 40) fail(lw, "explanation too short");
        if (typeof l.ref !== "string" || !REF.test(l.ref)) fail(lw, `bad ref: ${l.ref}`);
        if (shared) {
          if (l.options) fail(lw, "matching/sequencing lines use columnOptions, not options");
          if (!Number.isInteger(l.answer) || l.answer < 0 || l.answer >= (p.columnOptions ?? []).length) fail(lw, "answer must index columnOptions");
          seqAnswers.push(l.answer);
          return;
        }
        const n = Array.isArray(l.options) ? l.options.length : 0;
        if (p.type === "classic" && (n < 3 || n > 4)) fail(lw, "classic: 3 or 4 options");
        if (p.type === "assertion-reason") {
          if (n !== 3) fail(lw, "assertion-reason: exactly 3 options");
          else if (!l.options.every((o) => / BECAUSE /.test(o))) fail(lw, "assertion-reason options must read «… BECAUSE …»");
        }
        if (p.type === "multiple-response") {
          if (n !== 5) fail(lw, "multiple-response: exactly 5 options");
          if (!Array.isArray(l.answer) || l.answer.length !== 2 || new Set(l.answer).size !== 2 || l.answer.some((a) => !Number.isInteger(a) || a < 0 || a > 4)) fail(lw, "multiple-response answer: two distinct indexes");
          if (!/\b(2|two)\b/i.test(l.stem)) fail(lw, "multiple-response stem must ask for 2 answers");
          else (l.answer ?? []).forEach((a) => (positions[a] = (positions[a] ?? 0) + 0.5));
        } else {
          if (!Number.isInteger(l.answer) || l.answer < 0 || l.answer >= n) fail(lw, "answer must index options");
          else positions[l.answer] = (positions[l.answer] ?? 0) + 1;
        }
        if (n && new Set(l.options.map((o) => o.trim().toLowerCase())).size !== n) fail(lw, "duplicate options");
        if ((l.options ?? []).some((o) => /\b(all|none) of the above\b/i.test(o))) fail(lw, "no all/none of the above");
      });
      if (p.type === "sequencing" && new Set(seqAnswers).size !== seqAnswers.length) fail(pw, "sequencing: each position used once");
    });
    if (marks !== 20) fail(qw, `must total 20 marks (lines), got ${marks}`);
    if (qTypes.size < 3) fail(qw, "use at least 3 different question types");
  });
  for (const t of TYPES) if (!typeCount[t]) fail("paper", `question type ${t} never used`);
  if (level2 > 10) fail("paper", `max 10 level-2 marks per paper (got ${level2})`);
  return { problems, stats: { id: paper.id, level: paper.level, typeCount, level2, positions } };
}

const args = process.argv.slice(2);
const files = args.length
  ? args
  : ["preparation", "execution"].flatMap((lvl) => {
      const dir = path.join(root, "src/content/exam", lvl);
      return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^paper-.*\.json$/.test(f)).map((f) => path.join(dir, f)) : [];
    });
let bad = 0;
for (const f of files) {
  const { problems, stats } = checkPaper(f);
  if (problems.length) {
    bad += problems.length;
    console.error(`${problems.length} problem(s):\n- ` + problems.join("\n- "));
  } else {
    console.log(`OK ${stats.id} (${stats.level}): types ${JSON.stringify(stats.typeCount)}, level-2 marks ${stats.level2}, answer positions ${JSON.stringify(stats.positions)}`);
  }
}
if (!files.length) console.log("No scenario papers found.");
process.exit(bad ? 1 : 0);
