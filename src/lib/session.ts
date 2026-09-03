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
};

export type HistoryEntry = {
  at: string;
  overall: number;
  memberId?: string;
};

const SESSION_KEY = "tiltshield_session";
const HISTORY_KEY = "tiltshield_history";
const PREMIUM_KEY = "tiltshield_lifetime";
const FAMILY_KEY = "tiltshield_family";

function sessionKey(memberId?: string) {
  const mid = memberId || (typeof window !== "undefined" ? getActiveMemberId() : "self");
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
  const payload: TiltSession = {
    ...session,
    memberId: mid,
    savedAt: new Date().toISOString(),
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
    at: payload.savedAt!,
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

/** Lifetime OR Household both unlock full tools. Household alone does seats. */
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

export function daysSinceLastAssessment(memberId?: string): number | null {
  const s = loadSession(memberId);
  if (!s?.savedAt) {
    const h = loadHistory(memberId)[0];
    if (!h?.at) return null;
    const ms = Date.now() - new Date(h.at).getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }
  const ms = Date.now() - new Date(s.savedAt).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}
