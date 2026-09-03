/** Shared year checklist for the whole household (local-first). */

export type HouseholdPlanItem = {
  id: string;
  label: string;
  done: boolean;
};

const KEY = "tiltshield_household_plan";

const DEFAULT_ITEMS: Omit<HouseholdPlanItem, "done">[] = [
  { id: "water", label: "Water plan for everyone under this roof" },
  { id: "food90", label: "90 days of normal food (shared stock)" },
  { id: "cash", label: "Shared cash float tested this month" },
  { id: "meds", label: "Meds / first-aid checked for each person" },
  { id: "docs", label: "Critical docs offline for the household" },
  { id: "contacts", label: "Emergency contacts offline + shared" },
  { id: "meetup", label: "Meetup point if phones die" },
  { id: "vendors", label: "3 trusted local places saved in Network" },
];

export function loadHouseholdPlan(): HouseholdPlanItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_ITEMS.map((i) => ({ ...i, done: false }));
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seed = DEFAULT_ITEMS.map((i) => ({ ...i, done: false }));
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as HouseholdPlanItem[];
    // merge new default ids
    const byId = new Map(parsed.map((p) => [p.id, p]));
    return DEFAULT_ITEMS.map((d) => byId.get(d.id) || { ...d, done: false });
  } catch {
    return DEFAULT_ITEMS.map((i) => ({ ...i, done: false }));
  }
}

export function toggleHouseholdPlanItem(id: string): HouseholdPlanItem[] {
  const list = loadHouseholdPlan().map((i) =>
    i.id === id ? { ...i, done: !i.done } : i
  );
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export function householdPlanProgress(list: HouseholdPlanItem[]) {
  const done = list.filter((i) => i.done).length;
  return { done, total: list.length, pct: Math.round((done / list.length) * 100) };
}
