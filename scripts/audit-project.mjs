import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const calculatorText = fs.readFileSync(path.join(root, "src/lib/calculators.ts"), "utf8");
const calculatorJs = ts.transpileModule(calculatorText, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const calculatorContext = { exports: {} };
vm.runInNewContext(calculatorJs, calculatorContext);
const { calculateSavings, calculateGoalContribution, calculateLoanPayment } = calculatorContext.exports;
function accumulated(principal, contribution, annualRate, months) {
  let balance = principal;
  for (let i = 0; i < months; i++) balance = balance * (1 + annualRate / 1200) + contribution;
  return balance;
}
const results = [];
function record(id, actual, expected, assumptions) {
  results.push({ id, status: Math.abs(actual - expected) < 0.01 ? "PASS" : "FAIL", actual, expected, assumptions });
}
const compound = { principal: 5_000_000, monthly: 200_000, rate: 15, years: 5 };
record("CALC-01", calculateSavings({ principal: compound.principal, monthly: compound.monthly, annualRate: compound.rate, months: 60 }), accumulated(compound.principal, compound.monthly, compound.rate, 60), "Nominal annual rate, monthly compounding, contributions at month end, no fees/tax.");
const goal = { goal: 20_000_000, current: 2_000_000, months: 24, rate: 15 };
const needed = calculateGoalContribution({ goal: goal.goal, current: goal.current, annualRate: goal.rate, months: goal.months });
record("CALC-02", accumulated(goal.current, needed, goal.rate, goal.months), goal.goal, "Existing savings grow at the same rate; month-end contributions should reach the target without systematic overfunding.");
const credit = { amount: 10_000_000, rate: 22, months: 24 };
const monthlyRate = credit.rate / 1200;
const payment = calculateLoanPayment({ amount: credit.amount, annualRate: credit.rate, months: credit.months });
let debt = credit.amount;
for (let i = 0; i < credit.months; i++) debt = debt * (1 + monthlyRate) - payment;
record("CALC-03", debt, 0, "Fixed nominal annual loan rate divided by 12, equal month-end payments, no fees.");
const progressText = fs.readFileSync(path.join(root, "src/lib/progress.ts"), "utf8");
const progressAst = ts.createSourceFile("progress.ts", progressText, ts.ScriptTarget.Latest, true);
const extracted = ["dayKey", "computeStreak"].map((name) => progressAst.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === name).getText(progressAst)).join("\n");
const js = ts.transpileModule(extracted, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const fixedNow = Date.parse("2026-09-11T10:00:00Z");
class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : [fixedNow])); } static now() { return fixedNow; } }
const context = { exports: {}, Date: FixedDate };
vm.runInNewContext(js, context);
record("TIME-01", context.exports.computeStreak([{ completed_at: "2026-09-10T19:30:00Z" }, { completed_at: "2026-09-11T09:30:00Z" }]), 1, "Both completions occur on September 11 in Asia/Tashkent (UTC+5): only one active local day.");
const report = { scope: "Local formula and date-boundary audit; no database writes or paid AI requests.", generatedAt: new Date().toISOString(), results };
const destination = path.join(root, "docs/strategy/evidence/calculation-audit.json");
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
process.exitCode = results.some((result) => result.status === "FAIL") ? 1 : 0;
