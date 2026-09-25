import assert from "node:assert/strict";
import test from "node:test";
import { flattenLines, indexesOf, isAnswered, isLineCorrect, maskOf, scenarioPassed, scorePaper } from "../src/lib/scenario.ts";
import { PREPARATION_SPEC, EXECUTION_SPEC } from "../src/content/exam/scenario-specs.ts";
import { buildSession, review } from "../src/lib/srs.ts";

const line = (id, answer, options) => ({ id, stem: "stem", options, answer, explanation: "x", ref: "Ch 2 §1.1" });
const paper = {
  id: "t-1", level: "preparation", title: "T", sector: "S", scenario: "…",
  questions: [1, 2, 3, 4].map((n) => ({
    number: n, area: PREPARATION_SPEC.areas[n - 1].id, title: "t", additionalInfo: null,
    parts: [
      { id: `${n}a`, type: "classic", level: 3, instruction: "i", lines: Array.from({ length: 10 }, (_, i) => line(`${n}a-${i}`, i % 4, ["a", "b", "c", "d"])) },
      { id: `${n}b`, type: "multiple-response", level: 3, instruction: "i", lines: Array.from({ length: 5 }, (_, i) => line(`${n}b-${i}`, [0, 3], ["a", "b", "c", "d", "e"])) },
      { id: `${n}c`, type: "matching", level: 4, instruction: "i", columnOptions: ["x", "y", "z"], lines: Array.from({ length: 5 }, (_, i) => ({ ...line(`${n}c-${i}`, i % 3), options: undefined })) },
    ],
  })),
};

test("specs follow the official Practitioner format", () => {
  for (const spec of [PREPARATION_SPEC, EXECUTION_SPEC]) {
    assert.equal(spec.marks, 80);
    assert.equal(spec.minutes, 150);
    assert.equal(spec.extraMinutes, 40);
    assert.equal(spec.passMark, 40);
    assert.equal(spec.areas.length, 4);
  }
  assert.deepEqual(PREPARATION_SPEC.areas.map((a) => a.id), ["EF", "IP", "AP", "SC"]);
  assert.deepEqual(EXECUTION_SPEC.areas.map((a) => a.id), ["SC", "TA", "CC", "OM"]);
});

test("multiple response needs exactly the two keyed options", () => {
  const l = line("m", [1, 3], ["a", "b", "c", "d", "e"]);
  assert.equal(isLineCorrect("multiple-response", l, maskOf([3, 1])), true);
  assert.equal(isLineCorrect("multiple-response", l, maskOf([1])), false);
  assert.equal(isLineCorrect("multiple-response", l, maskOf([1, 3, 4])), false);
  assert.equal(isLineCorrect("multiple-response", l, maskOf([1, 2])), false);
  assert.equal(isAnswered("multiple-response", maskOf([1])), false);
  assert.deepEqual(indexesOf(maskOf([4, 0])), [0, 4]);
});

test("single-answer lines and unanswered lines", () => {
  const l = line("c", 2, ["a", "b", "c"]);
  assert.equal(isLineCorrect("classic", l, 2), true);
  assert.equal(isLineCorrect("classic", l, 1), false);
  assert.equal(isLineCorrect("classic", l, null), false);
});

test("a full paper is 80 marks, scored by area and type", () => {
  assert.equal(flattenLines(paper).length, 80);
  const all = {};
  for (const { part, line: l } of flattenLines(paper)) all[l.id] = part.type === "multiple-response" ? maskOf(l.answer) : l.answer;
  const full = scorePaper(paper, all);
  assert.equal(full.correct, 80);
  assert.deepEqual(full.areas.EF, { correct: 20, total: 20 });
  assert.deepEqual(full.types["multiple-response"], { correct: 20, total: 20 });
  assert.equal(scorePaper(paper, {}).correct, 0);
  const one = scorePaper(paper, all, [2]);
  assert.equal(one.total, 20);
  assert.equal(one.correct, 20);
});

test("pass mark is 40/80, proportional for a single question", () => {
  assert.equal(scenarioPassed(PREPARATION_SPEC, 40, 80), true);
  assert.equal(scenarioPassed(PREPARATION_SPEC, 39, 80), false);
  assert.equal(scenarioPassed(PREPARATION_SPEC, 10, 20), true);
  assert.equal(scenarioPassed(PREPARATION_SPEC, 9, 20), false);
});

test("spaced repetition: correct moves up a box, a miss resets to box 1", () => {
  const now = 1_000_000;
  const a = review(undefined, true, now);
  assert.equal(a.box, 1);
  const b = review(a, true, now);
  assert.equal(b.box, 2);
  assert.equal(b.due, now + 86_400_000);
  const c = review(b, false, now);
  assert.equal(c.box, 1);
  assert.ok(c.due - now < 3_600_000);
  const cards = [{ id: "x" }, { id: "y" }, { id: "z" }];
  const s = buildSession(cards, { x: { box: 2, due: now - 1 }, y: { box: 3, due: now + 999 } }, now, 10, 5);
  assert.deepEqual(s.map((c) => c.id), ["x", "z"]);
});
