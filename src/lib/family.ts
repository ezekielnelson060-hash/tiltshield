export type FamilyRelation = "self" | "partner" | "child" | "parent" | "roommate" | "other";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: FamilyRelation;
  isPrimary: boolean;
  readinessScore?: number;
  cloudId?: string;
}

const MEMBERS_KEY = "tiltshield_family_members";
const ACTIVE_KEY = "tiltshield_active_member";
const FAMILY_KEY = "tiltshield_family";

export function loadFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) {
      const self: FamilyMember = {
        id: "self",
        name: "Me",
        relationship: "self",
        isPrimary: true,
      };
      saveFamilyMembers([self]);
      return [self];
    }
    return JSON.parse(raw) as FamilyMember[];
  } catch {
    return [{ id: "self", name: "Me", relationship: "self", isPrimary: true }];
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
  window.dispatchEvent(new CustomEvent("tiltshield:member-change", { detail: { id } }));
}

export function getActiveMember(): FamilyMember {
  const members = loadFamilyMembers();
  const id = getActiveMemberId();
  return members.find((m) => m.id === id) || members[0];
}

export function addFamilyMember(
  name: string,
  relationship: FamilyRelation
): FamilyMember {
  const members = loadFamilyMembers();
  const m: FamilyMember = {
    id: crypto.randomUUID(),
    name: name.trim() || "Member",
    relationship,
    isPrimary: false,
  };
  saveFamilyMembers([...members, m]);
  return m;
}

export function removeFamilyMember(id: string) {
  if (id === "self") return;
  const members = loadFamilyMembers().filter((m) => m.id !== id);
  saveFamilyMembers(members);
  if (getActiveMemberId() === id) setActiveMemberId("self");
}

export function updateMemberScore(id: string, score: number) {
  const members = loadFamilyMembers().map((m) =>
    m.id === id ? { ...m, readinessScore: score } : m
  );
  saveFamilyMembers(members);
}

export function patchMemberCloudId(localId: string, cloudId: string) {
  const members = loadFamilyMembers().map((m) =>
    m.id === localId ? { ...m, cloudId } : m
  );
  saveFamilyMembers(members);
}

export function isFamilyUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem("tiltshield_lifetime") === "1") return true;
  if (localStorage.getItem(FAMILY_KEY) === "1") return true;
  return false;
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
