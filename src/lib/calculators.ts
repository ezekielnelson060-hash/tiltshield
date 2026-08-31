/** Pure calculators — usable with or without a full assessment */

export type RunwayInput = {
  monthlyExpenses: number;
  liquidSavings: number;
  incomeSources: number;
};

export type RunwayResult = {
  days: number;
  months: number;
  dailyBurn: number;
  severity: "critical" | "high" | "medium" | "low";
  summary: string;
  targetSavings90: number;
  gapTo90: number;
};

export function calcRunway(input: RunwayInput): RunwayResult {
  const expenses = Math.max(0, input.monthlyExpenses || 0);
  const savings = Math.max(0, input.liquidSavings || 0);
  const dailyBurn = expenses > 0 ? expenses / 30 : 0;
  const days = dailyBurn > 0 ? Math.round(savings / dailyBurn) : 0;
  const months = expenses > 0 ? savings / expenses : 0;
  const severity =
    days < 14 ? "critical" : days < 45 ? "high" : days < 90 ? "medium" : "low";
  const targetSavings90 = expenses * 3;
  const gapTo90 = Math.max(0, targetSavings90 - savings);
  return {
    days,
    months: Math.round(months * 10) / 10,
    dailyBurn: Math.round(dailyBurn),
    severity,
    summary:
      days === 0
        ? "No measurable cash runway at this expense level."
        : `About ${days} days (${months.toFixed(1)} months) if income fully stops.`,
    targetSavings90: Math.round(targetSavings90),
    gapTo90: Math.round(gapTo90),
  };
}

export type FoodInput = {
  monthlyExpenses: number;
  pantryDays: number;
  emergencyWeeks: number;
  liquidSavings: number;
  diverseSources: boolean;
};

export type FoodResult = {
  monthlyFoodEstimate: number;
  doublePriceExtra: number;
  monthsExtraCovered: number;
  totalFoodDaysApprox: number;
  severity: "critical" | "high" | "medium" | "low";
  summary: string;
};

export function calcFood(input: FoodInput): FoodResult {
  const expenses = Math.max(0, input.monthlyExpenses || 0);
  const monthlyFood = Math.round(expenses * 0.25);
  const extra = monthlyFood;
  const savings = Math.max(0, input.liquidSavings || 0);
  const monthsExtra = extra > 0 ? Math.floor(savings / extra) : 99;
  const pantry = Math.max(0, input.pantryDays || 0);
  const weeks = Math.max(0, input.emergencyWeeks || 0);
  const totalDays = pantry + Math.round(weeks * 7);
  const severity =
    totalDays >= 30 && monthsExtra >= 3
      ? "low"
      : totalDays >= 14 || monthsExtra >= 2
        ? "medium"
        : totalDays >= 7
          ? "high"
          : "critical";
  return {
    monthlyFoodEstimate: monthlyFood,
    doublePriceExtra: extra,
    monthsExtraCovered: monthsExtra,
    totalFoodDaysApprox: totalDays,
    severity,
    summary: `~${totalDays} days of food on hand. Price-double adds ~$${extra.toLocaleString()}/mo; cash covers ~${monthsExtra} month(s) of that shock.${
      input.diverseSources
        ? " Multiple food sources help."
        : " Single-channel grocery risk is higher."
    }`,
  };
}

export type DigitalInput = {
  digitalDependency: number;
  hasAltPayment: boolean;
  offlineValue: number;
};

export type DigitalResult = {
  score: number;
  severity: "critical" | "high" | "medium" | "low";
  summary: string;
};

export function calcDigitalExposure(input: DigitalInput): DigitalResult {
  let exposure = (Math.min(5, Math.max(1, input.digitalDependency || 3)) - 1) * 20;
  if (!input.hasAltPayment) exposure += 15;
  if (input.offlineValue === 0) exposure += 15;
  else if (input.offlineValue === 1) exposure -= 5;
  else if (input.offlineValue === 2) exposure -= 10;
  else exposure -= 18;
  exposure = Math.round(Math.max(0, Math.min(100, exposure)));
  const severity =
    exposure >= 70
      ? "critical"
      : exposure >= 50
        ? "high"
        : exposure >= 30
          ? "medium"
          : "low";
  return {
    score: exposure,
    severity,
    summary:
      exposure >= 70
        ? "Day-to-day life leans hard on digital payment rails with little held outside them."
        : exposure >= 40
          ? "Mixed. Some backups exist, but a digital-only corridor would still stress you."
          : "You retain meaningful non-digital or self-custody options.",
  };
}

export type JobLossInput = {
  monthlyExpenses: number;
  liquidSavings: number;
  incomeSources: number;
};

export function calcJobLoss(input: JobLossInput) {
  const runway = calcRunway({
    monthlyExpenses: input.monthlyExpenses,
    liquidSavings: input.liquidSavings,
    incomeSources: input.incomeSources,
  });
  const severity =
    runway.days < 30 ? "critical" : runway.days < 90 ? "high" : "medium";
  return {
    ...runway,
    severity: severity as RunwayResult["severity"],
    summary: `Primary job loss is longer than a short outage. Liquid runway ≈ ${runway.days} days.${
      input.incomeSources <= 1
        ? " One income source = full stop until replaced."
        : ` ${input.incomeSources} sources may cushion a partial loss.`
    }`,
  };
}
