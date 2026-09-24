import assert from "node:assert/strict";
import test from "node:test";
import { buildMock, passed, readiness, scoreExam, seededRandom } from "../src/lib/exam.ts";
import { FOUNDATION_SPEC } from "../src/content/exam/foundation/spec.ts";

// Synthetic bank: 20 questions per area, answer = index % 4.
const bank = FOUNDATION_SPEC.areas.flatMap((area) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `${area.id}-${i}`, area: area.id, section: "1", topic: "t", level: 1, style: "which-describes",
    stem: "?", options: ["a", "b", "c", "d"], answer: i % 4, rationale: ["", "", "", ""], ref: "Ch 1",
  })),
);

test("Foundation spec matches the official format", () => {
  assert.equal(FOUNDATION_SPEC.questions, 50);
  assert.equal(FOUNDATION_SPEC.minutes, 40);
  assert.equal(FOUNDATION_SPEC.passMark, 25);
  assert.equal(FOUNDATION_SPEC.areas.reduce((s, a) => s + a.mockCount, 0), 50);
});

test("mock has exactly 50 unique questions and follows the area blueprint", () => {
  const mock = buildMock(FOUNDATION_SPEC, bank, 42);
  assert.equal(mock.length, 50);
  assert.equal(new Set(mock.map((q) => q.id)).size, 50);
  for (const area of FOUNDATION_SPEC.areas) {
    assert.equal(mock.filter((q) => q.area === area.id).length, area.mockCount);
  }
});

test("same seed gives the same mock; different seeds differ", () => {
  const ids = (seed) => buildMock(FOUNDATION_SPEC, bank, seed).map((q) => q.id).join();
  assert.equal(ids(7), ids(7));
  assert.notEqual(ids(7), ids(8));
});

test("unseen questions are preferred", () => {
  const seen = new Set(bank.filter((q) => Number(q.id.split("-")[1]) < 10).map((q) => q.id));
  const mock = buildMock(FOUNDATION_SPEC, bank, 3, seen);
  assert.ok(mock.every((q) => !seen.has(q.id)));
});

test("a small bank still yields a full-length mock by filling from other areas", () => {
  const small = bank.filter((q) => q.area !== "glossary" || Number(q.id.split("-")[1]) < 2);
  assert.equal(buildMock(FOUNDATION_SPEC, small, 1).length, 50);
});

test("scoring and pass mark (25/50)", () => {
  const mock = buildMock(FOUNDATION_SPEC, bank, 5);
  const answers = mock.map((q, i) => (i < 25 ? q.answer : (q.answer + 1) % 4));
  const r = scoreExam(mock, answers);
  assert.equal(r.correct, 25);
  assert.ok(passed(FOUNDATION_SPEC, r.correct, r.total));
  assert.ok(!passed(FOUNDATION_SPEC, 24, 50));
  assert.equal(Object.values(r.areas).reduce((s, a) => s + a.total, 0), 50);
  assert.equal(scoreExam(mock, mock.map(() => null)).correct, 0);
});

test("readiness needs enough data per area and applies a safety margin", () => {
  const at = (i) => new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString();
  const all = (ratio) => bank.flatMap((q, i) => [{ question_id: q.id, correct: (i % 10) < ratio * 10, answered_at: at(i) }]);
  assert.equal(readiness(FOUNDATION_SPEC, bank, []).status, "not-enough-data");
  assert.equal(readiness(FOUNDATION_SPEC, bank, all(0.8)).status, "ready");
  assert.equal(readiness(FOUNDATION_SPEC, bank, all(0.6)).status, "almost");
  assert.equal(readiness(FOUNDATION_SPEC, bank, all(0.4)).status, "not-ready");
});

test("seeded random is in [0, 1)", () => {
  const r = seededRandom(1);
  for (let i = 0; i < 1000; i++) { const x = r(); assert.ok(x >= 0 && x < 1); }
});
