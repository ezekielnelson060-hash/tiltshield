export type Guide = {
  slug: string;
  title: string;
  blurb: string;
  horizon: string;
  minutes: number;
  reframe: string;
  body: string[];
  placeLinks?: { label: string; href: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "water-year",
    title: "Water for a year mindset",
    blurb: "Store, purify, rotate — continuous access.",
    horizon: "Year",
    minutes: 8,
    reframe:
      "You are not stocking for a movie scene. You are removing one reason to panic when the tap is uncertain.",
    body: [
      "Calculate liters per person per day for two weeks first, then expand.",
      "Pair stored water with a purify method you have tested once.",
      "Rotate containers so nothing becomes a forgotten science experiment.",
    ],
    placeLinks: [
      { label: "Find water retail", href: "/app/nearby" },
      { label: "Prepare stock list", href: "/app/prepare" },
    ],
  },
  {
    slug: "food-rotation",
    title: "Food you will actually eat",
    blurb: "90 days of familiar meals, then deeper layers.",
    horizon: "90d → year",
    minutes: 10,
    reframe:
      "The calm version of you shops for the stressed version of you — same brands, dated shelves.",
    body: [
      "List seven dinners your household already accepts.",
      "Buy deeper into those, not novelty survival food.",
      "Label and FIFO. Waste is a readiness failure.",
    ],
    placeLinks: [
      { label: "Grocery / farm map", href: "/app/nearby" },
      { label: "1-year stock", href: "/app/prepare" },
    ],
  },
  {
    slug: "cash-float",
    title: "Cash when rails fail",
    blurb: "Small float, tested, separate from daily spend.",
    horizon: "Ongoing",
    minutes: 6,
    reframe:
      "Mental accounting is a feature. A labeled buffer is how you stop spending the money that was supposed to buy time.",
    body: [
      "Choose an amount that covers 2–4 weeks of essentials only.",
      "Park it where you will not swipe it for normal life.",
      "Know two ATMs before you need them.",
    ],
    placeLinks: [
      { label: "Cash map", href: "/app/nearby" },
      { label: "Offline value", href: "/app/offline-value" },
      { label: "Money focus", href: "/app/focus/money" },
    ],
  },
  {
    slug: "docs-vault",
    title: "Documents offline",
    blurb: "IDs and proofs when accounts lag.",
    horizon: "Once + review",
    minutes: 12,
    reframe:
      "Paper and encrypted copies are dull. They are also how you prove who you are when systems argue.",
    body: [
      "Scan or photograph critical IDs.",
      "Store in Vault with a passphrase you can recall offline.",
      "Keep one paper packet in a known place at home.",
    ],
    placeLinks: [
      { label: "Open Vault", href: "/app/vault" },
      { label: "Community focus", href: "/app/focus/documents" },
    ],
  },
  {
    slug: "power-light",
    title: "Light and power gaps",
    blurb: "Banks charged, kit ready, grid optional for a night.",
    horizon: "72h+",
    minutes: 7,
    reframe:
      "Darkness is when small problems feel large. Light and a charged bank shrink the night.",
    body: [
      "One headlamp or lantern per key room.",
      "Power banks on a charge schedule.",
      "Know a hardware or outdoor store for replacements.",
    ],
    placeLinks: [
      { label: "Hardware / outdoor", href: "/app/nearby" },
      { label: "Home focus", href: "/app/focus/home" },
    ],
  },
  {
    slug: "household-plan",
    title: "Household meetup plan",
    blurb: "Who, where, without one phone.",
    horizon: "Family",
    minutes: 9,
    reframe:
      "Shared dependency is invisible until it breaks. Write the meetup. Name the backup person.",
    body: [
      "Primary and backup meeting places.",
      "Three offline phone numbers on paper.",
      "Add household members in Family if you use seats.",
    ],
    placeLinks: [
      { label: "Family", href: "/app/family" },
      { label: "Mobility focus", href: "/app/focus/communication" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
