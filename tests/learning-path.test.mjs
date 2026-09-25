import assert from "node:assert/strict";
import test from "node:test";
import { lessonTest, passMarkFor } from "../src/lib/learning-path.ts";

const q = (n) => ({ question: `q${n}`, options: ["a", "b", "c", "d"], answer: n % 4, explanation: "e" });
const course = { chapters: ["l1", "l2", "l3"].map((id) => ({ id, quiz: Array.from({ length: 10 }, (_, i) => q(i)) })) };

test("a lesson test is exactly that lesson's own questions", () => {
  for (const id of ["l1", "l3"]) {
    const t = lessonTest(course, id);
    assert.equal(t.length, 10);
    assert.ok(t.every((x) => x.lessonId === id && !x.review));
  }
  assert.deepEqual(lessonTest(course, "nope"), []);
});

test("pass mark is 46/50 (92%)", () => {
  assert.equal(passMarkFor(50), 46);
  assert.equal(passMarkFor(25), 23);
});

import { findQuestion, mistakes, recentAccuracy, toPublic } from "../src/lib/learning-path.ts";

test("public items carry no answer key", () => {
  const pub = toPublic(lessonTest(course, "l2"));
  assert.ok(pub.every((p) => !("answer" in p) && !("q" in p)));
  assert.equal(pub.length, 10);
});

test("findQuestion resolves keys and rejects bad ones", () => {
  assert.equal(findQuestion(course, "l2#3").q.question, "q3");
  assert.equal(findQuestion(course, "l2#99"), undefined);
  assert.equal(findQuestion(course, "zz#1"), undefined);
});

test("mistakes keep only questions whose latest answer is wrong", () => {
  const rows = [
    { question_id: "a", correct: false, answered_at: "2026-01-01" },
    { question_id: "a", correct: true, answered_at: "2026-01-02" },
    { question_id: "b", correct: true, answered_at: "2026-01-01" },
    { question_id: "b", correct: false, answered_at: "2026-01-03" },
    { question_id: "c", correct: false, answered_at: "2026-01-02" },
  ];
  assert.deepEqual(mistakes(rows), ["c", "b"]);
  assert.equal(recentAccuracy(rows, 1).accuracy, 0);
  assert.equal(recentAccuracy(rows).answered, 5);
  assert.equal(recentAccuracy([]), null);
});

import { bestStars, levelOf, starsFor, xpTotal } from "../src/lib/gamification.ts";

test("stars: 46–47 → 1, 48–49 → 2, 50 → 3, below pass → 0", () => {
  assert.deepEqual([45, 46, 47, 48, 49, 50].map((c) => starsFor(c, 50)), [0, 1, 1, 2, 2, 3]);
  assert.deepEqual(bestStars([{ exam: "lesson:a", score: 46, total: 50 }, { exam: "lesson:a", score: 50, total: 50 }, { exam: "cp3p-foundation", score: 50, total: 50 }]), { a: 3 });
});

test("XP counts each question once and levels every 1000", () => {
  assert.equal(xpTotal({ correctQuestionIds: ["a", "a", "b"], lessonsPassed: 2, mocksPassed: 1 }), 20 + 200 + 300);
  assert.deepEqual(levelOf(2450), { level: 3, into: 450, next: 1000, progress: 0.45 });
});

import { safeNext } from "../src/lib/safe-next.ts";

test("safeNext blocks off-site redirects", () => {
  assert.equal(safeNext("/study/a/b"), "/study/a/b");
  for (const bad of ["//evil.com", "/\\evil.com", "/%5Cevil.com", "https://evil.com", "/%2F%2Fevil.com", "", null]) assert.equal(safeNext(bad), undefined, String(bad));
});
