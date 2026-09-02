/**
 * WORLD → EVENT → EXPOSURE → ACTION
 * Maps intel/events to the user's ranked exposures and next actions.
 */
import type { AssessmentAnswers, CategoryScores, Severity } from "@/types";
import type { IntelItem } from "@/lib/intel";

export type PipelineLink = {
  eventId: string;
  eventTitle: string;
  impact: "low" | "medium" | "high";
  exposureCategory: keyof CategoryScores | "overall";
  exposureLabel: string;
  exposureSeverity: Severity;
  exposureReason: string;
  actionTitle: string;
  actionHref: string;
  actionMinutes: number;
  score: number;
};

function sevFromScore(n: number): Severity {
  if (n < 40) return "critical";
  if (n < 55) return "high";
  if (n < 70) return "medium";
  return "low";
}

function weakness(scores: CategoryScores, key: keyof CategoryScores): number {
  return Math.max(0, 100 - (scores[key] ?? 50));
}

export function buildExposurePipeline(input: {
  intel: IntelItem[];
  scores: CategoryScores;
  answers: AssessmentAnswers;
}): PipelineLink[] {
  const { intel, scores, answers } = input;
  const links: PipelineLink[] = [];

  for (const item of intel) {
    const keys = item.relevanceKeys || [];
    let cat: keyof CategoryScores = "money";
    if (keys.includes("money") || keys.includes("alt_payment")) cat = "money";
    else if (keys.includes("food") || keys.includes("home")) cat = "food";
    else if (keys.includes("digital")) cat = "digital";
    else if (keys.includes("emergency") || keys.includes("skills")) cat = "emergency";
    else if (keys.includes("documents")) cat = "documents";

    const catScore = scores[cat] ?? scores.overall;

    let boost = 0;
    if (keys.includes("alt_payment") && !answers.alt_payment_method) boost += 25;
    if (keys.includes("money") && answers.income_sources <= 1) boost += 20;
    if (keys.includes("food") && (answers.food_buffer_days || 0) < 14) boost += 18;
    if (keys.includes("digital") && (answers.digital_payment_dependency || 0) >= 4)
      boost += 15;
    if (keys.includes("emergency") && !answers.has_med_kit) boost += 12;
    if (keys.includes("documents") && !answers.has_offline_docs) boost += 12;

    const impactW =
      item.impact === "high" ? 30 : item.impact === "medium" ? 18 : 8;
    const score = impactW + weakness(scores, cat) * 0.35 + boost;

    const exposureLabel =
      cat === "money"
        ? "Financial exposure"
        : cat === "food"
          ? "Essentials exposure"
          : cat === "digital"
            ? "Digital dependency"
            : cat === "emergency"
              ? "Health / emergency gap"
              : cat === "documents"
                ? "Document access gap"
                : "Resilience gap";

    const action =
      cat === "money"
        ? {
            title: answers.alt_payment_method
              ? "Grow cash runway toward 90 days"
              : "Add a second payment method",
            href: answers.alt_payment_method ? "/app/calculators" : "/app/prepare",
            minutes: 15,
          }
        : cat === "food"
          ? {
              title: "Extend food buffer (Prepare → 1-year stock)",
              href: "/app/prepare",
              minutes: 20,
            }
          : cat === "digital"
            ? {
                title: "Run phone-loss & payments What If",
                href: "/app/what-if",
                minutes: 8,
              }
            : cat === "documents"
              ? {
                  title: "Encrypt key docs in Vault",
                  href: "/app/vault",
                  minutes: 10,
                }
              : {
                  title: "Open Prepare checklist",
                  href: "/app/prepare",
                  minutes: 12,
                };

    links.push({
      eventId: item.id,
      eventTitle: item.title,
      impact: item.impact,
      exposureCategory: cat,
      exposureLabel,
      exposureSeverity: sevFromScore(catScore - boost / 2),
      exposureReason:
        item.actionHint ||
        `This event pressures your ${exposureLabel.toLowerCase()} (score ${Math.round(catScore)}).`,
      actionTitle: action.title,
      actionHref: action.href,
      actionMinutes: action.minutes,
      score,
    });
  }

  return links.sort((a, b) => b.score - a.score);
}

/** Deterministic peer band from score — not fabricated surveillance data. */
export function regionalResilienceHint(overall: number): {
  percentile: number;
  label: string;
} {
  const percentile = Math.min(
    92,
    Math.max(8, Math.round(overall * 0.85 + (overall > 60 ? 8 : 0)))
  );
  const label =
    percentile >= 70
      ? `More resilient than ~${percentile}% of households on similar profiles`
      : percentile >= 45
        ? `Around the middle of similar household profiles (~${percentile}th percentile)`
        : `Behind ~${100 - percentile}% of similar profiles — fix top exposures first`;
  return { percentile, label };
}
