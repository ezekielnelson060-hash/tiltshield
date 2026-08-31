import type {
  AssessmentAnswers,
  CategoryScores,
  Vulnerability,
} from "@/types";

/** Calculate 0-100 readiness scores per category */
export function calculateCategoryScores(
  a: AssessmentAnswers
): CategoryScores {
  const moneyBase = Math.min((a.emergency_fund_months / 6) * 100, 100);
  let money =
    a.income_sources <= 1 ? Math.max(0, moneyBase - 20) : moneyBase;
  if ((a.offline_value_store || 0) >= 3) money = Math.min(100, money + 18);
  else if ((a.offline_value_store || 0) === 2) money = Math.min(100, money + 12);
  else if ((a.offline_value_store || 0) === 1) money = Math.min(100, money + 8);
  if ((a.digital_payment_dependency || 3) >= 4 && !a.alt_payment_method) {
    money = Math.max(0, money - 12);
  }

  let food =
    Math.min((a.emergency_supply_weeks / 4) * 70, 70) +
    Math.min((a.food_buffer_days / 14) * 30, 30);
  if (a.food_source_diversity) food = Math.min(100, food + 10);

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
    current: (a) => {
      const days = Math.round(a.emergency_fund_months * 30);
      const off =
        (a.offline_value_store || 0) >= 3
          ? " You also hold cash and self-custody value outside pure bank apps."
          : (a.offline_value_store || 0) === 2
            ? " You hold some self-custody (e.g. hardware wallet) outside bank apps."
            : (a.offline_value_store || 0) === 1
              ? " You keep some cash outside the banking app."
              : " Almost all value sits in banks or apps.";
      return `You have ~${days} days of expenses covered.${off}`;
    },
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
        : `You report ${a.income_sources} income sources \u2014 still document a disruption skill path.`,
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

export { runWhatIf } from "./whatif";
export { ACTION_LIBRARY, pickTodaysMove } from "./actions";
