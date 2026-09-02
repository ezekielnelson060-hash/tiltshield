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
    tagline: "Time when the usual income pauses.",
    reframe:
      "The version of you that already set a little aside sleeps better. Not because the world is safe — because you bought yourself days.",
    steps: [
      { title: "Know your real number", detail: "Open Calculators with the income and bills you actually have." },
      { title: "Open a small buffer pocket", detail: "Any amount, labeled, that you do not spend on normal life." },
      { title: "Try a second way to pay", detail: "Cash, another bank, or a method that still works if one app fails." },
      { title: "Know two cash spots", detail: "ATMs or branches on different networks near home and work." },
    ],
    places: [
      { label: "Find cash nearby", query: "ATM", internal: "/app/nearby" },
      { label: "Offline value paths", internal: "/app/offline-value" },
      { label: "Bank near you", query: "bank" },
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
    tagline: "Your life, even if the phone is gone.",
    reframe:
      "You are not your device. Recovery codes, a paper path, and one person who can reach you — that is how you stay you.",
    steps: [
      { title: "List what the phone unlocks", detail: "Bank, email, work, ID apps — anything that would lock you out." },
      { title: "Print or store recovery codes", detail: "Not only text messages. Vault or paper in a safe place." },
      { title: "Practice one restore", detail: "If you use a backup phrase, try it while calm." },
      { title: "Tell one person the plan", detail: "How they reach you if your number is silent." },
    ],
    places: [
      { label: "Hardware wallet", href: "https://www.ledger.com/" },
      { label: "Trezor", href: "https://trezor.io/" },
      { label: "Open Vault", internal: "/app/vault" },
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
    tagline: "Food and water you will actually use.",
    reframe:
      "A calm pantry is boring on purpose. Future-you wants dated shelves and water that is ready — not a theory.",
    steps: [
      { title: "Count real meals", detail: "Days of food your household will eat — not survival fantasy." },
      { title: "Water you can reach", detail: "Stored liters plus a simple way to make more safe." },
      { title: "Put dates on everything", detail: "Use the oldest first so nothing becomes waste." },
      { title: "Know a second store", detail: "A market or farm path that is not only one supermarket app." },
    ],
    places: [
      { label: "Grocery", query: "supermarket" },
      { label: "Farm market", query: "farmers market" },
      { label: "Water", query: "bottled water" },
    ],
    deepLinks: [
      { label: "1-year stock", href: "/app/prepare" },
      { label: "Guides", href: "/app/guides" },
      { label: "Finder", href: "/app/nearby" },
    ],
  },
  {
    key: "home",
    label: "Home",
    tagline: "Light, tools, and warmth when the grid blinks.",
    reframe:
      "Home is not only an address. It is whether you still have light, a basic kit, and a place to meet when the street goes quiet.",
    steps: [
      { title: "Check a 72-hour kit", detail: "Light, batteries, tape, multi-tool, copies of IDs." },
      { title: "Charge power banks", detail: "One full cycle this week." },
      { title: "Know a hardware store", detail: "Filters, fasteners, simple repairs." },
      { title: "Agree a meetup place", detail: "Somewhere your household can find without one phone." },
    ],
    places: [
      { label: "Hardware", query: "hardware" },
      { label: "Outdoor supply", query: "camping" },
      { label: "Solar / energy", query: "solar" },
    ],
    deepLinks: [
      { label: "Prepare", href: "/app/prepare" },
      { label: "What If", href: "/app/what-if" },
      { label: "Finder", href: "/app/nearby" },
    ],
  },
  {
    key: "communication",
    label: "Mobility",
    tagline: "People and paths without one app.",
    reframe:
      "Mobility is not only a car. It is who you can reach and which roads still make sense when maps lag.",
    steps: [
      { title: "Three numbers on paper", detail: "People who matter if the phone book is gone." },
      { title: "Primary and backup meetup", detail: "Two places your household already knows." },
      { title: "Fuel or transit plan", detail: "A station or line that is not only inside an app." },
      { title: "Pin a community place", detail: "Somewhere people already gather for information." },
    ],
    places: [
      { label: "Fuel", query: "fuel" },
      { label: "Community center", query: "community centre" },
      { label: "Transit", query: "bus station" },
    ],
    deepLinks: [
      { label: "Household", href: "/app/family" },
      { label: "Finder", href: "/app/nearby" },
      { label: "Prepare", href: "/app/prepare" },
    ],
  },
  {
    key: "skills",
    label: "Health",
    tagline: "Meds, first aid, steady hands.",
    reframe:
      "Health readiness is quiet lists: medicine you cannot skip, a kit you have opened, a clinic you can name without searching.",
    steps: [
      { title: "Critical meds buffer", detail: "Only as your clinician allows — plan refills early." },
      { title: "Open the first-aid kit", detail: "Replace what is expired this month." },
      { title: "Pin clinic and pharmacy", detail: "Including late hours if they exist near you." },
      { title: "One skill while calm", detail: "Stop a bleed, purify water, or keep food safe without power." },
    ],
    places: [
      { label: "Pharmacy", query: "pharmacy" },
      { label: "Clinic", query: "clinic hospital" },
    ],
    deepLinks: [
      { label: "Prepare", href: "/app/prepare" },
      { label: "Guides", href: "/app/guides" },
      { label: "Finder", href: "/app/nearby" },
    ],
  },
  {
    key: "documents",
    label: "Community",
    tagline: "Papers and people you can trust.",
    reframe:
      "Community is stored trust. Documents offline plus a few humans who would answer without an app — that is infrastructure.",
    steps: [
      { title: "IDs in Vault", detail: "Encrypted copies of what you cannot easily replace." },
      { title: "One paper packet", detail: "ID copies, contacts, insurance if you have it." },
      { title: "Three people", detail: "Who you can reach offline this week." },
      { title: "A public anchor", detail: "Library or hall you could walk to for information." },
    ],
    places: [
      { label: "Library", query: "library" },
      { label: "Community center", query: "community center" },
      { label: "Vault", internal: "/app/vault" },
    ],
    deepLinks: [
      { label: "Vault", href: "/app/vault" },
      { label: "Household", href: "/app/family" },
      { label: "Finder", href: "/app/nearby" },
    ],
  },
  {
    key: "emergency",
    label: "Emergency",
    tagline: "Seventy-two hours without heroics.",
    reframe:
      "Emergency readiness is not panic shopping. It is a bag, a plan, and a path you walked once while the lights were still on.",
    steps: [
      { title: "Bag check", detail: "Water, light, meds list, cash, paper contacts." },
      { title: "Leave or stay rules", detail: "Simple written rules for your household." },
      { title: "Nearest help on the map", detail: "Clinic and services you could reach on foot if needed." },
      { title: "Ten-minute drill", detail: "Practice the grab once this month." },
    ],
    places: [
      { label: "Emergency services", query: "hospital" },
      { label: "Clinic", query: "clinic" },
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
