import type { AssessmentAnswers, CategoryScores, Vulnerability } from "@/types";

export interface TiltSession {
  answers: AssessmentAnswers;
  scores: CategoryScores;
  vulnerabilities: Vulnerability[];
  completedAt?: string;
}

export interface HistoryEntry {
  date: string;
  overall: number;
  money?: number;
  food?: number;
  digital?: number;
  emergency?: number;
  runwayDays?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

const KEY = "tiltshield_session";
const PREMIUM_KEY = "tiltshield_lifetime";
const HISTORY_KEY = "tiltshield_history";

export function loadSession(): TiltSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TiltSession;
  } catch {
    return null;
  }
}

export function saveSession(data: TiltSession) {
  if (typeof window === "undefined") return;
  const payload = {
    ...data,
    completedAt: data.completedAt || new Date().toISOString(),
  };
  sessionStorage.setItem(KEY, JSON.stringify(payload));
  localStorage.setItem(KEY, JSON.stringify(payload));

  try {
    const hist = loadHistory();
    const entry: HistoryEntry = {
      date: payload.completedAt!,
      overall: payload.scores.overall,
      money: payload.scores.money,
      food: payload.scores.food,
      digital: payload.scores.digital,
      emergency: payload.scores.emergency,
      runwayDays: Math.round((payload.answers.emergency_fund_months || 0) * 30),
      monthlyIncome: payload.answers.monthly_income,
      monthlyExpenses: payload.answers.monthly_expenses,
    };
    const last = hist[hist.length - 1];
    if (
      last &&
      Math.abs(new Date(entry.date).getTime() - new Date(last.date).getTime()) <
        10 * 60 * 1000
    ) {
      hist[hist.length - 1] = entry;
    } else {
      hist.push(entry);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(-24)));
  } catch {
    /* ignore */
  }
}

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREMIUM_KEY) === "1";
}

export function setPremium(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) localStorage.setItem(PREMIUM_KEY, "1");
  else localStorage.removeItem(PREMIUM_KEY);
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function daysSinceLastAssessment(): number | null {
  const hist = loadHistory();
  const session = loadSession();
  const last = hist[hist.length - 1]?.date || session?.completedAt || null;
  if (!last) return null;
  return Math.floor(
    (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export const CATEGORY_LABELS: Record<string, string> = {
  money: "Money",
  digital: "Digital",
  food: "Food",
  documents: "Documents",
  communication: "Communication",
  home: "Home",
  skills: "Skills",
  emergency: "Emergency",
};

export function categoryStatus(
  score: number
): "healthy" | "attention" | "critical" {
  if (score >= 70) return "healthy";
  if (score >= 45) return "attention";
  return "critical";
}
