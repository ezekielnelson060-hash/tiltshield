/**
 * Turn assessment answers into a short, ordered 1-year plan for this household.
 */
import type { AssessmentAnswers } from "@/types";

export type PlanMove = {
  id: string;
  title: string;
  why: string;
  minutes: string;
  href: string;
  priority: number;
};

export function planMovesFromAssessment(a: AssessmentAnswers): PlanMove[] {
  const food = a.food_buffer_days || 0;
  const fund = a.emergency_fund_months || 0;
  const digi = a.digital_payment_dependency || 3;
  const moves: PlanMove[] = [];

  if (fund < 1 || (a.monthly_expenses > 0 && fund * 30 < 14)) {
    moves.push({
      id: "buffer",
      title: "Start a small emergency buffer this week",
      why: "Right now a short pause in income would hit hard. Even a little set aside buys calm.",
      minutes: "15 min",
      href: "/app/calculators",
      priority: 100,
    });
  }

  if (!a.alt_payment_method || digi >= 4) {
    moves.push({
      id: "pay",
      title: "Test a second way to pay",
      why: "Most of your life may sit on one card or app. A backup path keeps food and fuel reachable.",
      minutes: "20 min",
      href: "/app/focus/money",
      priority: 95,
    });
  }

  if (food < 14) {
    moves.push({
      id: "food",
      title: "Grow the food you already eat toward 90 days",
      why:
        food <= 3
          ? "You only have a few days of food noted. Build with meals your household actually likes."
          : `You have about ${food} food days noted. Stretch toward 90, then a full year with rotation.`,
      minutes: "30 min",
      href: "/app/prepare",
      priority: 90,
    });
  }

  if (!a.has_offline_docs) {
    moves.push({
      id: "docs",
      title: "Put ID copies where you can reach them offline",
      why: "When accounts lag, paper and a locked Vault are how you still prove who you are.",
      minutes: "12 min",
      href: "/app/vault",
      priority: 85,
    });
  }

  if (!a.phone_backup_plan) {
    moves.push({
      id: "phone",
      title: "Write a plan for if your phone is gone",
      why: "Banking, codes, and family often live in one device. A backup path protects all three.",
      minutes: "10 min",
      href: "/app/focus/digital",
      priority: 82,
    });
  }

  if (!a.has_med_kit) {
    moves.push({
      id: "med",
      title: "Check your first-aid and critical meds",
      why: "Small injuries and missed refills become big problems when travel is hard.",
      minutes: "15 min",
      href: "/app/focus/skills",
      priority: 75,
    });
  }

  if (!a.has_local_vendors) {
    moves.push({
      id: "vendors",
      title: "Save three places near you that still work offline",
      why: "Pharmacy, food, and cash access you can reach without an app.",
      minutes: "15 min",
      href: "/app/nearby",
      priority: 70,
    });
  }

  if (!a.offline_contacts) {
    moves.push({
      id: "people",
      title: "Write three contacts on paper",
      why: "When the network is quiet, names and numbers on paper still work.",
      minutes: "8 min",
      href: "/app/family",
      priority: 65,
    });
  }

  if (moves.length === 0) {
    moves.push({
      id: "maintain",
      title: "Deepen your year layers",
      why: "Your baseline is solid. Add rotation, power, and a household meetup so it lasts.",
      minutes: "20 min",
      href: "/app/prepare",
      priority: 40,
    });
  }

  return moves.sort((x, y) => y.priority - x.priority).slice(0, 5);
}

export function runwayStory(a: AssessmentAnswers): string {
  const days = Math.round((a.emergency_fund_months || 0) * 30);
  if (days <= 0) {
    return "You have almost no cash runway on file yet. We'll build that first.";
  }
  if (days < 14) {
    return `About ${days} days of essentials if income paused. Let's stretch that.`;
  }
  if (days < 90) {
    return `About ${days} days of runway. The goal is closer to 90 days of calm.`;
  }
  return `About ${days} days of runway — strong. Keep it labeled and untouched.`;
}

export function foodStory(a: AssessmentAnswers): string {
  const d = a.food_buffer_days || 0;
  if (d <= 3) return `Only about ${d} food days noted. Start with meals you already cook.`;
  if (d < 30) return `About ${d} food days on file. Aim for 90 days of normal food next.`;
  if (d < 90) return `About ${d} food days. You're building toward a full season of meals.`;
  return `About ${d} food days — excellent. Keep dates on everything so nothing is wasted.`;
}
