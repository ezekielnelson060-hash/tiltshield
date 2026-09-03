/**
 * Translate a news/intel item into what it means for THIS household.
 */
import type { AssessmentAnswers, CategoryScores } from "@/types";

export function meaningForYou(
  item: {
    category?: string;
    relevanceKeys?: string[];
    title?: string;
    impact?: string;
  },
  answers?: AssessmentAnswers | null,
  scores?: CategoryScores | null
): string {
  if (!answers) {
    return "Finish your assessment so we can say exactly how this touches your household.";
  }

  const keys = (item.relevanceKeys || []).map((k) => k.toLowerCase());
  const cat = (item.category || "").toLowerCase();
  const title = (item.title || "").toLowerCase();
  const food = answers.food_buffer_days || 0;
  const fundDays = Math.round((answers.emergency_fund_months || 0) * 30);
  const digi = answers.digital_payment_dependency || 3;
  const moneyScore = scores?.money ?? 50;

  const isMoney =
    keys.some((k) => ["money", "alt_payment", "digital"].includes(k)) ||
    /financial|bank|payment|currency|cbdc|cash/.test(cat + title);
  const isFood =
    keys.some((k) => k.includes("food")) ||
    /essential|food|grocery|supply/.test(cat + title);
  const isHealth =
    keys.some((k) => ["emergency", "skills"].includes(k)) ||
    /health|pharma|medicine|medical/.test(cat + title);
  const isEnergy =
    keys.some((k) => ["home", "emergency"].includes(k)) ||
    /energy|grid|power|blackout|outage/.test(cat + title);

  if (isMoney) {
    if (!answers.alt_payment_method || digi >= 4) {
      return `You lean on digital pay. A payment or bank shock would hit you hard until a second rail is ready. Cash runway on file: ~${fundDays || 0} days.`;
    }
    if (fundDays < 14) {
      return `Your buffer is thin (~${fundDays} days). Stories like this are a nudge to grow essentials cash before stress arrives.`;
    }
    if (moneyScore < 50) {
      return `Money readiness is still building. This kind of signal is exactly why a labeled buffer and a tested backup pay path matter.`;
    }
    return `You have some cushion (~${fundDays} days). Stay sharp: keep backup pay tested and the buffer labeled.`;
  }

  if (isFood) {
    if (food < 14) {
      return `Only about ${food} food days on file. Price or supply news is a direct prompt to deepen the pantry with food you already eat.`;
    }
    if (food < 90) {
      return `About ${food} food days noted. Use this signal to push toward 90 days of normal meals, dated and rotated.`;
    }
    return `Food depth looks solid (~${food} days). Check rotation dates so stock stays useful.`;
  }

  if (isHealth) {
    if (!answers.has_med_kit) {
      return `No first-aid depth on file. Health-supply headlines are a reminder to open the kit and plan critical refills early.`;
    }
    return `Med kit is on file. Confirm refill timing and pin a pharmacy you can reach without an app.`;
  }

  if (isEnergy) {
    return answers.has_med_kit && food >= 14
      ? `You have some home baseline. Still: light, power banks, and fridge discipline matter when the grid blinks.`
      : `Grid stress multiplies thin food, light, and meds. Prioritize power banks, water, and a simple 72-hour kit.`;
  }

  if ((answers.income_sources || 1) <= 1) {
    return `Single income path on file. World stress often shows up as income or price pressure first — widen options when you can.`;
  }

  return `We mapped this to your plan. Open What If or Prepare to turn the headline into a concrete next step.`;
}
