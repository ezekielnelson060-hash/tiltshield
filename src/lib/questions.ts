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
    id: "monthly_expenses",
    title: "What are your essential monthly expenses?",
    help: "Housing, food, utilities, transport, minimum debt payments — not lifestyle spending.",
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
    help: "Job, side business, rental, investments that pay regularly, etc.",
    type: "choice",
    choices: [
      { label: "1 (single source)", value: 1 },
      { label: "2", value: 2 },
      { label: "3 or more", value: 3 },
    ],
  },
  {
    id: "alt_payment_method",
    title: "Do you have an alternative payment method if your main bank/card stops working?",
    help: "Cash reserve, secondary card, or other method you have tested.",
    type: "boolean",
  },
  {
    id: "has_offline_docs",
    title: "Do you have offline copies of your most important documents?",
    help: "IDs, insurance, property docs, recovery codes — not only in email or cloud.",
    type: "boolean",
  },
  {
    id: "cloud_dependency",
    title: "How dependent are you on cloud services for daily life?",
    help: "1 = almost nothing critical in the cloud, 5 = nearly everything lives online.",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "emergency_supply_weeks",
    title: "How many weeks of emergency food/water do you have at home?",
    type: "slider",
    min: 0,
    max: 8,
    step: 0.5,
    unit: "weeks",
  },
  {
    id: "food_buffer_days",
    title: "Roughly how many days could your household eat without shopping?",
    help: "Including what is already in the pantry and fridge.",
    type: "slider",
    min: 0,
    max: 30,
    step: 1,
    unit: "days",
  },
  {
    id: "offline_contacts",
    title: "Do you have important contacts stored offline (paper or offline file)?",
    type: "boolean",
  },
  {
    id: "phone_backup_plan",
    title: "If your phone was lost today, could you recover critical accounts?",
    help: "2FA backups, secondary email/phone, recovery codes stored elsewhere.",
    type: "boolean",
  },
];
