import assert from "node:assert/strict";
import test from "node:test";
import { calculateGoalContribution, calculateLoanPayment, calculateSavings } from "../src/lib/calculators.ts";

// Independent ledger simulation: interest first, then the month-end cash flow.
function accumulate(principal, monthly, annualRate, months) {
  let balance = principal;
  for (let month = 0; month < months; month++) {
    balance += balance * annualRate / 1200;
    balance += monthly;
  }
  return balance;
}

function close(actual, expected, tolerance = 0.01) {
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) < tolerance,
    `Expected ${expected}, got ${actual}`);
}

test("CALC-01: monthly contributions grow with monthly compounding", () => {
  const actual = calculateSavings({ principal: 5_000_000, monthly: 200_000, annualRate: 15, months: 60 });
  close(actual, 28_250_808.29);
  close(actual, accumulate(5_000_000, 200_000, 15, 60));
  assert.ok(actual > 17_000_000);
});

test("CALC-02: contributions reach the target including growth of current savings", () => {
  const needed = calculateGoalContribution({ goal: 20_000_000, current: 2_000_000, annualRate: 15, months: 24 });
  close(accumulate(2_000_000, needed, 15, 24), 20_000_000);
  assert.ok(accumulate(2_000_000, Math.ceil(needed), 15, 24) >= 20_000_000);
  assert.ok(accumulate(2_000_000, Math.ceil(needed) - 1, 15, 24) < 20_000_000);
});

test("CALC-03: fixed loan payments amortize the balance", () => {
  for (const annualRate of [0, 0.000001, 22, 60]) {
    for (const months of [1, 24, 120]) {
      const payment = calculateLoanPayment({ amount: 10_000_000, annualRate, months });
      close(accumulate(10_000_000, -payment, annualRate, months), 0);
    }
  }
});

test("zero rates produce simple totals and payments", () => {
  assert.equal(calculateSavings({ principal: 500, monthly: 100, annualRate: 0, months: 12 }), 1700);
  assert.equal(calculateGoalContribution({ goal: 1700, current: 500, annualRate: 0, months: 12 }), 100);
  assert.equal(calculateLoanPayment({ amount: 1200, annualRate: 0, months: 12 }), 100);
});

test("one month: new contributions do not earn interest yet", () => {
  close(calculateSavings({ principal: 1000, monthly: 100, annualRate: 12, months: 1 }), 1110);
  close(calculateGoalContribution({ goal: 1110, current: 1000, annualRate: 12, months: 1 }), 100);
});

test("savings agree with the ledger across UI boundaries and tiny rates", () => {
  for (const principal of [0, 5_000_000, 50_000_000]) {
    for (const monthly of [0, 200_000, 5_000_000]) {
      for (const annualRate of [0, 1e-10, 15, 50]) {
        for (const months of [1, 60, 360]) {
          const expected = accumulate(principal, monthly, annualRate, months);
          close(calculateSavings({ principal, monthly, annualRate, months }), expected,
            Math.max(0.01, expected * 1e-12));
        }
      }
    }
  }
});

test("goal contributions work for zero savings, tiny rates and long terms", () => {
  for (const current of [0, 2_000_000]) {
    for (const annualRate of [0, 1e-10, 15, 40]) {
      for (const months of [1, 24, 120]) {
        const needed = calculateGoalContribution({ goal: 500_000_000, current, annualRate, months });
        close(accumulate(current, needed, annualRate, months), 500_000_000);
      }
    }
  }
});

test("no contribution is required when current or future savings cover the goal", () => {
  for (const current of [1000, 1200]) {
    assert.equal(calculateGoalContribution({ goal: 1000, current, annualRate: 0, months: 12 }), 0);
  }
  assert.equal(calculateGoalContribution({ goal: 1100, current: 1000, annualRate: 12, months: 12 }), 0);
  assert.equal(calculateLoanPayment({ amount: 0, annualRate: 22, months: 24 }), 0);
});

const cases = [
  [calculateSavings, { principal: 5000, monthly: 200, annualRate: 15, months: 60 }],
  [calculateGoalContribution, { goal: 20000, current: 2000, annualRate: 15, months: 24 }],
  [calculateLoanPayment, { amount: 10000, annualRate: 22, months: 24 }],
];

test("invalid money, rates and durations are rejected instead of producing NaN", () => {
  for (const [calculate, valid] of cases) {
    for (const key of Object.keys(valid)) {
      for (const invalid of [-1, NaN, Infinity, -Infinity]) {
        assert.throws(() => calculate({ ...valid, [key]: invalid }), RangeError);
      }
    }
    for (const months of [0, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => calculate({ ...valid, months }), RangeError);
    }
  }
});

test("overflow is reported explicitly", () => {
  assert.throws(() => calculateSavings({ principal: Number.MAX_VALUE, monthly: 100, annualRate: 50, months: 360 }), RangeError);
  assert.throws(() => calculateGoalContribution({ goal: 1000, current: Number.MAX_VALUE, annualRate: 50, months: 360 }), RangeError);
  assert.throws(() => calculateLoanPayment({ amount: Number.MAX_VALUE, annualRate: 12000, months: 1 }), RangeError);
});
