import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const cache = new Map();
function loadContent(name) {
  if (cache.has(name)) return cache.get(name);
  assert.ok(["courses", "ppp-course", "ppp-lessons"].includes(name));
  const filename = path.join(root, "src/content", `${name}.ts`);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const exports = {};
  vm.runInNewContext(compiled.outputText, {
    exports,
    require: (specifier) => {
      assert.ok(["./ppp-course", "./ppp-lessons"].includes(specifier));
      return loadContent(specifier.slice(2));
    },
  }, { filename });
  cache.set(name, exports);
  return exports;
}

const { COURSES, TOTAL_CHAPTERS, getCourse, getChapter } = loadContent("courses");
assert.equal(new Set(COURSES.map((course) => course.slug)).size, COURSES.length);
assert.equal(TOTAL_CHAPTERS, COURSES.reduce((total, course) => total + course.chapters.length, 0));
for (const course of COURSES) {
  assert.equal(getCourse(course.slug), course);
  assert.equal(new Set(course.chapters.map((chapter) => chapter.id)).size, course.chapters.length);
  course.chapters.forEach((chapter, index) => {
    const found = getChapter(course.slug, chapter.id);
    assert.equal(found.chapter, chapter);
    assert.equal(found.prev, course.chapters[index - 1] ?? null);
    assert.equal(found.next, course.chapters[index + 1] ?? null);
    assert.ok(chapter.minutes > 0 && chapter.body.startsWith("# "));
    for (const quiz of chapter.quiz ?? []) {
      assert.ok(quiz.options.length >= 2);
      assert.equal(new Set(quiz.options).size, quiz.options.length);
      assert.ok(Number.isInteger(quiz.answer) && quiz.answer >= 0 && quiz.answer < quiz.options.length);
      assert.ok(quiz.explanation.trim().length > 0);
    }
    if (chapter.exercise) {
      const exercise = chapter.exercise;
      assert.ok(exercise.title && exercise.situation && exercise.question && exercise.hint);
      assert.ok(exercise.choices.length >= 2);
      assert.equal(new Set(exercise.choices.map((choice) => choice.label)).size, exercise.choices.length);
      assert.ok(Number.isInteger(exercise.answer) && exercise.answer >= 0 && exercise.answer < exercise.choices.length);
      assert.ok(exercise.choices.every((choice) => choice.label.trim() && choice.feedback.trim()));
      assert.ok(chapter.objectives?.length > 0 && chapter.terms?.length > 0);
    }
  });
  if (course.modules) {
    const ids = course.modules.flatMap((module) => module.chapterIds);
    assert.equal(new Set(course.modules.map((module) => module.id)).size, course.modules.length);
    assert.deepEqual([...ids], Array.from(course.chapters, (chapter) => chapter.id));
  }
}
// PPP: CP3P'ning 3 bosqichi — Foundation (1–2-bob + lug'at/mashq), Preparation (3–5), Implementation (6–8).
const stages = ["cp3p-foundation", "cp3p-preparation", "cp3p-implementation"].map((slug) => getCourse(slug));
assert.ok(stages.every(Boolean));
assert.equal(getCourse("davlat-xususiy-sheriklik"), undefined);
assert.deepEqual(stages.map((course) => course.modules.length), [3, 3, 3]);
const ppp = { slug: stages[0].slug, chapters: stages.flatMap((course) => course.chapters) };
assert.equal(ppp.chapters.length, 27);
assert.equal(new Set(ppp.chapters.map((chapter) => chapter.id)).size, 27);
assert.ok(stages.flatMap((course) => course.modules).filter((module) => module.id !== "ppp-reference").every((module) => module.chapterIds.length === 3));
assert.equal(ppp.chapters.filter((chapter) => chapter.exercise).length, 16);
assert.equal(new Set(ppp.chapters.map((chapter) => chapter.source.file)).size, 11);
for (const chapter of ppp.chapters) {
  assert.ok(chapter.quiz?.length > 0);
  const file = chapter.source.file;
  assert.equal(path.basename(file), file);
  const pdf = fs.readFileSync(path.join(root, "public/materials/ppp", file));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(chapter.source.pages > 0 && chapter.source.reading);
  assert.ok(Number.isInteger(chapter.source.startPage) && chapter.source.startPage >= 1 && chapter.source.startPage <= chapter.source.pages);
}
assert.equal(getChapter(ppp.slug, "missing"), undefined);
assert.equal(getCourse("missing"), undefined);
console.log(`Verified ${COURSES.length} courses, ${TOTAL_CHAPTERS} lessons, 11 PDF resources and ${ppp.chapters.reduce((sum, chapter) => sum + chapter.quiz.length, 0)} practice questions.`);
