/**
 * Turn assessment answers into ordered moves.
 * Top 3 always fix the shortest clocks first.
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

const CLOCK_ACTIONS: Record<
  string,
  (a: AssessmentAnswers) => PlanMove
> = {
  financial: (a) => {
    const days = Math.round((a.emergency_fund_months || 0) * 30);
    return {
      id: "buffer",
      title:
        days < 14
          ? "Open a dedicated emergency buffer this week"
          : "Grow your buffer toward 90 days of essentials",
      why:
        days <= 0
          ? "Your financial clock is at zero. Even 3–7 days of labeled cash turns panic into a plan."
          : `Financial break point is about ${days} days. Stretch the runway before the next shock tests it.`,
      minutes: "15 min",
      href: "/app/calculators",
      priority: 100,
      layer: "now",
      clockId: "financial",
    };
  },
  payment: () => ({
    id: "pay",
    title: "Test a second way to pay",
    why: "Payment is often the shortest clock. If the primary rail fails, food and fuel still need a path.",
    minutes: "20 min",
    href: "/app/focus/money",
    priority: 98,
    layer: "now",
    clockId: "payment",
  }),
  digital: (a) => {
    if (!a.has_offline_docs) {
      return {
        id: "docs",
        title: "Put ID copies where you can reach them offline",
        why: "Digital break point is near zero. Offline ID and critical account recovery close that clock.",
        minutes: "12 min",
        href: "/app/vault",
        priority: 97,
        layer: "now",
        clockId: "digital",
      };
    }
    return {
      id: "phone",
      title: "Write a plan for if your phone is gone",
      why: "Banking, codes, and family often live in one device. A backup path protects all three.",
      minutes: "10 min",
      href: "/app/focus/digital",
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
          ? "Grow the food you already eat toward 90 days"
          : "Layer toward a full year of normal meals",
      why:
        food <= 3
          ? "Food break point is a few days. Build with meals your household already likes."
          : `About ${food} food days on file. Stretch toward 90, then a year with rotation.`,
      minutes: "30 min",
      href: "/app/prepare",
      priority: 94,
      layer: food < 90 ? "now" : "1yr",
      clockId: "food",
    };
  },
  income: () => ({
    id: "income-diversity",
    title: "Note one backup income path",
    why: "One income stream is a single point of failure. Write down a skill, side offer, or network you could activate.",
    minutes: "12 min",
    href: "/app/focus/skills",
    priority: 86,
    layer: "90d",
    clockId: "income",
  }),
};

export function planMovesFromAssessment(a: AssessmentAnswers): PlanMove[] {
  const clocks = orderByShortestClock(buildBreakPoints(a));
  const moves: PlanMove[] = [];
  const seen = new Set<string>();

  for (const bp of clocks) {
    if (bp.severity === "ok") continue;
    const factory = CLOCK_ACTIONS[bp.id];
    if (!factory) continue;
    const move = factory(a);
    if (seen.has(move.id)) continue;
    seen.add(move.id);
    moves.push({ ...move, priority: 100 - moves.length });
  }

  if (!a.has_med_kit && !seen.has("med")) {
    moves.push({
      id: "med",
      title: "Check your first-aid and critical meds",
      why: "Small injuries and missed refills become big problems when travel is hard.",
      minutes: "15 min",
      href: "/app/focus/skills",
      priority: 70,
      layer: "90d",
    });
  }
  if (!a.offline_contacts && !seen.has("people")) {
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
  if (!seen.has("offline-value")) {
    moves.push({
      id: "offline-value",
      title: "Know one offline-value option near you",
      why: "If cards fail for a long stretch, physical options matter — metals, local vendors, hardware wallets.",
      minutes: "15 min",
      href: "/app/offline-value",
      priority: 55,
      layer: "1yr",
    });
  }

  if (moves.length === 0) {
    moves.push({
      id: "maintain",
      title: "Deepen your year layers",
      why: "Your shortest clocks are solid. Add rotation, power, and a household meetup so it lasts.",
      minutes: "20 min",
      href: "/app/prepare",
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
  if (days <= 0) return "You have almost no cash runway on file yet. Build that first.";
  if (days < 14) return `About ${days} days of essentials if income paused. Stretch that.`;
  if (days < 90) return `About ${days} days of runway. The goal is closer to 90 days — then a full year.`;
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
  const clocks = orderByShortestClock(buildBreakPoints(a));
  const shortest = clocks[0];
  const gaps: string[] = [];
  if ((a.emergency_fund_months || 0) * 30 < 90) gaps.push("cash runway");
  if ((a.food_buffer_days || 0) < 90) gaps.push("food stock");
  if (!a.alt_payment_method) gaps.push("a second way to pay");
  if (!a.has_offline_docs) gaps.push("offline ID");
  if (gaps.length === 0) {
    return "Your year plan is about keeping what works — rotate stock, test payments, meet offline.";
  }
  return `Shortest clock: ${shortest.label} (${shortest.value}). Year plan focuses first on ${gaps.slice(0, 3).join(", ")}.`;
}
