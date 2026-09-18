/**
 * Update assessment answers without re-running the full quiz.
 * Stock ticks + journal + "Update my situation" all flow through here.
 */

import type { AssessmentAnswers } from "@/types";
import {
  loadSession,
  saveSession,
  type TiltSession,
} from "@/lib/session";
import {
  calculateCategoryScores,
  calculateVulnerabilities,
} from "@/lib/scoring";

export const SCORE_PULSE_KEY = "tiltshield_score_pulse";

export type ScoreDelta = {
  label: string;
  from: string | number;
  to: string | number;
};

export type ScorePulse = {
  at: string;
  overallFrom: number;
  overallTo: number;
  deltas: ScoreDelta[];
  source: "situation" | "stock" | "journal";
};

export type AnswerPatch = Partial<AssessmentAnswers>;

function num(n: unknown, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

/** Apply patch, recalculate scores, persist, emit pulse for Today. */
export function applyAnswerPatch(
  patch: AnswerPatch,
  source: ScorePulse["source"] = "situation"
): TiltSession | null {
  const session = loadSession();
  if (!session?.answers) return null;

  const before = session.answers;
  const overallFrom = session.scores?.overall ?? 0;

  const nextAnswers: AssessmentAnswers = {
    ...before,
    ...patch,
  };

  nextAnswers.monthly_expenses = Math.max(0, num(nextAnswers.monthly_expenses));
  nextAnswers.monthly_income = Math.max(0, num(nextAnswers.monthly_income));
  nextAnswers.emergency_fund_months = Math.max(
    0,
    num(nextAnswers.emergency_fund_months)
  );
  nextAnswers.food_buffer_days = Math.max(0, num(nextAnswers.food_buffer_days));
  nextAnswers.emergency_supply_weeks = Math.max(
    0,
    num(nextAnswers.emergency_supply_weeks)
  );
  nextAnswers.income_sources = Math.max(
    1,
    Math.min(3, num(nextAnswers.income_sources, 1))
  );

  const scores = calculateCategoryScores(nextAnswers);
  let vulnerabilities = session.vulnerabilities || [];
  try {
    vulnerabilities = calculateVulnerabilities(nextAnswers, scores);
  } catch {
    /* keep prior */
  }

  const updated: TiltSession = {
    ...session,
    answers: nextAnswers,
    scores,
    vulnerabilities,
  };
  saveSession(updated);

  const deltas = buildDeltas(before, nextAnswers, overallFrom, scores.overall);
  if (deltas.length > 0 || overallFrom !== scores.overall) {
    writePulse({
      at: new Date().toISOString(),
      overallFrom,
      overallTo: scores.overall,
      deltas,
      source,
    });
  }

  try {
    window.dispatchEvent(new Event("tiltshield:session-update"));
    window.dispatchEvent(new Event("tiltshield:progress"));
  } catch {
    /* */
  }

  return updated;
}

function buildDeltas(
  before: AssessmentAnswers,
  after: AssessmentAnswers,
  overallFrom: number,
  overallTo: number
): ScoreDelta[] {
  const deltas: ScoreDelta[] = [];
  if (before.food_buffer_days !== after.food_buffer_days) {
    deltas.push({
      label: "Food days",
      from: before.food_buffer_days || 0,
      to: after.food_buffer_days || 0,
    });
  }
  if (before.emergency_fund_months !== after.emergency_fund_months) {
    deltas.push({
      label: "Cash runway (months)",
      from: before.emergency_fund_months || 0,
      to: after.emergency_fund_months || 0,
    });
  }
  if (before.income_sources !== after.income_sources) {
    deltas.push({
      label: "Income sources",
      from: before.income_sources || 1,
      to: after.income_sources || 1,
    });
  }
  if (!!before.alt_payment_method !== !!after.alt_payment_method) {
    deltas.push({
      label: "Backup payment",
      from: before.alt_payment_method ? "Yes" : "No",
      to: after.alt_payment_method ? "Yes" : "No",
    });
  }
  if (!!before.has_offline_docs !== !!after.has_offline_docs) {
    deltas.push({
      label: "Offline ID",
      from: before.has_offline_docs ? "Yes" : "No",
      to: after.has_offline_docs ? "Yes" : "No",
    });
  }
  if (before.offline_value_store !== after.offline_value_store) {
    deltas.push({
      label: "Offline value",
      from: before.offline_value_store || 0,
      to: after.offline_value_store || 0,
    });
  }
  if (overallFrom !== overallTo) {
    deltas.unshift({
      label: "Exposure score",
      from: overallFrom,
      to: overallTo,
    });
  }
  return deltas;
}

function writePulse(pulse: ScorePulse) {
  try {
    localStorage.setItem(SCORE_PULSE_KEY, JSON.stringify(pulse));
  } catch {
    /* */
  }
}

export function readScorePulse(): ScorePulse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SCORE_PULSE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScorePulse;
  } catch {
    return null;
  }
}

export function clearScorePulse() {
  try {
    localStorage.removeItem(SCORE_PULSE_KEY);
  } catch {
    /* */
  }
}

/** When a stock item is completed, lift related assessment fields (never lower on untick). */
export function boostFromStockComplete(stockId: string): AnswerPatch | null {
  const session = loadSession();
  if (!session?.answers) return null;
  const a = session.answers;
  const patch: AnswerPatch = {};

  if (stockId === "food_90") {
    if ((a.food_buffer_days || 0) < 90) patch.food_buffer_days = 90;
    if ((a.emergency_supply_weeks || 0) < 12) patch.emergency_supply_weeks = 12;
  }
  if (stockId === "food_rotate") {
    if ((a.food_buffer_days || 0) < 14) patch.food_buffer_days = 14;
  }
  if (stockId === "cash_float") {
    if ((a.emergency_fund_months || 0) < 0.5) patch.emergency_fund_months = 0.5;
    if ((a.offline_value_store || 0) < 1) patch.offline_value_store = 1;
  }
  if (stockId === "alt_pay" && !a.alt_payment_method) {
    patch.alt_payment_method = true;
  }
  if (stockId === "docs_offline" && !a.has_offline_docs) {
    patch.has_offline_docs = true;
  }
  if ((stockId === "meds_30" || stockId === "first_aid") && !a.has_med_kit) {
    patch.has_med_kit = true;
  }
  if (stockId === "vendor_3" && !a.has_local_vendors) {
    patch.has_local_vendors = true;
  }
  if (stockId === "family_plan" && !a.offline_contacts) {
    patch.offline_contacts = true;
  }
  if (stockId === "water_plan" && (a.emergency_supply_weeks || 0) < 1) {
    patch.emergency_supply_weeks = Math.max(1, a.emergency_supply_weeks || 0);
  }

  return Object.keys(patch).length ? patch : null;
}

/** Infer light boosts from journal text when stock tags absent. */
export function boostFromJournalText(text: string): AnswerPatch | null {
  const session = loadSession();
  if (!session?.answers) return null;
  const a = session.answers;
  const t = text.toLowerCase();
  const patch: AnswerPatch = {};

  if (
    /rice|beans|garri|pantry|stocked|provisions|food for/.test(t) &&
    (a.food_buffer_days || 0) < 30
  ) {
    patch.food_buffer_days = Math.max(a.food_buffer_days || 0, 30);
  }
  if (
    /cash|withdraw|atm|envelope|naira/.test(t) &&
    (a.emergency_fund_months || 0) < 0.5
  ) {
    patch.emergency_fund_months = 0.5;
    if ((a.offline_value_store || 0) < 1) patch.offline_value_store = 1;
  }
  if (
    /second (card|bank)|backup (card|pay)|ussd|pos/.test(t) &&
    !a.alt_payment_method
  ) {
    patch.alt_payment_method = true;
  }
  if (/passport|id card|nin|license|offline (copy|doc)/.test(t) && !a.has_offline_docs) {
    patch.has_offline_docs = true;
  }

  return Object.keys(patch).length ? patch : null;
}
