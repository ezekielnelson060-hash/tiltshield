/**
 * Curated Independent Directory templates — legal, public business categories.
 * Users search live OSM + can seed saved vendors from these playbooks.
 */

export type DirectoryEntry = {
  id: string;
  title: string;
  blurb: string;
  searchQuery: string;
  group: "offgrid" | "cash" | "community" | "essentials";
  tip: string;
};

export const CURATED_DIRECTORY: DirectoryEntry[] = [
  {
    id: "csa-farm",
    title: "Local farms & CSAs",
    blurb: "Direct food supply through farm markets and community-supported agriculture.",
    searchQuery: "farm market CSA",
    group: "offgrid",
    tip: "Save one farm stand and one weekly market you can reach without an app.",
  },
  {
    id: "butcher-coop",
    title: "Butchers & co-ops",
    blurb: "Local protein and bulk staples outside pure supermarket rails.",
    searchQuery: "butcher cooperative grocery",
    group: "offgrid",
    tip: "Note cash acceptance and hours for a disruption week.",
  },
  {
    id: "hardware",
    title: "Hardware stores",
    blurb: "Tools, filters, fasteners, basic repairs.",
    searchQuery: "hardware store",
    group: "offgrid",
    tip: "Know the closest shop with generically useful stock.",
  },
  {
    id: "outdoor",
    title: "Outdoor / camping supply",
    blurb: "Light, water storage, weather gear through standard outdoor retailers.",
    searchQuery: "outdoor camping store",
    group: "offgrid",
    tip: "One store for power banks, water containers, and layers.",
  },
  {
    id: "solar",
    title: "Solar & renewable installers",
    blurb: "Legal residential solar and battery businesses in your area.",
    searchQuery: "solar renewable energy",
    group: "offgrid",
    tip: "Research installers before a rush — quotes take time.",
  },
  {
    id: "water",
    title: "Water access points",
    blurb: "Bottled water retailers and supply context.",
    searchQuery: "water store bottled",
    group: "offgrid",
    tip: "Pair with your home store + purify plan in Prepare.",
  },
  {
    id: "atm-cash",
    title: "Cash access",
    blurb: "ATMs and bank branches when digital rails stall.",
    searchQuery: "ATM bank",
    group: "cash",
    tip: "Two ATMs on different networks beats one favorite machine.",
  },
  {
    id: "pharmacy",
    title: "Pharmacies",
    blurb: "Meds and basics — including late-hour options where they exist.",
    searchQuery: "pharmacy",
    group: "essentials",
    tip: "Save a 24h option if your city has one.",
  },
  {
    id: "community",
    title: "Community centers",
    blurb: "Public halls and centers that stay useful offline.",
    searchQuery: "community centre community center",
    group: "community",
    tip: "Know a meeting point that does not depend on one phone.",
  },
  {
    id: "library-school",
    title: "Libraries & learning spaces",
    blurb: "Public libraries and schools as information and gathering anchors.",
    searchQuery: "library school",
    group: "community",
    tip: "Useful for print info and local bulletin boards.",
  },
  {
    id: "event-hall",
    title: "Event & assembly halls",
    blurb: "Spaces communities already use for gatherings.",
    searchQuery: "event hall conference center",
    group: "community",
    tip: "Logistics: where people already meet.",
  },
];

export function directoryByGroup(group: DirectoryEntry["group"]) {
  return CURATED_DIRECTORY.filter((e) => e.group === group);
}
