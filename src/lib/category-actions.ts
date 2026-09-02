/**
 * Per-dimension action pages — concrete moves + places (Finder / offline value).
 */

export type CategoryKey =
  | "money"
  | "digital"
  | "food"
  | "home"
  | "communication"
  | "skills"
  | "documents"
  | "emergency";

export type CategoryAction = {
  key: CategoryKey;
  label: string;
  tagline: string;
  reframe: string;
  steps: { title: string; detail: string }[];
  places: { label: string; query?: string; href?: string; internal?: string }[];
  deepLinks: { label: string; href: string }[];
};

export const CATEGORY_ACTIONS: CategoryAction[] = [
  {
    key: "money",
    label: "Money",
    tagline: "Runway you can touch.",
    reframe:
      "When rails freeze, the version of you that already moved cash and named a second path is the one protected — not the one who planned to start next month.",
    steps: [
      { title: "Name your true runway", detail: "Use Calculators with real income and essentials — days, not vibes." },
      { title: "Separate a buffer", detail: "Any amount in a labeled pocket beats mixed spending money." },
      { title: "Test a second rail", detail: "Cash float + another bank or trusted offline path." },
      { title: "Map cash access", detail: "Two ATMs on different networks near home and work." },
    ],
    places: [
      { label: "ATM / cash map", query: "ATM bank", internal: "/app/nearby" },
      { label: "Offline value paths", internal: "/app/offline-value" },
      { label: "Bank branch near you", query: "bank branch" },
    ],
    deepLinks: [
      { label: "Calculators", href: "/app/calculators" },
      { label: "What If", href: "/app/what-if" },
      { label: "Offline value", href: "/app/offline-value" },
    ],
  },
  {
    key: "digital",
    label: "Digital",
    tagline: "Accounts that survive a lost phone.",
    reframe:
      "Your life is not inside one glass rectangle. Recovery paths and a paper backup are how you stay you when the device is gone.",
    steps: [
      { title: "List critical accounts", detail: "Bank, email, ID, work — who can lock you out." },
      { title: "Turn on offline recovery", detail: "Codes printed or in Vault — not only SMS." },
      { title: "Practice one restore", detail: "If you use self-custody tools, dry-run recovery offline." },
      { title: "Second device path", detail: "How a household member reaches you without your primary phone." },
    ],
    places: [
      { label: "Hardware wallet (official)", href: "https://www.ledger.com/" },
      { label: "Trezor (official)", href: "https://trezor.io/" },
      { label: "Document Vault", internal: "/app/vault" },
    ],
    deepLinks: [
      { label: "Vault", href: "/app/vault" },
      { label: "Offline value", href: "/app/offline-value" },
      { label: "What If", href: "/app/what-if" },
    ],
  },
  {
    key: "food",
    label: "Essentials",
    tagline: "Food and water that rotate.",
    reframe:
      "A calm pantry is boring on purpose. The 3am version of you wants dated jars and a water plan — not a shopping theory.",
    steps: [
      { title: "Count real days of food you eat", detail: "Meals your household will actually use." },
      { title: "Water store + purify", detail: "Liters at home and a simple purify method." },
      { title: "Rotation labels", detail: "FIFO dates so stock does not become waste." },
      { title: "Map one farm / market", detail: "A supply line outside pure supermarket apps." },
    ],
    places: [
      { label: "Grocery", query: "supermarket" },
      { label: "Farm market / CSA", query: "farm market CSA" },
      { label: "Water / bottled", query: "water store bottled" },
    ],
    deepLinks: [
      { label: "Prepare · 1-year stock", href: "/app/prepare" },
      { label: "Guides", href: "/app/guides" },
      { label: "Independent Finder", href: "/app/nearby" },
    ],
  },
  {
    key: "home",
    label: "Home",
    tagline: "Light, heat, tools when the grid blinks.",
    reframe:
      "Home is not only an address — it is whether light, warmth, and a basic kit still work when the street goes quiet.",
    steps: [
      { title: "72-hour kit check", detail: "Light, batteries, tape, multi-tool, copies of IDs." },
      { title: "Power banks charged", detail: "One full cycle this week." },
      { title: "Know hardware store", detail: "Filters, fasteners, basic repairs." },
      { title: "Meet point", detail: "Household meeting place that does not depend on one phone." },
    ],
    places: [
      { label: "Hardware", query: "hardware store" },
      { label: "Outdoor / camping supply", query: "outdoor camping store" },
      { label: "Solar / energy", query: "solar renewable energy" },
    ],
    deepLinks: [
      { label: "Prepare", href: "/app/prepare" },
      { label: "What If", href: "/app/what-if" },
      { label: "Finder · Off-grid", href: "/app/nearby" },
    ],
  },
  {
    key: "communication",
    label: "Mobility",
    tagline: "People and routes without one app.",
    reframe:
      "Mobility is not only a car — it is who you can reach and which paths still make sense when maps lag.",
    steps: [
      { title: "Offline contact sheet", detail: "Write three numbers that matter; keep a paper copy." },
      { title: "Household meetup", detail: "Primary and backup places." },
      { title: "Fuel or transit plan", detail: "A station or line that is not only in an app." },
      { title: "Community center pin", detail: "A place people already gather." },
    ],
    places: [
      { label: "Fuel", query: "fuel station" },
      { label: "Community center", query: "community centre community center" },
      { label: "Transit", query: "bus station" },
    ],
    deepLinks: [
      { label: "Family / household", href: "/app/family" },
      { label: "Finder · Community", href: "/app/nearby" },
      { label: "Prepare · network", href: "/app/prepare" },
    ],
  },
  {
    key: "skills",
    label: "Health",
    tagline: "Meds, first aid, steady hands.",
    reframe:
      "Health resilience is boring lists: meds you cannot skip, a kit you have opened, a clinic you can name without search.",
    steps: [
      { title: "Critical meds buffer", detail: "Only as your clinician allows — plan refills early." },
      { title: "First-aid kit audit", detail: "Replace expired items this month." },
      { title: "Clinic + pharmacy pins", detail: "Including late hours if they exist." },
      { title: "One basic skill", detail: "Stop bleed, purify water, or power-safe food — practice once calm." },
    ],
    places: [
      { label: "Pharmacy", query: "pharmacy" },
      { label: "Clinic / hospital", query: "clinic hospital" },
    ],
    deepLinks: [
      { label: "Prepare", href: "/app/prepare" },
      { label: "Guides", href: "/app/guides" },
      { label: "Independent Finder", href: "/app/nearby" },
    ],
  },
  {
    key: "documents",
    label: "Community",
    tagline: "Papers and people.",
    reframe:
      "Community is stored trust. Documents offline plus three humans who would answer without an app is infrastructure.",
    steps: [
      { title: "IDs in Vault", detail: "Encrypted copies of what you cannot replace easily." },
      { title: "Paper packet", detail: "One envelope: ID copies, contacts, insurance if any." },
      { title: "Three people", detail: "Who you can reach offline this week." },
      { title: "Local hall / library", detail: "A public anchor for information." },
    ],
    places: [
      { label: "Library", query: "library" },
      { label: "Community center", query: "community center" },
      { label: "Vault", internal: "/app/vault" },
    ],
    deepLinks: [
      { label: "Vault", href: "/app/vault" },
      { label: "Family", href: "/app/family" },
      { label: "Finder · Community", href: "/app/nearby" },
    ],
  },
  {
    key: "emergency",
    label: "Emergency",
    tagline: "72 hours without heroics.",
    reframe:
      "Emergency readiness is not panic shopping. It is a bag, a plan, and a path you have walked once while calm.",
    steps: [
      { title: "Bag check", detail: "Water, light, meds list, cash float, paper contacts." },
      { title: "Leave / stay criteria", detail: "Write the simple rules for your household." },
      { title: "Emergency services map", detail: "Nearest clinic and station." },
      { title: "Drill once", detail: "10-minute grab practice this month." },
    ],
    places: [
      { label: "Emergency services", query: "police fire station" },
      { label: "Clinic", query: "hospital clinic" },
      { label: "Pharmacy", query: "pharmacy" },
    ],
    deepLinks: [
      { label: "What If", href: "/app/what-if" },
      { label: "Prepare", href: "/app/prepare" },
      { label: "Actions", href: "/app/actions" },
    ],
  },
];

export function getCategoryAction(key: string): CategoryAction | undefined {
  return CATEGORY_ACTIONS.find((c) => c.key === key);
}
