/**
 * Lightweight place resolution for Today chips — no API key.
 * Uses OpenStreetMap Nominatim reverse geocode via our API.
 */

export type PlaceInfo = {
  city: string;
  region?: string;
  country?: string;
  label: string;
};

type Cache = { key: string; info: PlaceInfo; at: number };

const CACHE_KEY = "tiltshield_place_v1";
const TTL_MS = 1000 * 60 * 60 * 12; // 12h

function readCache(lat: number, lng: number): PlaceInfo | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cache;
    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    if (c.key !== key) return null;
    if (Date.now() - c.at > TTL_MS) return null;
    return c.info;
  } catch {
    return null;
  }
}

function writeCache(lat: number, lng: number, info: PlaceInfo) {
  try {
    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ key, info, at: Date.now() } satisfies Cache)
    );
  } catch {
    /* */
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<PlaceInfo | null> {
  const cached = readCache(lat, lng);
  if (cached) return cached;

  try {
    const res = await fetch(
      `/api/place/reverse?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
    );
    if (!res.ok) return null;
    const j = (await res.json()) as PlaceInfo & { error?: string };
    if (j.error || !j.label) return null;
    const info: PlaceInfo = {
      city: j.city || "Your area",
      region: j.region,
      country: j.country,
      label: j.label,
    };
    writeCache(lat, lng, info);
    return info;
  } catch {
    return null;
  }
}

export function assessedLabel(days: number | null): string {
  if (days == null) return "Not assessed yet";
  if (days <= 0) return "Assessed today";
  if (days === 1) return "Assessed 1d ago";
  if (days < 30) return `Assessed ${days}d ago`;
  return "Re-assess soon";
}
