export type SubscriptionStatus = "free" | "lifetime" | "active" | "family";

export interface Profile {
  id: string;
  created_at: string;
  display_name: string | null;
  readiness_score: number;
  subscription_status: SubscriptionStatus;
  assessment_completed: boolean;
}

export interface AssessmentAnswers {
  monthly_income: number;
  monthly_expenses: number;
  emergency_fund_months: number;
  income_sources: number;
  has_offline_docs: boolean;
  cloud_dependency: number;
  emergency_supply_weeks: number;
  offline_contacts: boolean;
  phone_backup_plan: boolean;
  alt_payment_method: boolean;
  food_buffer_days: number;
  offline_value_store: number;
  digital_payment_dependency: number;
  food_source_diversity: boolean;
  has_med_kit: boolean;
  has_local_vendors: boolean;
  has_hard_assets: boolean;
}

export interface CategoryScores {
  money: number;
  food: number;
  digital: number;
  communication: number;
  documents: number;
  skills: number;
  home: number;
  emergency: number;
  overall: number;
}

export type Severity = "critical" | "high" | "medium" | "low";

export interface Vulnerability {
  id?: string;
  rank: number;
  category: keyof Omit<CategoryScores, "overall">;
  title: string;
  severity: Severity;
  current_state: string;
  next_action: string;
  target: string;
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "Low" | "Medium" | "High" | "Very High";
  is_resolved?: boolean;
}

export interface ActionItem {
  id: string;
  category: string;
  title: string;
  description: string;
  why: string;
  time_estimate: string;
  steps: string[];
  difficulty: string;
}

export interface UserAction {
  id: string;
  action_id: string;
  status: "pending" | "in_progress" | "completed";
  completed_at?: string;
  notes?: string;
}

export type WhatIfScenario =
  | "income_stops"
  | "banking_down"
  | "phone_lost"
  | "food_prices_double"
  | "internet_outage"
  | "job_loss"
  | "medical_emergency"
  | "power_grid"
  | "digital_payments_only";

export interface WhatIfResult {
  scenario: WhatIfScenario;
  title: string;
  summary: string;
  detail: string;
  severity: Severity;
  recommendation: string;
}
