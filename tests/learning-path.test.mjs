import assert from "node:assert/strict";
import test from "node:test";
import { lessonTest, passMarkFor } from "../src/lib/learning-path.ts";

const q = (n) => ({ question: `q${n}`, options: ["a", "b", "c", "d"], answer: n % 4, explanation: "e" });
const course = { chapters: ["l1", "l2", "l3"].map((id) => ({ id, quiz: Array.from({ length: 10 }, (_, i) => q(i)) })) };

test("first lesson test has only its own 10 questions", () => {
  const t = lessonTest(course, "l1");
  assert.equal(t.length, 10);
  assert.ok(t.every((x) => !x.review));
});

test("later lessons add 2 review questions from earlier lessons, deterministically", () => {
  const t = lessonTest(course, "l3");
  assert.equal(t.length, 12);
  const reviews = t.filter((x) => x.review);
  assert.equal(reviews.length, 2);
  assert.ok(reviews.every((x) => x.lessonId === "l1" || x.lessonId === "l2"));
  assert.notEqual(reviews[0].key, reviews[1].key);
  assert.deepEqual(lessonTest(course, "l3").map((x) => x.key), t.map((x) => x.key));
});

test("pass mark is 80%", () => {
  assert.equal(passMarkFor(10), 8);
  assert.equal(passMarkFor(12), 10);
});

import { findQuestion, mistakes, recentAccuracy, toPublic } from "../src/lib/learning-path.ts";

test("public items carry no answer key", () => {
  const pub = toPublic(lessonTest(course, "l2"));
  assert.ok(pub.every((p) => !("answer" in p) && !("q" in p)));
  assert.equal(pub.length, 12);
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
