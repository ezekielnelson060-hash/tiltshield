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

/** Default filler when a question is skipped (core path). */
export const ANSWER_DEFAULTS: import("@/types").AssessmentAnswers = {
  monthly_income: 0,
  monthly_expenses: 0,
  emergency_fund_months: 0,
  income_sources: 1,
  has_offline_docs: false,
  cloud_dependency: 3,
  emergency_supply_weeks: 0,
  offline_contacts: false,
  phone_backup_plan: false,
  alt_payment_method: false,
  food_buffer_days: 0,
  offline_value_store: 0,
  digital_payment_dependency: 3,
  food_source_diversity: false,
  has_med_kit: false,
  has_local_vendors: false,
  has_hard_assets: false,
};

/**
 * Core path — ~9 questions, ~90 seconds.
 * Enough to score money, food, digital, emergency, and docs.
 */
export const CORE_QUESTIONS: Question[] = [
  {
    id: "monthly_income",
    title: "What is your take-home income each month?",
    help: "What actually lands. Used for runway — not shared publicly.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "monthly_expenses",
    title: "Essential expenses each month?",
    help: "Housing, food, utilities, transport, minimum debt — not lifestyle extras.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "emergency_fund_months",
    title: "How many months of essentials could savings cover?",
    help: "Money you could reach in a few days.",
    type: "slider",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "months",
  },
  {
    id: "income_sources",
    title: "How many independent income sources?",
    type: "choice",
    choices: [
      { label: "1 — single source", value: 1 },
      { label: "2 sources", value: 2 },
      { label: "3 or more", value: 3 },
    ],
  },
  {
    id: "alt_payment_method",
    title: "If cards and apps failed, could you still pay for essentials?",
    help: "Cash, alternate rail, or local arrangement you have already tested.",
    type: "boolean",
  },
  {
    id: "food_buffer_days",
    title: "How many days of normal food do you have at home?",
    type: "slider",
    min: 0,
    max: 90,
    step: 1,
    unit: "days",
  },
  {
    id: "has_med_kit",
    title: "Do you keep a basic first-aid kit at home?",
    type: "boolean",
  },
  {
    id: "has_offline_docs",
    title: "Important documents offline (not only in email or cloud)?",
    type: "boolean",
  },
  {
    id: "phone_backup_plan",
    title: "If your phone was lost today, could you recover key accounts?",
    help: "Recovery codes, second email, or another device.",
    type: "boolean",
  },
];

/** Optional sharpen — run after core for a fuller score. */
export const DEEP_QUESTIONS: Question[] = [
  {
    id: "offline_value_store",
    title: "Value outside a single bank or app?",
    type: "choice",
    choices: [
      { label: "No — mostly banks or apps", value: 0 },
      { label: "Cash reserve", value: 1 },
      { label: "Self-custody digital", value: 2 },
      { label: "Both cash and self-custody", value: 3 },
    ],
  },
  {
    id: "has_hard_assets",
    title: "Any physical hard assets you control?",
    help: "e.g. metals — not only paper claims.",
    type: "boolean",
  },
  {
    id: "digital_payment_dependency",
    title: "How dependent on digital payments day to day?",
    help: "1 = often cash/local · 5 = almost everything digital",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "emergency_supply_weeks",
    title: "Weeks of home emergency supplies (beyond food)?",
    type: "slider",
    min: 0,
    max: 8,
    step: 0.5,
    unit: "weeks",
  },
  {
    id: "food_source_diversity",
    title: "More than one food source on purpose?",
    type: "boolean",
  },
  {
    id: "has_local_vendors",
    title: "Local suppliers you can reach without one app?",
    type: "boolean",
  },
  {
    id: "cloud_dependency",
    title: "How dependent on cloud services for daily life?",
    help: "1 = little · 5 = almost everything online",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "offline_contacts",
    title: "Important contacts kept offline?",
    type: "boolean",
  },
];

/** Short pulse when adding / switching a household member (~5 questions). */
export const MEMBER_PULSE_QUESTIONS: Question[] = [
  {
    id: "emergency_fund_months",
    title: "Months of essentials could their savings cover?",
    type: "slider",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "months",
  },
  {
    id: "food_buffer_days",
    title: "Days of food at home for them / with you?",
    type: "slider",
    min: 0,
    max: 90,
    step: 1,
    unit: "days",
  },
  {
    id: "alt_payment_method",
    title: "Backup way to pay if cards fail?",
    type: "boolean",
  },
  {
    id: "phone_backup_plan",
    title: "Phone-loss recovery plan?",
    type: "boolean",
  },
  {
    id: "has_med_kit",
    title: "Access to a basic med kit?",
    type: "boolean",
  },
];

/** Default assessment = core only (short). */
export const ASSESSMENT_QUESTIONS = CORE_QUESTIONS;

export const FULL_QUESTIONS = [...CORE_QUESTIONS, ...DEEP_QUESTIONS];
