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
    help: "Only what you must pay each month: housing, food, utilities, transport, minimum debt \u2014 not lifestyle spending.",
    type: "number",
    min: 0,
    step: 50,
    unit: "currency",
  },
  {
    id: "emergency_fund_months",
    title: "How many months of expenses do you currently have saved?",
    help: "Liquid savings you could access within a few days if you had to.",
    type: "slider",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "months",
  },
  {
    id: "income_sources",
    title: "How many independent income sources do you have?",
    help: "Job, side business, rental, or anything that pays you regularly on its own.",
    type: "choice",
    choices: [
      { label: "1 \u2014 single source", value: 1 },
      { label: "2 \u2014 two sources", value: 2 },
      { label: "3 or more sources", value: 3 },
    ],
  },
  {
    id: "offline_value_store",
    title: "Do you hold any value outside the banking app?",
    help: "Cash on hand, a hardware wallet, or other self-custody you actually control \u2014 not only balances in an app.",
    type: "choice",
    choices: [
      { label: "No \u2014 almost everything is in banks or apps", value: 0 },
      { label: "Yes \u2014 cash reserve only", value: 1 },
      { label: "Yes \u2014 hardware wallet / self-custody crypto", value: 2 },
      { label: "Yes \u2014 both cash and self-custody", value: 3 },
    ],
  },
  {
    id: "digital_payment_dependency",
    title: "How dependent are you on digital payment rails day to day?",
    help: "1 = you still use cash or local alternatives often. 5 = almost every purchase needs a card, app, or online account.",
    type: "slider",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    id: "alt_payment_method",
    title: "Do you have an alternative payment method if your main bank or card stops working?",
    help: "Cash you can use today, a second card, or another method you've actually tested.",
    type: "boolean",
  },
  {
    id: "has_offline_docs",
    title: "Do you have offline copies of your most important documents?",
    help: "IDs, insurance, property papers, recovery codes \u2014 not only in email or the cloud.",
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
    id: "food_buffer_days",
    title: "How many days could your household eat without shopping?",
    help: "Count everything usable in your fridge, pantry, and store room.",
    type: "slider",
    min: 0,
    max: 30,
    step: 1,
    unit: "days",
  },
  {
    id: "emergency_supply_weeks",
    title: "How many weeks of emergency food and water do you keep at home?",
    help: "Shelf-stable stores set aside for disruption \u2014 not only this week's groceries.",
    type: "slider",
    min: 0,
    max: 8,
    step: 0.5,
    unit: "weeks",
  },
  {
    id: "food_source_diversity",
    title: "Do you intentionally use more than one food source?",
    help: "For example: local market, farm share, home-grown, or higher-quality / less processed options \u2014 not only one supermarket chain.",
    type: "boolean",
  },
  {
    id: "offline_contacts",
    title: "Do you have important contacts stored offline?",
    help: "Paper list or offline file \u2014 not only contacts locked inside your phone.",
    type: "boolean",
  },
  {
    id: "phone_backup_plan",
    title: "If your phone was lost today, could you recover critical accounts?",
    help: "Recovery codes, a second email or phone, or another device you can sign in from.",
    type: "boolean",
  },
];
