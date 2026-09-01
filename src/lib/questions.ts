export type QuestionType = "slider" | "number" | "boolean" | "choice";

export interface Question {
  id: keyof import("@/types").AssessmentAnswers;
  title: string;
  help?: string;
  type: QuestionType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  choices?: { label: string; value: number | boolean }[];
}

/** Personal Resilience Intelligence — second-person, global, system-focused */
export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "monthly_income",
    title: "What is your primary take-home income each month?",
    help: "What actually lands — salary, business draws, reliable side income. Your resilience plan starts here.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "monthly_expenses",
    title: "What are your essential expenses each month?",
    help: "Housing, food, utilities, transport, minimum debt payments — not optional lifestyle spend.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "emergency_fund_months",
    title: "How many months of essentials could your savings cover today?",
    help: "Liquid money you could access within a few days — not locked investments.",
    type: "slider",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "months",
  },
  {
    id: "income_sources",
    title: "How many independent income sources do you have?",
    help: "Each source that can pay on its own reduces single-point exposure.",
    type: "choice",
    choices: [
      { label: "1 — single source", value: 1 },
      { label: "2 — two sources", value: 2 },
      { label: "3 or more", value: 3 },
    ],
  },
  {
    id: "offline_value_store",
    title: "Do you hold value outside a single bank or app?",
    help: "Cash you control, self-custody digital assets, or both — if one institution freezes, something remains.",
    type: "choice",
    choices: [
      { label: "No — almost everything is in banks or apps", value: 0 },
      { label: "Yes — cash reserve", value: 1 },
      { label: "Yes — self-custody digital assets", value: 2 },
      { label: "Yes — both cash and self-custody", value: 3 },
    ],
  },
  {
    id: "has_hard_assets",
    title: "Do you hold any physical hard assets?",
    help: "Examples: precious metals you control — not only paper claims or app balances.",
    type: "boolean",
  },
  {
    id: "digital_payment_dependency",
    title: "How dependent are you on digital payments day to day?",
    help: "1 = cash or local methods often. 5 = almost every purchase needs a card or app.",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "alt_payment_method",
    title: "If your main bank or card stopped working, could you still pay?",
    help: "Cash on hand, a second card, or another method you have actually tested.",
    type: "boolean",
  },
  {
    id: "food_buffer_days",
    title: "How many days could your household eat without shopping?",
    help: "Fridge, pantry, and storage — food you already have.",
    type: "slider",
    min: 0,
    max: 30,
    step: 1,
    unit: "days",
  },
  {
    id: "emergency_supply_weeks",
    title: "How many weeks of shelf-stable food and water do you set aside?",
    help: "Stores intended for disruption — not only tonight's dinner.",
    type: "slider",
    min: 0,
    max: 8,
    step: 0.5,
    unit: "weeks",
  },
  {
    id: "food_source_diversity",
    title: "Do you deliberately use more than one food source?",
    help: "Market, farm share, garden, or multiple stores — not only one chain or one app.",
    type: "boolean",
  },
  {
    id: "has_med_kit",
    title: "Do you keep a basic first-aid kit at home?",
    help: "Bandages, pain relief, critical personal meds, thermometer — usable without a pharmacy run.",
    type: "boolean",
  },
  {
    id: "has_local_vendors",
    title: "Do you know local suppliers you can reach without one app?",
    help: "Food, pharmacy, fuel, repair — people or shops in your area.",
    type: "boolean",
  },
  {
    id: "has_offline_docs",
    title: "Do you have offline copies of important documents?",
    help: "Identity, insurance, recovery codes — not only email or cloud.",
    type: "boolean",
  },
  {
    id: "cloud_dependency",
    title: "How dependent are you on cloud services for daily life?",
    help: "1 = almost nothing critical online. 5 = nearly everything lives in the cloud.",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "offline_contacts",
    title: "Do you keep important contacts offline?",
    help: "Paper list or offline file — not only inside your phone.",
    type: "boolean",
  },
  {
    id: "phone_backup_plan",
    title: "If your phone was lost today, could you recover critical accounts?",
    help: "Recovery codes, second email or phone, or another trusted device.",
    type: "boolean",
  },
];
