/**
 * Assessment → practical stockpile & weekly moves.
 * Plain language. No jargon.
 */
import type { AssessmentAnswers } from "@/types";
import { buildBreakPoints, orderByShortestClock } from "@/lib/break-point";

export type PlanMove = {
  id: string;
  title: string;
  why: string;
  minutes: string;
  href: string;
  priority: number;
  layer: "now" | "90d" | "1yr";
  clockId?: string;
};

const CLOCK_ACTIONS: Record<string, (a: AssessmentAnswers) => PlanMove> = {
  financial: (a) => {
    const days = Math.round((a.emergency_fund_months || 0) * 30);
    return {
      id: "buffer",
      title:
        days < 14
          ? "Set aside cash for 1–2 weeks of essentials"
          : "Grow your cash reserve toward 3 months of essentials",
      why:
        days <= 0
          ? "You have almost nothing set aside yet. Even a small labeled envelope for food and transport starts the pile."
          : `You have about ${days} days covered. Keep adding until you can last ~90 days without income.`,
      minutes: "15 min",
      href: "/app/situation",
      priority: 100,
      layer: "now",
      clockId: "financial",
    };
  },
  payment: () => ({
    id: "pay",
    title: "Test a second way to pay this week",
    why: "If your main card or app fails, you still need to buy food and fuel. Keep cash or a second rail ready.",
    minutes: "20 min",
    href: "/app/situation",
    priority: 98,
    layer: "now",
    clockId: "payment",
  }),
  digital: (a) => {
    if (!a.has_offline_docs) {
      return {
        id: "docs",
        title: "Print or save ID copies you can reach offline",
        why: "If your phone or cloud is gone, you still need ID and account recovery. Paper or a USB beats nothing.",
        minutes: "12 min",
        href: "/app/situation",
        priority: 97,
        layer: "now",
        clockId: "digital",
      };
    }
    return {
      id: "phone",
      title: "Write what you would do if your phone is gone",
      why: "Banking, codes, and family contacts often live in one device. Note a backup path on paper.",
      minutes: "10 min",
      href: "/app/situation",
      priority: 96,
      layer: "now",
      clockId: "digital",
    };
  },
  food: (a) => {
    const food = a.food_buffer_days || 0;
    return {
      id: "food",
      title:
        food < 14
          ? "Stock meals you already eat for the next 2–4 weeks"
          : "Build toward 90 days of normal meals on the shelf",
      why:
        food <= 3
          ? "Almost no food reserve on file. Buy what your household already cooks — not specialty kits."
          : `About ${food} days of food noted. Keep stacking the same meals until you hit 90 days.`,
      minutes: "30 min",
      href: "/app/prepare?tab=stock",
      priority: 95,
      layer: "now",
      clockId: "food",
    };
  },
};

export function planMovesFromAssessment(a: AssessmentAnswers): PlanMove[] {
  const clocks = orderByShortestClock(buildBreakPoints(a));
  const moves: PlanMove[] = [];
  const seen = new Set<string>();

  for (const c of clocks) {
    const factory = CLOCK_ACTIONS[c.id];
    if (!factory) continue;
    const m = factory(a);
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    moves.push(m);
  }

  if ((a.income_sources || 1) <= 1 && !seen.has("income")) {
    moves.push({
      id: "income",
      title: "Note one backup way to earn",
      why: "One paycheck is one point of failure. Write a skill, side offer, or person you could call.",
      minutes: "12 min",
      href: "/app/prepare?tab=journal",
      priority: 90,
      layer: "90d",
    });
    seen.add("income");
  }

  if (!seen.has("meds")) {
    moves.push({
      id: "meds",
      title: "Check first-aid and any critical meds",
      why: "Small injuries and missed refills get expensive when travel is hard. Restock what you use.",
      minutes: "15 min",
      href: "/app/prepare?tab=stock",
      priority: 70,
      layer: "90d",
    });
  }

  if (!a.has_offline_contacts && !seen.has("contacts")) {
    moves.push({
      id: "contacts",
      title: "Write three important numbers on paper",
      why: "When the network is quiet, paper still works. Family, doctor, one trusted neighbor.",
      minutes: "8 min",
      href: "/app/prepare?tab=journal",
      priority: 65,
      layer: "90d",
    });
  }

  if ((a.offline_value_store || 0) <= 0 && !seen.has("offline-value")) {
    moves.push({
      id: "offline-value",
      title: "Keep a small cash float at home",
      why: "If cards fail for days, cash still buys food and transport. Start small and label it.",
      minutes: "15 min",
      href: "/app/offline-value",
      priority: 55,
      layer: "1yr",
    });
  }

  if (moves.length === 0) {
    moves.push({
      id: "maintain",
      title: "Rotate stock and re-check dates",
      why: "Your basics look solid. Use oldest food first, recharge power banks, and update the list.",
      minutes: "20 min",
      href: "/app/prepare?tab=stock",
      priority: 40,
      layer: "1yr",
    });
  }

  return moves.sort((x, y) => y.priority - x.priority);
}

export function topThreeActions(a: AssessmentAnswers): PlanMove[] {
  return planMovesFromAssessment(a).slice(0, 3);
}

export function runwayStory(a: AssessmentAnswers): string {
  const days = Math.round((a.emergency_fund_months || 0) * 30);
  if (days <= 0)
    return "Cash reserve is empty on file. Start with food and transport money for one week.";
  if (days < 14)
    return `About ${days} days of essentials covered if income stops. Keep adding.`;
  if (days < 90)
    return `About ${days} days of cash runway. Aim for ~90 days, then a full year habit.`;
  return `About ${days} days of cash runway — strong. Keep it labeled and untouched.`;
}

export function foodStory(a: AssessmentAnswers): string {
  const d = a.food_buffer_days || 0;
  if (d <= 3) return `Only about ${d} days of food noted. Stock meals you already cook.`;
  if (d < 30) return `About ${d} days of food on the shelf. Push toward 90 days of normal meals.`;
  if (d < 90) return `About ${d} days of food. Keep stacking the same staples.`;
  return `About ${d} days of food — solid. Date everything and rotate so nothing is wasted.`;
}

export function yearPlanSummary(a: AssessmentAnswers): string {
  const clocks = orderByShortestClock(buildBreakPoints(a));
  const shortest = clocks[0];
  const gaps: string[] = [];
  if ((a.emergency_fund_months || 0) * 30 < 90) gaps.push("cash for essentials");
  if ((a.food_buffer_days || 0) < 90) gaps.push("food on the shelf");
  if (!a.alt_payment_method) gaps.push("a second way to pay");
  if (!a.has_offline_docs) gaps.push("offline ID copies");
  if (gaps.length === 0) {
    return "Keep what works: rotate stock, test payments, meet offline once a quarter.";
  }
  return `Biggest gap: ${shortest.label} (${shortest.value}). This month focus on ${gaps.slice(0, 3).join(", ")}.`;
}
