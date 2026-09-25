import assert from "node:assert/strict";
import test from "node:test";
import { computeStreak, dayKey } from "../src/lib/day.ts";

test("kun chegarasi UTC+5: Toshkentda 00:30 — yangi kun", () => {
  // 2026-09-25 19:30 UTC = 26-sentyabr 00:30 Toshkent
  assert.equal(dayKey(new Date("2026-09-25T19:30:00Z")), "2026-09-26");
  assert.equal(dayKey(new Date("2026-09-25T18:30:00Z")), "2026-09-25");
});

test("streak: 23:30 va ertasi 00:30 — ikki xil kun, uzilmaydi", () => {
  const rows = [{ completed_at: "2026-09-25T18:30:00Z" }, { completed_at: "2026-09-25T19:30:00Z" }];
  // 25-sentyabr 23:30 va 26-sentyabr 00:30 (Toshkent) — bir soat farq, lekin ikki kun. UTC bo'yicha bitta kun bo'lib 1 chiqardi.
  assert.equal(computeStreak(rows, new Date("2026-09-26T06:00:00Z")), 2);
});

test("streak: kecha bo'lsa ham hisoblanadi, ikki kun oldin — nol", () => {
  const rows = [{ completed_at: "2026-09-25T10:00:00Z" }];
  assert.equal(computeStreak(rows, new Date("2026-09-26T10:00:00Z")), 1);
  assert.equal(computeStreak(rows, new Date("2026-09-27T10:00:00Z")), 0);
  assert.equal(computeStreak([], new Date()), 0);
});
