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

/** Independent Finder — preparation network categories (OSM-friendly queries). */
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
  { id: "farm", label: "Local farms", query: "farm market CSA", group: "offgrid" },
  { id: "hardware", label: "Hardware", query: "hardware store", group: "offgrid" },
  { id: "outdoor", label: "Outdoor supply", query: "outdoor camping store", group: "offgrid" },
  { id: "solar", label: "Solar / energy", query: "solar renewable energy", group: "offgrid" },
  { id: "water", label: "Water", query: "water supply well", group: "offgrid" },
  { id: "cash", label: "Cash / ATM", query: "ATM cash", group: "cash" },
  { id: "banking", label: "Bank", query: "bank", group: "cash" },
  { id: "community", label: "Community center", query: "community centre community center", group: "community" },
  { id: "homeschool", label: "Homeschool / education", query: "school library", group: "community" },
  { id: "events", label: "Event space", query: "event hall conference", group: "community" },
  { id: "emergency", label: "Emergency", query: "police fire station", group: "essentials" },
  { id: "shelter", label: "Shelter", query: "hotel", group: "essentials" },
  { id: "transport", label: "Transport", query: "bus station", group: "essentials" },
  { id: "utilities", label: "Utilities", query: "water utility", group: "offgrid" },
];

export const FINDER_GROUPS: {
  id: "essentials" | "offgrid" | "cash" | "community";
  title: string;
  blurb: string;
}[] = [
  { id: "essentials", title: "Essentials map", blurb: "Food, meds, fuel — know them before you need them." },
  { id: "offgrid", title: "Off-grid directory", blurb: "Farms, hardware, outdoor, solar, water — supply outside fragile apps." },
  { id: "cash", title: "Local cash map", blurb: "ATMs and banks — cash access when rails fail." },
  { id: "community", title: "Community network", blurb: "Centers, learning spaces, halls — people you can reach offline." },
];

export type NearbyPlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
  address: string;
  distanceKm?: number;
};

function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Map user/chip language → OSM-friendly queries (multi-try). */
export const SEARCH_ALIASES: Record<string, string[]> = {
  "free water": ["drinking water", "water fountain", "bottled water", "water"],
  water: ["bottled water", "water", "supermarket"],
  "outdoor supply": ["outdoor", "camping", "sporting goods", "hardware"],
  outdoor: ["camping", "outdoor", "sport"],
  solar: ["solar", "photovoltaic", "electronics"],
  pharmacy: ["pharmacy", "chemist", "drugstore"],
  atm: ["atm", "bank"],
  cash: ["atm", "bank", "money transfer"],
  farm: ["farm", "market", "farmers market"],
  "farm market": ["farmers market", "market", "grocery"],
  generator: ["hardware", "electronics", "power equipment"],
  rice: ["supermarket", "grocery", "market"],
  "bottled water": ["bottled water", "supermarket", "water"],
  fuel: ["fuel", "gas station", "petrol"],
  clinic: ["clinic", "hospital", "doctor"],
  hardware: ["hardware", "home improvement", "tools"],
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
    const d = 0.45;
    params.set(
      "viewbox",
      `${coords.lng - d},${coords.lat + d},${coords.lng + d},${coords.lat - d}`
    );
    params.set("bounded", "1");
  } else if (coords && mode === "wide") {
    const d = 0.9;
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
        "User-Agent": "TiltshieldResilienceApp/1.0 (https://tiltshield.vercel.app)",
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
    const name = parts[0]?.trim() || "Place";
    const address = parts.slice(1, 4).join(",").trim();
    const distanceKm = origin
      ? Math.round(haversineKm(origin, { lat, lon }) * 10) / 10
      : undefined;
    return {
      id: String(row.place_id),
      name,
      lat,
      lon,
      type: row.type || row.class || "place",
      address,
      distanceKm,
    };
  });
}

export async function searchNearbyPlaces(
  query: string,
  coords?: { lat: number; lng: number } | null,
  opts?: { national?: boolean; limit?: number }
): Promise<NearbyPlace[]> {
  const q0 = query.trim();
  if (!q0) return [];
  const limit = opts?.limit ?? 12;
  const queries = expandQueries(q0);
  // Local-first only when we have coords — never national dump of distant places
  const modes: Array<"local" | "wide" | "national"> = opts?.national
    ? ["wide", "national"]
    : coords
      ? ["local", "wide"]
      : ["local"];

  const seen = new Set<string>();
  const out: NearbyPlace[] = [];

  for (const mode of modes) {
    for (const q of queries) {
      try {
        const batch = await nominatimOnce(q, coords, mode, limit);
        for (const p of batch) {
          if (seen.has(p.id)) continue;
          seen.add(p.id);
          out.push(p);
        }
        if (out.length >= 5) break;
      } catch {
        /* try next */
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    if (out.length >= 3) break;
  }

  if (coords) {
    out.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  }
  // Prefer truly local results when we know the user location
  if (coords) {
    const local = out.filter((p) => p.distanceKm == null || p.distanceKm <= 40);
    if (local.length) return local.slice(0, limit);
    const regional = out.filter((p) => p.distanceKm == null || p.distanceKm <= 80);
    if (regional.length) return regional.slice(0, limit);
    const far = out.filter((p) => p.distanceKm == null || p.distanceKm <= 150);
    if (far.length) return far.slice(0, limit);
    return [];
  }
  return out.slice(0, limit);
}

export function osmEmbedUrl(
  lat: number,
  lon: number,
  marker = true
): string {
  const d = 0.02;
  const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`;
  let url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  if (marker) url += `&marker=${lat}%2C${lon}`;
  return url;
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

export function mapsSearchUrl(query: string, lat?: number, lng?: number): string {
  return googleMapsSearchUrl(query, lat, lng);
}
