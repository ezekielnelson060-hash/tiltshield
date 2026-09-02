/**
 * Real-world offline value paths if cards/banks are impaired for a long period.
 * Educational only — not financial advice.
 */

export type OfflinePath = {
  id: string;
  title: string;
  why: string;
  action: string;
  searchQuery?: string;
  href?: string;
  scope: "local" | "national" | "online";
};

export const OFFLINE_VALUE_PATHS: OfflinePath[] = [
  {
    id: "cash-float",
    title: "Physical cash float",
    why: "Cards and apps fail together when rails or power fail.",
    action: "Keep a tested small float for 2–4 weeks of essentials.",
    searchQuery: "ATM bank",
    scope: "local",
  },
  {
    id: "hardware-wallet",
    title: "Self-custody learning (hardware wallet)",
    why: "If you already hold digital assets, custody skill matters when exchanges freeze.",
    action: "Learn recovery phrases offline; buy only from official makers.",
    href: "https://www.ledger.com/",
    scope: "online",
  },
  {
    id: "hw-trezor",
    title: "Hardware wallet makers (official)",
    why: "Avoid random marketplaces for devices that hold keys.",
    action: "Compare official vendors only; practice a dry-run restore.",
    href: "https://trezor.io/",
    scope: "online",
  },
  {
    id: "precious-metals",
    title: "Allocated metals dealers",
    why: "Some households diversify into physical metals through regulated dealers.",
    action: "Search national dealers; understand storage and liquidity before buying.",
    searchQuery: "gold silver bullion dealer",
    scope: "national",
  },
  {
    id: "jewelry-coins",
    title: "Coins & jewelry shops",
    why: "Local liquidity varies; know reputable shops before stress.",
    action: "Map one trusted shop in your region — not a panic purchase plan.",
    searchQuery: "gold coin dealer jewelry",
    scope: "national",
  },
  {
    id: "land-records",
    title: "Property & land records offline",
    why: "Title docs and IDs matter more when systems stall.",
    action: "Store copies in Vault; know where originals live.",
    scope: "local",
  },
  {
    id: "alt-payment",
    title: "Second payment rail",
    why: "One bank app is a single point of failure.",
    action: "Test a second method this month (cash, alternate bank, or trusted person).",
    searchQuery: "bank branch",
    scope: "local",
  },
];
