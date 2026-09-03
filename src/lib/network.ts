/**
 * Trusted places network — local-first pins the household can rely on.
 */

export type TrustedPlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  query?: string;
  note?: string;
  savedAt: string;
};

const KEY = "tiltshield_trusted_places";

export function loadTrustedPlaces(): TrustedPlace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as TrustedPlace[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function persist(list: TrustedPlace[]) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 40)));
}

export function isTrusted(id: string): boolean {
  return loadTrustedPlaces().some((p) => p.id === id);
}

export function saveTrustedPlace(
  place: Omit<TrustedPlace, "savedAt"> & { savedAt?: string }
): TrustedPlace[] {
  const list = loadTrustedPlaces().filter((p) => p.id !== place.id);
  list.unshift({
    ...place,
    savedAt: place.savedAt || new Date().toISOString(),
  });
  persist(list);
  return list;
}

export function removeTrustedPlace(id: string): TrustedPlace[] {
  const list = loadTrustedPlaces().filter((p) => p.id !== id);
  persist(list);
  return list;
}

export function trustedCount(): number {
  return loadTrustedPlaces().length;
}
