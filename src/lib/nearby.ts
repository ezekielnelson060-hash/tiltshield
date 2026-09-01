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
  { id: "food", label: "Food", query: "grocery store" },
  { id: "pharmacy", label: "Pharmacy", query: "pharmacy" },
  { id: "medical", label: "Medical", query: "hospital clinic" },
  { id: "fuel", label: "Fuel", query: "gas station fuel" },
  { id: "banking", label: "Banking", query: "bank ATM" },
  { id: "transport", label: "Transport", query: "transit station" },
  { id: "hardware", label: "Hardware", query: "hardware store" },
  { id: "utilities", label: "Utilities", query: "utility services" },
  { id: "emergency", label: "Emergency", query: "emergency services" },
  { id: "shelter", label: "Shelter", query: "shelter hotel" },
];

export function mapsSearchUrl(query: string, lat?: number, lng?: number): string {
  if (lat != null && lng != null) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}#map=15/${lat}/${lng}`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
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
