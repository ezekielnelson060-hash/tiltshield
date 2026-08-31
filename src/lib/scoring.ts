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
      `Emergency food covers roughly ${a.emergency_supply_weeks} week(s).`,
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
    current: () =>
      "Important documents are not reliably accessible offline.",
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
        : "Limited secondary skills documented for disruption scenarios.",
    next: "Identify one skill or side income path you can activate within 30 days.",
    target: "At least one backup income or high-value skill",
    difficulty: "Hard",
    impact: "High",
    weight: 1.1,
  },
  home: {
    title: "Household readiness gap",
    current: () =>
      "Home is not prepared for multi-day disruption of utilities or supply chains.",
    next: "Assemble a 72-hour home kit: water, light, basic medical, cash.",
    target: "72-hour household kit complete",
    difficulty: "Medium",
    impact: "High",
    weight: 1.0,
  },
  emergency: {
    title: "Short-term survival capacity",
    current: () =>
      "Current combination of cash, food, and alternatives leaves short windows of resilience.",
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
  switch (scenario) {
    case "income_stops": {
      const days = Math.round(answers.emergency_fund_months * 30);
      const severity =
        days < 14 ? "critical" : days < 45 ? "high" : days < 90 ? "medium" : "low";
      return {
        scenario,
        title: "What if my income stops?",
        summary: `You can currently operate for approximately ${days} days.`,
        detail:
          days < 30
            ? "Your emergency buffer is below the 30-day minimum most households need for job loss or disruption."
            : "You have a measurable runway. Stretching it toward 90 days sharply reduces stress and bad decisions.",
        severity,
        recommendation:
          days < 90
            ? "Open a dedicated buffer account and automate a weekly transfer until you hit 90 days of expenses."
            : "Maintain the buffer and review it quarterly.",
      };
    }
    case "banking_down": {
      const hasAlt = answers.alt_payment_method;
      return {
        scenario,
        title: "What if banking is unavailable for 72 hours?",
        summary: hasAlt
          ? "You have at least one alternative payment method."
          : "\u26a0\ufe0f You currently have no alternative payment method.",
        detail: hasAlt
          ? "Cash, secondary card, or other method reduces short outage risk."
          : "Most people discover this gap only when cards and apps stop working.",
        severity: hasAlt ? "low" : "critical",
        recommendation: hasAlt
          ? "Keep a small cash reserve refreshed and test the backup method once a quarter."
          : "Withdraw a modest cash reserve and store it securely. Add one non-primary payment option.",
      };
    }
    case "phone_lost": {
      const ok =
        answers.phone_backup_plan && answers.offline_contacts && answers.has_offline_docs;
      const partial =
        answers.phone_backup_plan || answers.offline_contacts || answers.has_offline_docs;
      return {
        scenario,
        title: "What if your phone is lost?",
        summary: ok
          ? "You have recovery paths for contacts and key documents."
          : partial
            ? "\u26a0\ufe0f Partial recovery plan \u2014 several critical accounts still depend on this device."
            : "\u26a0\ufe0f Critical accounts and contacts depend heavily on this single device.",
        detail:
          "Phone loss is one of the most common real-world disruptions. Offline contacts + 2FA backups + document copies close the gap.",
        severity: ok ? "low" : partial ? "high" : "critical",
        recommendation:
          "Write down recovery codes, print critical contacts, and confirm you can reset accounts from another device.",
      };
    }
    case "food_prices_double": {
      const monthlyFoodProxy = answers.monthly_expenses * 0.25;
      const extra = Math.round(monthlyFoodProxy);
      const coveredByBuffer =
        answers.emergency_fund_months * answers.monthly_expenses >= extra * 3;
      return {
        scenario,
        title: "What if food prices double?",
        summary: `Your estimated monthly food exposure roughly doubles by about the equivalent of ${extra.toLocaleString()} in current currency units.`,
        detail: coveredByBuffer
          ? "Your existing buffer can absorb several months of elevated prices."
          : "Without extra stores or buffer, higher prices force immediate lifestyle cuts.",
        severity: coveredByBuffer ? "medium" : "high",
        recommendation:
          "Increase non-perishable reserves and treat food storage as part of your emergency fund strategy.",
      };
    }
    default:
      return {
        scenario,
        title: "Unknown scenario",
        summary: "No data",
        detail: "",
        severity: "medium",
        recommendation: "",
      };
  }
}

export { ACTION_LIBRARY, pickTodaysMove } from "./actions";
