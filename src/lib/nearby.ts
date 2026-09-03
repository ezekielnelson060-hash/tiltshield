export type NearbyCategory =
  | "food"
  | "farm"
  | "pharmacy"
  | "medical"
  | "fuel"
  | "banking"
  | "cash"
  | "hardware"
  | "outdoor"
  | "solar"
  | "water"
  | "community"
  | "homeschool"
  | "events"
  | "emergency"
  | "shelter"
  | "transport"
  | "utilities";

export const NEARBY_CATEGORIES: {
  id: NearbyCategory;
  label: string;
  query: string;
  group: "essentials" | "offgrid" | "cash" | "community";
}[] = [
  { id: "food", label: "Grocery", query: "supermarket", group: "essentials" },
  { id: "pharmacy", label: "Pharmacy", query: "pharmacy", group: "essentials" },
  { id: "medical", label: "Clinic", query: "clinic hospital", group: "essentials" },
  { id: "fuel", label: "Fuel", query: "fuel station", group: "essentials" },
  { id: "farm", label: "Local farms", query: "farmers market", group: "offgrid" },
  { id: "hardware", label: "Hardware", query: "hardware", group: "offgrid" },
  { id: "outdoor", label: "Outdoor supply", query: "camping", group: "offgrid" },
  { id: "solar", label: "Solar / energy", query: "solar", group: "offgrid" },
  { id: "water", label: "Water", query: "bottled water", group: "offgrid" },
  { id: "cash", label: "Cash / ATM", query: "ATM", group: "cash" },
  { id: "banking", label: "Bank", query: "bank", group: "cash" },
  { id: "community", label: "Community center", query: "community centre", group: "community" },
  { id: "homeschool", label: "Library", query: "library", group: "community" },
  { id: "events", label: "Event space", query: "community hall", group: "community" },
  { id: "emergency", label: "Emergency", query: "hospital", group: "essentials" },
  { id: "shelter", label: "Shelter", query: "hotel", group: "essentials" },
  { id: "transport", label: "Transport", query: "bus station", group: "essentials" },
  { id: "utilities", label: "Utilities", query: "water", group: "offgrid" },
];

export const FINDER_GROUPS: {
  id: "essentials" | "offgrid" | "cash" | "community";
  title: string;
  blurb: string;
}[] = [
  { id: "essentials", title: "Essentials", blurb: "Food, meds, fuel." },
  { id: "offgrid", title: "Off-grid", blurb: "Farms, tools, power, water." },
  { id: "cash", title: "Cash map", blurb: "ATM and banks." },
  { id: "community", title: "Community", blurb: "Places people meet." },
];

export type NearbyPlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
  address: string;
  distanceKm?: number;
  /** meters — for UI helpers that expect m */
  distanceM?: number;
};

function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const SEARCH_ALIASES: Record<string, string[]> = {
  pharmacy: ["pharmacy", "chemist", "drugstore"],
  atm: ["ATM", "bank", "cash machine"],
  cash: ["ATM", "bank", "money exchange"],
  farm: ["farmers market", "market", "farm shop"],
  "farm market": ["farmers market", "market"],
  generator: ["hardware", "electronics", "generator"],
  rice: ["supermarket", "grocery", "market"],
  "bottled water": ["bottled water", "supermarket", "water"],
  water: ["bottled water", "supermarket", "spring water"],
  fuel: ["fuel", "petrol", "gas station", "filling station"],
  clinic: ["clinic", "hospital", "medical centre"],
  hospital: ["hospital", "clinic"],
  hardware: ["hardware", "tools", "DIY"],
  supermarket: ["supermarket", "grocery", "hypermarket"],
  grocery: ["supermarket", "grocery", "convenience"],
  solar: ["solar", "photovoltaic", "renewable energy"],
  library: ["library", "public library"],
  "bus station": ["bus station", "bus stop", "transit"],
  hotel: ["hotel", "motel", "guest house"],
};

function expandQueries(query: string): string[] {
  const key = query.trim().toLowerCase();
  const aliased = SEARCH_ALIASES[key];
  if (aliased) return [...new Set([query, ...aliased])];
  for (const [k, vals] of Object.entries(SEARCH_ALIASES)) {
    if (key.includes(k) || k.includes(key)) return [...new Set([query, ...vals])];
  }
  return [query];
}

async function nominatimOnce(
  q: string,
  coords: { lat: number; lng: number } | null | undefined,
  mode: "local" | "wide" | "national",
  limit: number
): Promise<NearbyPlace[]> {
  const params = new URLSearchParams({
    q,
    format: "json",
    addressdetails: "1",
    limit: String(limit),
  });
  if (coords && mode === "local") {
    const d = 0.55;
    params.set(
      "viewbox",
      `${coords.lng - d},${coords.lat + d},${coords.lng + d},${coords.lat - d}`
    );
    params.set("bounded", "0");
  } else if (coords && mode === "wide") {
    const d = 2.2;
    params.set(
      "viewbox",
      `${coords.lng - d},${coords.lat + d},${coords.lng + d},${coords.lat - d}`
    );
  } else if (coords && mode === "national") {
    params.set("lat", String(coords.lat));
    params.set("lon", String(coords.lng));
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
        "User-Agent":
          "TiltshieldResilienceApp/1.0 (https://tiltshield.vercel.app)",
      },
    }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type?: string;
    class?: string;
  }>;
  const origin = coords ? { lat: coords.lat, lon: coords.lng } : null;
  return data.map((row) => {
    const lat = parseFloat(row.lat);
    const lon = parseFloat(row.lon);
    const parts = row.display_name.split(",");
    const distanceKm = origin
      ? Math.round(haversineKm(origin, { lat, lon }) * 10) / 10
      : undefined;
    return {
      id: String(row.place_id),
      name: parts[0]?.trim() || "Place",
      lat,
      lon,
      type: row.type || row.class || "place",
      address: parts.slice(1, 4).join(",").trim(),
      distanceKm,
      distanceM:
        distanceKm != null ? Math.round(distanceKm * 1000) : undefined,
    };
  });
}

/** Multi-query parallel per mode + local → wide → national fallback. */
export async function searchNearbyPlaces(
  query: string,
  coords?: { lat: number; lng: number } | null,
  opts?: { national?: boolean; limit?: number }
): Promise<NearbyPlace[]> {
  const q0 = query.trim();
  if (!q0) return [];
  const limit = opts?.limit ?? 12;
  const queries = expandQueries(q0).slice(0, 4);
  const modes: Array<"local" | "wide" | "national"> = opts?.national
    ? ["national", "wide"]
    : ["local", "wide", "national"];

  const seen = new Set<string>();
  const out: NearbyPlace[] = [];

  for (const mode of modes) {
    try {
      const batches = await Promise.all(
        queries.map((q) =>
          nominatimOnce(q, coords, mode, Math.max(limit, 10)).catch(() => [])
        )
      );
      for (const batch of batches) {
        for (const p of batch) {
          if (seen.has(p.id)) continue;
          seen.add(p.id);
          out.push(p);
        }
      }
    } catch {
      /* next mode */
    }
    if (out.length >= 6) break;
    await new Promise((r) => setTimeout(r, 120));
  }

  if (coords)
    out.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  return out.slice(0, limit);
}

export function googleMapsSearchUrl(
  query: string,
  lat?: number,
  lng?: number
): string {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},14z`;
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

export function mapsSearchUrl(
  query: string,
  lat?: number,
  lng?: number
): string {
  return googleMapsSearchUrl(query, lat, lng);
}
