export type FamilyRelation =
  | "self"
  | "partner"
  | "child"
  | "parent"
  | "roommate"
  | "other";

export type FamilyMember = {
  id: string;
  name: string;
  relationship: FamilyRelation;
  readinessScore?: number;
  /** Set when synced to Supabase family_members.id */
  cloudId?: string;
};

const MEMBERS_KEY = "tiltshield_family_members";
const ACTIVE_KEY = "tiltshield_active_member";
const FAMILY_KEY = "tiltshield_family";

function defaultSelf(): FamilyMember {
  return {
    id: "self",
    name: "You",
    relationship: "self",
    readinessScore: undefined,
  };
}

export function loadFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [defaultSelf()];
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) {
      const seed = [defaultSelf()];
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(seed));
      return seed;
    }
    const list = JSON.parse(raw) as FamilyMember[];
    if (!list.some((m) => m.id === "self")) {
      list.unshift(defaultSelf());
    }
    return list;
  } catch {
    return [defaultSelf()];
  }
}

export function saveFamilyMembers(members: FamilyMember[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function getActiveMemberId(): string {
  if (typeof window === "undefined") return "self";
  return localStorage.getItem(ACTIVE_KEY) || "self";
}

export function setActiveMemberId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveMember(): FamilyMember {
  const id = getActiveMemberId();
  return loadFamilyMembers().find((m) => m.id === id) || defaultSelf();
}

export function addFamilyMember(name: string, relationship: FamilyRelation) {
  const members = loadFamilyMembers();
  const id = `m_${Date.now().toString(36)}`;
  members.push({
    id,
    name: name.trim() || "Member",
    relationship,
  });
  saveFamilyMembers(members);
  return id;
}

export function removeFamilyMember(id: string) {
  if (id === "self") return;
  saveFamilyMembers(loadFamilyMembers().filter((m) => m.id !== id));
  if (getActiveMemberId() === id) setActiveMemberId("self");
}

export function updateMemberScore(memberId: string, score: number) {
  const members = loadFamilyMembers().map((m) =>
    m.id === memberId ? { ...m, readinessScore: score } : m
  );
  saveFamilyMembers(members);
}

export function setMemberCloudId(localId: string, cloudId: string) {
  const members = loadFamilyMembers().map((m) =>
    m.id === localId ? { ...m, cloudId } : m
  );
  saveFamilyMembers(members);
}

/** Alias used by persist cloud sync */
export function patchMemberCloudId(localId: string, cloudId: string) {
  return setMemberCloudId(localId, cloudId);
}

/**
 * Household seats unlock only with family purchase (or explicit family flag).
 * Individual lifetime does NOT include multi-member profiles.
 */
export function isFamilyUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(FAMILY_KEY) === "1";
}

export function setFamilyUnlocked(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) localStorage.setItem(FAMILY_KEY, "1");
  else localStorage.removeItem(FAMILY_KEY);
}

export const RELATION_LABELS: Record<FamilyRelation, string> = {
  self: "You",
  partner: "Partner",
  child: "Children",
  parent: "Parents",
  roommate: "Roommates",
  other: "Other",
};
