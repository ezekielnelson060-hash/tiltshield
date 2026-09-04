/**
 * Turn assessment answers into a short, ordered 1-year plan for this household.
 * Copy is written to the user — plain, calm, specific.
 */
import type { AssessmentAnswers } from "@/types";

export type PlanMove = {
  id: string;
  title: string;
  why: string;
  minutes: string;
  href: string;
  priority: number;
  layer: "now" | "90d" | "1yr";
};

export function planMovesFromAssessment(a: AssessmentAnswers): PlanMove[] {
  const food = a.food_buffer_days || 0;
  const fund = a.emergency_fund_months || 0;
  const digi = a.digital_payment_dependency || 3;
  const income = a.monthly_income || 0;
  const expense = a.monthly_expenses || 0;
  const sources = a.income_sources || 1;
  const moves: PlanMove[] = [];

  if (fund < 1 || (expense > 0 && fund * 30 < 14)) {
    moves.push({
      id: "buffer",
      title: "Open a dedicated emergency buffer this week",
      why:
        income > 0
          ? "Your take-home is on file. Even 3–7 days of essentials set aside turns panic into a plan."
          : "A short pause in income hits hard without a labeled buffer. Start small this week.",
      minutes: "15 min",
      href: "/app/calculators",
      priority: 100,
      layer: "now",
    });
  } else if (fund < 3) {
    moves.push({
      id: "buffer-grow",
      title: "Grow your buffer toward 90 days of calm",
      why: `You have about ${Math.round(fund * 30)} days on file. Keep adding until three months of essentials feel boring.`,
      minutes: "10 min",
      href: "/app/calculators",
      priority: 88,
      layer: "90d",
    });
  }

  if (!a.alt_payment_method || digi >= 4) {
    moves.push({
      id: "pay",
      title: "Test a second way to pay",
      why: "If cards or one app go quiet, food and fuel still need a path. Cash, a second rail, or a trusted vendor.",
      minutes: "20 min",
      href: "/app/focus/money",
      priority: 95,
      layer: "now",
    });
  }

  if (sources <= 1) {
    moves.push({
      id: "income-diversity",
      title: "Note one backup income path",
      why: "One income stream is a single point of failure. Write down a skill, side offer, or network you could activate.",
      minutes: "12 min",
      href: "/app/focus/skills",
      priority: 86,
      layer: "90d",
    });
  }

  if (food < 14) {
    moves.push({
      id: "food",
      title: "Grow the food you already eat toward 90 days",
      why:
        food <= 3
          ? "You only have a few days of food noted. Build with meals your household already likes."
          : `You have about ${food} food days noted. Stretch toward 90, then a full year with rotation.`,
      minutes: "30 min",
      href: "/app/prepare",
      priority: 90,
      layer: "now",
    });
  } else if (food < 90) {
    moves.push({
      id: "food-year",
      title: "Layer toward a full year of normal meals",
      why: `About ${food} food days on file. Add what you already cook; date everything; rotate.`,
      minutes: "25 min",
      href: "/app/prepare",
      priority: 72,
      layer: "1yr",
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
      layer: "now",
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
      layer: "now",
    });
  }

  if (!a.has_med_kit) {
    moves.push({
      id: "med",
      title: "Check your first-aid and critical meds",
      why: "Small injuries and missed refills become big problems when travel is hard.",
      minutes: "15 min",
      href: "/app/focus/skills",
      priority: 78,
      layer: "90d",
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
      layer: "now",
    });
  }

  moves.push({
    id: "offline-value",
    title: "Know one offline-value option near you",
    why: "If cards fail for a long stretch, physical options matter — metals, local vendors, hardware wallets.",
    minutes: "15 min",
    href: "/app/offline-value",
    priority: fund < 1 ? 70 : 55,
    layer: "1yr",
  });

  if (moves.filter((m) => m.id !== "offline-value").length === 0) {
    moves.push({
      id: "maintain",
      title: "Deepen your year layers",
      why: "Your baseline is solid. Add rotation, power, and a household meetup so it lasts.",
      minutes: "20 min",
      href: "/app/prepare",
      priority: 40,
      layer: "1yr",
    });
  }

  return moves.sort((x, y) => y.priority - x.priority).slice(0, 6);
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

export function yearPlanSummary(a: AssessmentAnswers): string {
  const food = a.food_buffer_days || 0;
  const days = Math.round((a.emergency_fund_months || 0) * 30);
  const gaps: string[] = [];
  if (days < 90) gaps.push("cash runway");
  if (food < 90) gaps.push("food stock");
  if (!a.alt_payment_method) gaps.push("a second way to pay");
  if (!a.has_med_kit) gaps.push("med kit");
  if (gaps.length === 0) {
    return "Your year plan is about keeping what works — rotate stock, test payments, meet offline.";
  }
  return `Your year plan focuses first on ${gaps.slice(0, 3).join(", ")}.`;
}
