import type { AssessmentAnswers, CategoryScores, Vulnerability } from "@/types";

export interface TiltSession {
  answers: AssessmentAnswers;
  scores: CategoryScores;
  vulnerabilities: Vulnerability[];
  completedAt?: string;
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
  const payload = { ...data, completedAt: data.completedAt || new Date().toISOString() };
  sessionStorage.setItem(KEY, JSON.stringify(payload));
  localStorage.setItem(KEY, JSON.stringify(payload));
  try {
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as {
      date: string;
      overall: number;
    }[];
    hist.push({ date: payload.completedAt!, overall: payload.scores.overall });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(-12)));
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

export function loadHistory(): { date: string; overall: number }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
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

export function categoryStatus(score: number): "healthy" | "attention" | "critical" {
  if (score >= 70) return "healthy";
  if (score >= 45) return "attention";
  return "critical";
}
