import type { AssessmentAnswers, CategoryScores } from "@/types";

export type BreakPoint = {
  id: string;
  label: string;
  /** Human-readable duration: "31 days", "24 hours", "0 days" */
  value: string;
  days: number;
  severity: "critical" | "high" | "watch" | "ok";
  meaning: string;
};

export type ExposureSnapshot = {
  exposure: number;
  significantDependencies: number;
  weakest: {
    key: string;
    label: string;
    score: number;
  } | null;
  /** Shortest clock — the break point that fails first */
  primary: BreakPoint;
  points: BreakPoint[];
  /** Ordered shortest → longest */
  clocks: BreakPoint[];
};

const CATEGORY_LABELS: Record<string, string> = {
  money: "Financial",
  food: "Food",
  health: "Health",
  digital: "Digital",
  home: "Home / power",
  community: "Community",
  skills: "Skills",
  mindset: "Mindset",
};

function fundDays(a: AssessmentAnswers): number {
  return Math.round((a.emergency_fund_months || 0) * 30);
}

function paymentBreakHours(a: AssessmentAnswers): number {
  if (a.alt_payment_method) return 72;
  return 24;
}

function digitalBreakDays(a: AssessmentAnswers): number {
  if (a.has_offline_docs && a.phone_backup_plan) return 14;
  if (a.has_offline_docs || a.phone_backup_plan) return 3;
  return 0;
}

function foodBreakDays(a: AssessmentAnswers): number {
  return Math.max(0, a.food_buffer_days || 0);
}

function incomeBreakDays(a: AssessmentAnswers): number {
  const sources = a.income_sources || 1;
  if (sources >= 3) return 90;
  if (sources === 2) return 45;
  return fundDays(a);
}

function severityFromDays(
  days: number,
  criticalAt: number,
  highAt: number
): BreakPoint["severity"] {
  if (days <= criticalAt) return "critical";
  if (days <= highAt) return "high";
  if (days <= highAt * 2) return "watch";
  return "ok";
}

function formatDays(days: number): string {
  if (days <= 0) return "0 days";
  if (days < 1) return "hours";
  if (days === 1) return "1 day";
  if (days < 60) return `${Math.round(days)} days`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

export function financialBreakPoint(a: AssessmentAnswers): BreakPoint {
  const days = fundDays(a);
  return {
    id: "financial",
    label: "Financial break point",
    value: formatDays(days),
    days,
    severity: severityFromDays(days, 7, 30),
    meaning:
      days <= 0
        ? "If primary income disappears and expenses stay the same, you have no cash runway on file."
        : `If your primary income disappears and expenses stay the same, current reserves reach zero in about ${formatDays(days)}.`,
  };
}

export function buildBreakPoints(a: AssessmentAnswers): BreakPoint[] {
  const financial = financialBreakPoint(a);
  const foodDays = foodBreakDays(a);
  const digiDays = digitalBreakDays(a);
  const payHours = paymentBreakHours(a);
  const incomeDays = incomeBreakDays(a);

  const payment: BreakPoint = {
    id: "payment",
    label: "Payment break point",
    value: a.alt_payment_method ? "72 hours" : "24 hours",
    days: payHours / 24,
    severity: a.alt_payment_method ? "watch" : "critical",
    meaning: a.alt_payment_method
      ? "You have a second way to pay. Stress-test it this week so it is not theoretical."
      : "One payment method. If that rail fails, you have roughly a day before everyday purchases become a problem.",
  };

  const digital: BreakPoint = {
    id: "digital",
    label: "Digital break point",
    value: formatDays(digiDays),
    days: digiDays,
    severity: severityFromDays(digiDays, 0, 3),
    meaning:
      digiDays === 0
        ? "No offline path to critical accounts or ID. Lose the phone, lose the system."
        : digiDays <= 3
          ? "Thin offline coverage. A device loss still cuts deep."
          : "You have offline copies and a phone backup path. Keep them current.",
  };

  const food: BreakPoint = {
    id: "food",
    label: "Food break point",
    value: formatDays(foodDays),
    days: foodDays,
    severity: severityFromDays(foodDays, 3, 14),
    meaning:
      foodDays <= 3
        ? "Almost no food buffer on file. A supply shock becomes a household problem immediately."
        : `About ${formatDays(foodDays)} of food you already eat. Stretch toward 90 days, then a year with rotation.`,
  };

  const income: BreakPoint = {
    id: "income",
    label: "Income concentration",
    value: formatDays(incomeDays),
    days: incomeDays,
    severity: severityFromDays(incomeDays, 14, 45),
    meaning:
      (a.income_sources || 1) <= 1
        ? "Single income stream. Your financial break point is the whole story."
        : "More than one income path noted. Still treat the primary as the stress case.",
  };

  return [financial, payment, digital, food, income];
}

/** Shortest clock first — the number people cannot stop thinking about. */
export function orderByShortestClock(points: BreakPoint[]): BreakPoint[] {
  return [...points].sort((a, b) => a.days - b.days);
}

export function countSignificantDependencies(
  a: AssessmentAnswers,
  scores?: CategoryScores | null
): number {
  let n = 0;
  if ((a.income_sources || 1) <= 1) n += 1;
  if (!a.alt_payment_method) n += 1;
  if (!a.has_offline_docs) n += 1;
  if (!a.phone_backup_plan) n += 1;
  if ((a.food_buffer_days || 0) < 14) n += 1;
  if ((a.emergency_fund_months || 0) < 1) n += 1;
  if (scores) {
    for (const [k, v] of Object.entries(scores)) {
      if (k === "overall") continue;
      if (typeof v === "number" && v < 40) n += 1;
    }
  }
  return n;
}

export function weakestCategory(
  scores: CategoryScores | null | undefined
): ExposureSnapshot["weakest"] {
  if (!scores) return null;
  let worst: { key: string; label: string; score: number } | null = null;
  for (const [key, val] of Object.entries(scores)) {
    if (key === "overall") continue;
    if (typeof val !== "number") continue;
    if (!worst || val < worst.score) {
      worst = {
        key,
        label: CATEGORY_LABELS[key] || key,
        score: val,
      };
    }
  }
  return worst;
}

export function buildExposureSnapshot(
  a: AssessmentAnswers | null | undefined,
  scores: CategoryScores | null | undefined
): ExposureSnapshot | null {
  if (!a) return null;
  const points = buildBreakPoints(a);
  const clocks = orderByShortestClock(points);
  const primary = clocks[0];
  const exposure = scores?.overall ?? 0;
  return {
    exposure,
    significantDependencies: countSignificantDependencies(a, scores),
    weakest: weakestCategory(scores),
    primary,
    points,
    clocks,
  };
}

export function breakPointShareText(snap: ExposureSnapshot): string {
  const c = snap.primary;
  return `My shortest clock on Tiltshield: ${c.label} — ${c.value}.\n\n"${c.meaning}"\n\nHow exposed are you? https://tiltshield.xyz/assessment`;
}

export async function shareBreakPoint(snap: ExposureSnapshot): Promise<boolean> {
  const text = breakPointShareText(snap);
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: "My Tiltshield break point",
        text,
        url: "https://tiltshield.xyz/assessment",
      });
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* cancelled */
  }
  return false;
}
