import { getActiveMemberId, updateMemberScore } from "@/lib/family";
import type {
  AssessmentAnswers,
  CategoryScores,
  Vulnerability,
} from "@/types";

export type TiltSession = {
  answers: AssessmentAnswers;
  scores: CategoryScores;
  vulnerabilities: Vulnerability[];
  memberId?: string;
  savedAt?: string;
  completedAt?: string;
};

export type HistoryEntry = {
  at?: string;
  date?: string;
  overall: number;
  memberId?: string;
  money?: number;
  food?: number;
  digital?: number;
  emergency?: number;
  runwayDays?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  source?: "local" | "cloud";
};

const SESSION_KEY = "tiltshield_session";
const HISTORY_KEY = "tiltshield_history";
const PREMIUM_KEY = "tiltshield_lifetime";
const FAMILY_KEY = "tiltshield_family";

function sessionKey(memberId?: string) {
  const mid =
    memberId ||
    (typeof window !== "undefined" ? getActiveMemberId() : "self");
  return mid === "self" ? SESSION_KEY : `${SESSION_KEY}_${mid}`;
}

export function loadSession(memberId?: string): TiltSession | null {
  if (typeof window === "undefined") return null;
  try {
    const key = sessionKey(memberId);
    const raw =
      sessionStorage.getItem(key) ||
      localStorage.getItem(key) ||
      localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TiltSession;
    if (!parsed?.scores || !parsed?.answers) return null;
    if (!Array.isArray(parsed.vulnerabilities)) parsed.vulnerabilities = [];
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: TiltSession) {
  if (typeof window === "undefined") return;
  const mid = session.memberId || getActiveMemberId();
  const now = new Date().toISOString();
  const payload: TiltSession = {
    ...session,
    memberId: mid,
    savedAt: now,
    completedAt: session.completedAt || now,
    vulnerabilities: session.vulnerabilities || [],
  };
  const key = sessionKey(mid);
  const str = JSON.stringify(payload);
  localStorage.setItem(key, str);
  sessionStorage.setItem(key, str);
  if (mid === "self") {
    localStorage.setItem(SESSION_KEY, str);
  }
  try {
    updateMemberScore(mid, payload.scores.overall);
  } catch {
    /* */
  }
  appendHistory({
    at: now,
    date: now,
    overall: payload.scores.overall,
    memberId: mid,
  });
}

function appendHistory(entry: HistoryEntry) {
  try {
    const hist = loadHistory();
    hist.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0, 48)));
  } catch {
    /* */
  }
}

/** Lifetime OR Household both unlock full tools. */
export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(PREMIUM_KEY) === "1" ||
    localStorage.getItem(FAMILY_KEY) === "1"
  );
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
    const d = h.date || h.at || "";
    map.set(`${d}|${h.overall}|${h.memberId || "self"}`, h);
  }
  for (const h of cloud) {
    const d = h.date || h.at || "";
    const k = `${d}|${h.overall}|${h.memberId || "self"}`;
    if (!map.has(k)) map.set(k, { ...h, source: "cloud" });
  }
  const merged = Array.from(map.values()).sort((a, b) => {
    const da = new Date(a.date || a.at || 0).getTime();
    const db = new Date(b.date || b.at || 0).getTime();
    return da - db;
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(merged.slice(-48)));
}

export function daysSinceLastAssessment(memberId?: string): number | null {
  const s = loadSession(memberId);
  const stamp = s?.savedAt || s?.completedAt;
  if (!stamp) {
    const h = loadHistory(memberId)[0];
    const ht = h?.at || h?.date;
    if (!ht) return null;
    const ms = Date.now() - new Date(ht).getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }
  const ms = Date.now() - new Date(stamp).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
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
