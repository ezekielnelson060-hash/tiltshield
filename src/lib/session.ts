import type { AssessmentAnswers, CategoryScores, Vulnerability } from "@/types";
import { getActiveMemberId, updateMemberScore } from "@/lib/family";

export interface TiltSession {
  answers: AssessmentAnswers;
  scores: CategoryScores;
  vulnerabilities: Vulnerability[];
  completedAt?: string;
  memberId?: string;
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
  memberId?: string;
  source?: "local" | "cloud";
}

const PREMIUM_KEY = "tiltshield_lifetime";
const HISTORY_KEY = "tiltshield_history";

function sessionKey(memberId?: string) {
  const id =
    memberId ||
    (typeof window !== "undefined" ? getActiveMemberId() : "self");
  return `tiltshield_session_${id}`;
}

export function loadSession(memberId?: string): TiltSession | null {
  if (typeof window === "undefined") return null;
  try {
    const key = sessionKey(memberId);
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (
      !raw &&
      (!memberId || memberId === "self" || getActiveMemberId() === "self")
    ) {
      const legacy =
        sessionStorage.getItem("tiltshield_session") ||
        localStorage.getItem("tiltshield_session");
      if (legacy) return JSON.parse(legacy) as TiltSession;
    }
    if (!raw) return null;
    return JSON.parse(raw) as TiltSession;
  } catch {
    return null;
  }
}

export function saveSession(data: TiltSession) {
  if (typeof window === "undefined") return;
  const memberId = data.memberId || getActiveMemberId();
  const payload: TiltSession = {
    ...data,
    memberId,
    completedAt: data.completedAt || new Date().toISOString(),
  };
  const key = sessionKey(memberId);
  sessionStorage.setItem(key, JSON.stringify(payload));
  localStorage.setItem(key, JSON.stringify(payload));
  if (memberId === "self") {
    sessionStorage.setItem("tiltshield_session", JSON.stringify(payload));
    localStorage.setItem("tiltshield_session", JSON.stringify(payload));
  }
  try {
    updateMemberScore(memberId, payload.scores.overall);
  } catch {
    /* */
  }
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
      memberId,
      source: "local",
    };
    const last = hist[hist.length - 1];
    if (
      last &&
      last.memberId === memberId &&
      Math.abs(new Date(entry.date).getTime() - new Date(last.date).getTime()) <
        10 * 60 * 1000
    ) {
      hist[hist.length - 1] = entry;
    } else {
      hist.push(entry);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(-48)));
  } catch {
    /* */
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

export function loadHistory(memberId?: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    ) as HistoryEntry[];
    if (!memberId) return all;
    return all.filter((h) => !h.memberId || h.memberId === memberId);
  } catch {
    return [];
  }
}

export function mergeCloudHistory(cloud: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  const local = loadHistory();
  const map = new Map<string, HistoryEntry>();
  for (const h of local) {
    map.set(`${h.date}|${h.overall}|${h.memberId || "self"}`, h);
  }
  for (const h of cloud) {
    const k = `${h.date}|${h.overall}|${h.memberId || "self"}`;
    if (!map.has(k)) map.set(k, { ...h, source: "cloud" });
  }
  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(merged.slice(-48)));
}

export function daysSinceLastAssessment(memberId?: string): number | null {
  const hist = loadHistory(memberId);
  const session = loadSession(memberId);
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
