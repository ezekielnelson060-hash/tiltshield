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

/** Independent Finder — preparation network (OSM-friendly queries). */
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
  {
    id: "essentials",
    title: "Essentials map",
    blurb: "Food, meds, fuel — know them before you need them.",
  },
  {
    id: "offgrid",
    title: "Off-grid directory",
    blurb: "Farms, hardware, outdoor, solar, water — supply outside fragile apps.",
  },
  {
    id: "cash",
    title: "Local cash map",
    blurb: "ATMs and banks — cash access when rails fail.",
  },
  {
    id: "community",
    title: "Community network",
    blurb: "Centers, learning spaces, halls — people you can reach offline.",
  },
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

export async function searchNearbyPlaces(
  query: string,
  coords?: { lat: number; lng: number } | null
): Promise<NearbyPlace[]> {
  const q = query.trim();
  if (!q) return [];

  const params = new URLSearchParams({
    q,
    format: "json",
    addressdetails: "1",
    limit: "12",
  });
  if (coords) {
    const d = 0.22;
    params.set(
      "viewbox",
      `${coords.lng - d},${coords.lat + d},${coords.lng + d},${coords.lat - d}`
    );
    params.set("bounded", "1");
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
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

export function mapsSearchUrl(
  query: string,
  lat?: number,
  lng?: number
): string {
  return googleMapsSearchUrl(query, lat, lng);
}
