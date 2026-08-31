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

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "monthly_income",
    title: "What is your take-home monthly income?",
    help: "Money that actually lands each month — salary, business draws, reliable side income. This is what Tiltshield builds from.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "monthly_expenses",
    title: "What are your essential monthly expenses?",
    help: "Housing, food, utilities, transport, minimum debt — not lifestyle stretch.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "emergency_fund_months",
    title: "How many months of expenses do you currently have saved?",
    help: "Liquid savings you could access within a few days.",
    type: "slider",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "months",
  },
  {
    id: "income_sources",
    title: "How many independent income sources do you have?",
    help: "Job, business, rental, or anything that pays on its own.",
    type: "choice",
    choices: [
      { label: "1 — single source", value: 1 },
      { label: "2 — two sources", value: 2 },
      { label: "3 or more sources", value: 3 },
    ],
  },
  {
    id: "offline_value_store",
    title: "Do you hold value outside the banking app?",
    help: "Cash, hardware wallet / self-custody, or both — things that still exist if an app freezes.",
    type: "choice",
    choices: [
      { label: "No — almost everything is in banks or apps", value: 0 },
      { label: "Yes — cash reserve only", value: 1 },
      { label: "Yes — hardware wallet / self-custody", value: 2 },
      { label: "Yes — both cash and self-custody", value: 3 },
    ],
  },
  {
    id: "has_hard_assets",
    title: "Do you hold any hard assets (gold, silver, or similar)?",
    help: "Physical stores of value you control — not only paper or app balances.",
    type: "boolean",
  },
  {
    id: "digital_payment_dependency",
    title: "How dependent are you on digital payment rails day to day?",
    help: "1 = cash/local often. 5 = almost every purchase needs a card or app.",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "alt_payment_method",
    title: "If your main bank or card stopped working, could you still pay?",
    help: "Cash on hand, second card, or another method you have tested.",
    type: "boolean",
  },
  {
    id: "food_buffer_days",
    title: "How many days could your household eat without shopping?",
    help: "Fridge, pantry, and store room — food you already have.",
    type: "slider",
    min: 0,
    max: 30,
    step: 1,
    unit: "days",
  },
  {
    id: "emergency_supply_weeks",
    title: "How many weeks of emergency food and water do you keep?",
    help: "Shelf-stable stores set aside for disruption.",
    type: "slider",
    min: 0,
    max: 8,
    step: 0.5,
    unit: "weeks",
  },
  {
    id: "food_source_diversity",
    title: "Do you use more than one food source on purpose?",
    help: "Local market, farm share, garden, or quality suppliers — not only one chain.",
    type: "boolean",
  },
  {
    id: "has_med_kit",
    title: "Do you keep a basic medical / first-aid kit at home?",
    help: "Bandages, pain relief, any critical personal meds, thermometer — ready without a pharmacy run.",
    type: "boolean",
  },
  {
    id: "has_local_vendors",
    title: "Do you know local vendors you can reach offline?",
    help: "Food, pharmacy, fuel, repair — people or shops in your city beyond a single app.",
    type: "boolean",
  },
  {
    id: "has_offline_docs",
    title: "Do you have offline copies of important documents?",
    help: "IDs, insurance, recovery codes — not only email or cloud.",
    type: "boolean",
  },
  {
    id: "cloud_dependency",
    title: "How dependent are you on cloud services for daily life?",
    help: "1 = almost nothing critical online. 5 = nearly everything in the cloud.",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "offline_contacts",
    title: "Do you have important contacts stored offline?",
    help: "Paper or offline file — not only inside your phone.",
    type: "boolean",
  },
  {
    id: "phone_backup_plan",
    title: "If your phone was lost today, could you recover critical accounts?",
    help: "Recovery codes, second email/phone, or another device.",
    type: "boolean",
  },
];
