import type {
  AssessmentAnswers,
  CategoryScores,
  Vulnerability,
  WhatIfResult,
  WhatIfScenario,
} from "@/types";

/** Calculate 0-100 readiness scores per category */
export function calculateCategoryScores(
  a: AssessmentAnswers
): CategoryScores {
  const moneyBase = Math.min((a.emergency_fund_months / 6) * 100, 100);
  const money =
    a.income_sources <= 1 ? Math.max(0, moneyBase - 20) : moneyBase;

  const food =
    Math.min((a.emergency_supply_weeks / 4) * 70, 70) +
    Math.min((a.food_buffer_days / 14) * 30, 30);

  const digital =
    (a.has_offline_docs ? 40 : 0) +
    (a.phone_backup_plan ? 35 : 0) +
    ((6 - a.cloud_dependency) / 5) * 25;

  const communication =
    (a.offline_contacts ? 55 : 0) + (a.phone_backup_plan ? 45 : 0);

  const documents = a.has_offline_docs ? 90 : 15;

  const skills =
    (a.income_sources >= 2 ? 40 : 15) +
    (a.emergency_supply_weeks >= 2 ? 30 : 10) +
    (a.alt_payment_method ? 30 : 10);

  const home =
    Math.min((a.emergency_supply_weeks / 4) * 50, 50) +
    (a.has_offline_docs ? 25 : 0) +
    (a.alt_payment_method ? 25 : 0);

  const emergency =
    Math.min((a.emergency_fund_months / 3) * 35, 35) +
    Math.min((a.emergency_supply_weeks / 2) * 35, 35) +
    (a.alt_payment_method ? 15 : 0) +
    (a.offline_contacts ? 15 : 0);

  const scores = {
    money: clamp(money),
    food: clamp(food),
    digital: clamp(digital),
    communication: clamp(communication),
    documents: clamp(documents),
    skills: clamp(skills),
    home: clamp(home),
    emergency: clamp(emergency),
    overall: 0,
  };

  scores.overall = clamp(
    Object.values(scores).reduce((s, v) => s + v, 0) / 8
  );

  return scores;
}

function clamp(n: number) {
  return Math.round(Math.max(0, Math.min(100, n)));
}

const VULN_TEMPLATES: Record<
  string,
  {
    title: string;
    current: (a: AssessmentAnswers, score: number) => string;
    next: string;
    target: string;
    difficulty: Vulnerability["difficulty"];
    impact: Vulnerability["impact"];
    weight: number;
  }
> = {
  money: {
    title: "Financial dependency",
    current: (a) =>
      `You have ~${Math.round(a.emergency_fund_months * 30)} days of expenses covered.`,
    next: "Build an emergency buffer equal to at least 90 days of expenses.",
    target: "90 days of runway",
    difficulty: "Medium",
    impact: "Very High",
    weight: 1.5,
  },
  food: {
    title: "Food supply gap",
    current: (a) =>
      `Emergency food covers roughly ${a.emergency_supply_weeks} week(s); pantry buffer ~${a.food_buffer_days} day(s).`,
    next: "Stock a 30-day non-perishable food reserve for your household.",
    target: "30 days of food",
    difficulty: "Medium",
    impact: "High",
    weight: 1.3,
  },
  digital: {
    title: "Digital single point of failure",
    current: (a) =>
      a.has_offline_docs
        ? "Some offline copies exist, but cloud reliance is still high."
        : "Critical information lives only in the cloud or on one device.",
    next: "Create offline encrypted copies of identity, financial, and recovery documents.",
    target: "Full offline document set",
    difficulty: "Easy",
    impact: "High",
    weight: 1.2,
  },
  communication: {
    title: "Communication fragility",
    current: (a) =>
      a.offline_contacts
        ? "You have offline contacts, but recovery paths may still depend on one device."
        : "You have no offline list of critical contacts.",
    next: "Print or store offline a list of emergency contacts and recovery numbers.",
    target: "Offline contact sheet + alternate channel",
    difficulty: "Easy",
    impact: "High",
    weight: 1.2,
  },
  documents: {
    title: "Document accessibility",
    current: (a) =>
      a.has_offline_docs
        ? "You keep offline copies of important documents."
        : "Important documents are not reliably accessible offline.",
    next: "Download and securely store offline copies of IDs, insurance, deeds, and account recovery info.",
    target: "Encrypted offline vault of critical docs",
    difficulty: "Easy",
    impact: "High",
    weight: 1.1,
  },
  skills: {
    title: "Skill & income concentration",
    current: (a) =>
      a.income_sources <= 1
        ? "Income depends on a single source."
        : `You report ${a.income_sources} income sources — still document a disruption skill path.`,
    next: "Identify one skill or side income path you can activate within 30 days.",
    target: "At least one backup income or high-value skill",
    difficulty: "Hard",
    impact: "High",
    weight: 1.1,
  },
  home: {
    title: "Household readiness gap",
    current: (a) =>
      `Emergency stores ~${a.emergency_supply_weeks} week(s). Home kit readiness still limited for multi-day disruption.`,
    next: "Assemble a 72-hour home kit: water, light, basic medical, cash.",
    target: "72-hour household kit complete",
    difficulty: "Medium",
    impact: "High",
    weight: 1.0,
  },
  emergency: {
    title: "Short-term survival capacity",
    current: (a) =>
      `Cash runway ~${Math.round(a.emergency_fund_months * 30)} days combined with food/payment backups.`,
    next: "Prioritize the highest-impact gap (usually money or food) this week.",
    target: "30-day self-sufficiency baseline",
    difficulty: "Medium",
    impact: "Very High",
    weight: 1.4,
  },
};

export function calculateVulnerabilities(
  answers: AssessmentAnswers,
  scores: CategoryScores
): Vulnerability[] {
  const categories = Object.keys(VULN_TEMPLATES) as (keyof typeof VULN_TEMPLATES)[];

  const ranked = categories
    .map((cat) => {
      const score = scores[cat as keyof CategoryScores] as number;
      const tpl = VULN_TEMPLATES[cat];
      const riskScore = (100 - score) * tpl.weight;
      return {
        category: cat as Vulnerability["category"],
        riskScore,
        score,
        tpl,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return ranked.map((item, idx) => {
    const severity: Vulnerability["severity"] =
      item.riskScore > 120
        ? "critical"
        : item.riskScore > 80
          ? "high"
          : item.riskScore > 40
            ? "medium"
            : "low";

    return {
      rank: idx + 1,
      category: item.category,
      title: item.tpl.title,
      severity,
      current_state: item.tpl.current(answers, item.score),
      next_action: item.tpl.next,
      target: item.tpl.target,
      difficulty: item.tpl.difficulty,
      impact: item.tpl.impact,
      is_resolved: false,
    };
  });
}

export function runWhatIf(
  scenario: WhatIfScenario,
  answers: AssessmentAnswers
): WhatIfResult {
  const expenses = Math.max(0, answers.monthly_expenses || 0);
  const months = Math.max(0, answers.emergency_fund_months || 0);
  const savings = months * expenses;
  const runwayDays = expenses > 0 ? Math.round(months * 30) : Math.round(months * 30);

  switch (scenario) {
    case "income_stops": {
      const severity =
        runwayDays < 14
          ? "critical"
          : runwayDays < 45
            ? "high"
            : runwayDays < 90
              ? "medium"
              : "low";
      const incomeNote =
        answers.income_sources <= 1
          ? " You depend on a single income source, so this scenario hits harder."
          : answers.income_sources === 2
            ? " Two income sources may cushion a partial loss, but a full stop still drains your buffer."
            : " Multiple income sources help, but a simultaneous stop still tests your cash runway.";
      return {
        scenario,
        title: "What if your income stopped today?",
        summary:
          runwayDays === 0
            ? "You have effectively no cash runway at your current expense level."
            : `You can operate for about ${runwayDays} days on savings alone.`,
        detail:
          expenses > 0
            ? `At $${expenses.toLocaleString()}/month essential spend and ~$${Math.round(savings).toLocaleString()} accessible savings, the math is savings ÷ daily burn.${incomeNote}`
            : `Set your essential monthly expenses in a new assessment so this number is precise.${incomeNote}`,
        severity,
        recommendation:
          runwayDays < 90
            ? `Target 90 days of expenses (about $${Math.round(expenses * 3).toLocaleString()}). Open a dedicated buffer and automate a small weekly transfer until you get there.`
            : "Maintain at least 90 days of expenses and review the number every quarter.",
      };
    }
    case "banking_down": {
      const hasAlt = answers.alt_payment_method;
      return {
        scenario,
        title: "What if banking is down for 72 hours?",
        summary: hasAlt
          ? "You reported an alternative payment method you can actually use."
          : "You have no alternative payment method if cards and bank apps fail.",
        detail: hasAlt
          ? "Cash, a second card, or another tested method covers short outages. Confirm it still works this month."
          : "For 72 hours you could not pay transport or food without a backup. This is one of the most common real disruptions.",
        severity: hasAlt ? "low" : "critical",
        recommendation: hasAlt
          ? "Keep a modest cash reserve refreshed and test your backup method once a quarter."
          : "Today: withdraw a cash reserve you can store safely, and activate one non-primary card or payment option. Test both.",
      };
    }
    case "phone_lost": {
      const recovery = [
        answers.phone_backup_plan ? "account recovery plan" : null,
        answers.offline_contacts ? "offline contacts" : null,
        answers.has_offline_docs ? "offline documents" : null,
      ].filter(Boolean) as string[];
      const missing = [
        !answers.phone_backup_plan ? "2FA / account recovery" : null,
        !answers.offline_contacts ? "offline contact list" : null,
        !answers.has_offline_docs ? "offline document copies" : null,
      ].filter(Boolean) as string[];
      const ok = recovery.length === 3;
      const partial = recovery.length > 0;
      return {
        scenario,
        title: "What if your phone was lost today?",
        summary: ok
          ? "You have recovery paths for accounts, contacts, and documents."
          : partial
            ? `Partial protection — you have ${recovery.join(", ")}. Still missing: ${missing.join(", ")}.`
            : "Critical accounts, contacts, and documents still depend on this one device.",
        detail: ok
          ? "Losing the handset would be painful but recoverable."
          : "Phone loss is common. Without offline contacts and recovery codes, banking, email, and identity recovery stall for days.",
        severity: ok ? "low" : partial ? "high" : "critical",
        recommendation: missing.length
          ? `Do this next: fix ${missing[0]}. Export recovery codes, write key numbers on paper, and keep offline copies of IDs.`
          : "Re-test recovery from a second device every six months.",
      };
    }
    case "food_prices_double": {
      const monthlyFood = Math.round(expenses * 0.25);
      const extra = monthlyFood;
      const bufferCash = savings;
      const monthsCovered = extra > 0 ? Math.floor(bufferCash / extra) : 99;
      const pantryDays = Math.max(0, answers.food_buffer_days || 0);
      const supplyWeeks = Math.max(0, answers.emergency_supply_weeks || 0);
      return {
        scenario,
        title: "What if food prices doubled?",
        summary:
          expenses > 0
            ? `Your food line roughly jumps by about $${extra.toLocaleString()} per month (≈25% of essential spend).`
            : "Add monthly expenses in your assessment to size food exposure in dollars.",
        detail: `You currently report ~${pantryDays} days of food on hand and ~${supplyWeeks} weeks of emergency stores. Your cash buffer covers roughly ${monthsCovered} month(s) of that extra food cost before other essentials suffer.`,
        severity:
          monthsCovered >= 6 && pantryDays >= 14
            ? "low"
            : monthsCovered >= 3 || pantryDays >= 7
              ? "medium"
              : "high",
        recommendation:
          pantryDays < 14
            ? `Build toward 14+ days of food you already eat, then expand shelf-stable stores. The extra $${extra.toLocaleString()}/month pressure is real if prices spike.`
            : "Keep rotating pantry stock and treat food reserves as part of your emergency fund, not optional.",
      };
    }
    default:
      return {
        scenario,
        title: "Scenario",
        summary: "Unavailable",
        detail: "",
        severity: "medium",
        recommendation: "Re-run your assessment.",
      };
  }
}

export { ACTION_LIBRARY, pickTodaysMove } from "./actions";
