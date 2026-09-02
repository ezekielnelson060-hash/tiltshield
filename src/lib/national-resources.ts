/**
 * Country-agnostic national / official resource templates.
 * Used when local inventory is thin — not a verified dealer database.
 */

export type NationalResource = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  category: "custody" | "metals" | "education" | "maps";
};

export const NATIONAL_RESOURCES: NationalResource[] = [
  {
    id: "ledger",
    title: "Ledger (official)",
    blurb: "Hardware wallet manufacturer — buy only from official channels.",
    href: "https://www.ledger.com/",
    category: "custody",
  },
  {
    id: "trezor",
    title: "Trezor (official)",
    blurb: "Hardware wallet manufacturer — practice recovery offline.",
    href: "https://trezor.io/",
    category: "custody",
  },
  {
    id: "osm",
    title: "OpenStreetMap search",
    blurb: "Widen map search beyond your city for dealers and services.",
    href: "https://www.openstreetmap.org/",
    category: "maps",
  },
  {
    id: "bis-cbdc",
    title: "BIS — CBDC literature",
    blurb: "Public research on digital currency experiments (context, not advice).",
    href: "https://www.bis.org/cbdcs.htm",
    category: "education",
  },
];
