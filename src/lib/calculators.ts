/**
 * Fixed nominal annual rates (%), divided by 12. Savings compound monthly;
 * contributions and loan payments occur at month end. No fees, tax or inflation.
 * Keep full precision here; round only when displaying results.
 */
function nonNegative(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite, non-negative number`);
  }
}

function monthlyRate(annualRate: number, months: number) {
  nonNegative("annualRate", annualRate);
  if (!Number.isSafeInteger(months) || months <= 0) {
    throw new RangeError("months must be a positive integer");
  }
  return annualRate / 1200;
}

function finiteResult(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("Calculation exceeds the supported numeric range");
  }
  return value;
}

function savingsFactors(rate: number, months: number) {
  // log1p/expm1 avoid cancellation for very small positive rates.
  const growthMinusOne = Math.expm1(months * Math.log1p(rate));
  return {
    growth: finiteResult(1 + growthMinusOne),
    contributions: rate === 0 ? months : growthMinusOne / rate,
  };
}

export function calculateSavings({ principal, monthly, annualRate, months }: {
  principal: number; monthly: number; annualRate: number; months: number;
}) {
  nonNegative("principal", principal);
  nonNegative("monthly", monthly);
  const factors = savingsFactors(monthlyRate(annualRate, months), months);
  return finiteResult(principal * factors.growth + monthly * factors.contributions);
}

export function calculateGoalContribution({ goal, current, annualRate, months }: {
  goal: number; current: number; annualRate: number; months: number;
}) {
  nonNegative("goal", goal);
  nonNegative("current", current);
  const factors = savingsFactors(monthlyRate(annualRate, months), months);
  const futureCurrent = finiteResult(current * factors.growth);
  return finiteResult(Math.max((goal - futureCurrent) / factors.contributions, 0));
}

export function calculateLoanPayment({ amount, annualRate, months }: {
  amount: number; annualRate: number; months: number;
}) {
  nonNegative("amount", amount);
  const rate = monthlyRate(annualRate, months);
  return finiteResult(rate === 0
    ? amount / months
    : amount * rate / -Math.expm1(-months * Math.log1p(rate)));
}
