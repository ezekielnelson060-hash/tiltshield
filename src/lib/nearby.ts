export type NearbyCategory =
  | "food"
  | "pharmacy"
  | "medical"
  | "fuel"
  | "banking"
  | "transport"
  | "hardware"
  | "utilities"
  | "emergency"
  | "shelter";

export const NEARBY_CATEGORIES: {
  id: NearbyCategory;
  label: string;
  query: string;
}[] = [
  { id: "food", label: "Food", query: "supermarket" },
  { id: "pharmacy", label: "Pharmacy", query: "pharmacy" },
  { id: "medical", label: "Medical", query: "hospital" },
  { id: "fuel", label: "Fuel", query: "fuel" },
  { id: "banking", label: "Banking", query: "bank" },
  { id: "transport", label: "Transport", query: "bus station" },
  { id: "hardware", label: "Hardware", query: "hardware" },
  { id: "utilities", label: "Utilities", query: "water" },
  { id: "emergency", label: "Emergency", query: "police" },
  { id: "shelter", label: "Shelter", query: "hotel" },
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
    const d = 0.18;
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

  return data.map((row) => {
    const lat = parseFloat(row.lat);
    const lon = parseFloat(row.lon);
    const place: NearbyPlace = {
      id: String(row.place_id),
      name: row.display_name.split(",")[0] || row.display_name,
      lat,
      lon,
      type: row.type || row.class || "place",
      address: row.display_name,
    };
    if (coords) {
      place.distanceKm = haversineKm(
        { lat: coords.lat, lon: coords.lng },
        { lat, lon }
      );
    }
    return place;
  });
}

export function osmEmbedUrl(lat: number, lon: number, marker = true): string {
  const d = 0.025;
  const bbox = [lon - d, lat - d, lon + d, lat + d].join("%2C");
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
