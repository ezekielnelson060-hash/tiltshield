export type Guide = {
  slug: string;
  title: string;
  blurb: string;
  horizon: string;
  minutes: number;
  reframe: string;
  /** Course sections: heading + paragraphs */
  sections: { heading: string; paragraphs: string[] }[];
  placeLinks: { label: string; href: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "water-year",
    title: "Water you can trust for a year",
    blurb: "Store, purify, rotate. Continuous access without drama.",
    horizon: "Year",
    minutes: 12,
    reframe:
      "You are not preparing for a movie. You are removing one reason to panic when the tap is uncertain.",
    sections: [
      {
        heading: "What you are building",
        paragraphs: [
          "A year of water is not one bulk buy. It is layers: short reserve at home, a purify method you have tested, and a restock habit.",
          "Start with two weeks for every person in the home. Then expand. If you try to do twelve months on day one, you will quit.",
        ],
      },
      {
        heading: "What to do this week",
        paragraphs: [
          "Count people and pets. Write liters per day for drinking and basic cooking only.",
          "Buy containers you can actually move. Label the fill date.",
          "Pick one purify method (boil, filter, or tablets) and run it once on a small batch so you know it works.",
        ],
      },
      {
        heading: "How to keep it alive",
        paragraphs: [
          "Rotate the oldest containers into normal use every few months so nothing becomes a forgotten science experiment.",
          "Save one water retail place in Nearby so you are not searching under stress.",
        ],
      },
    ],
    placeLinks: [
      { label: "Find water near you", href: "/app/nearby?q=bottled%20water" },
      { label: "Open year stock checklist", href: "/app/prepare" },
    ],
  },
  {
    slug: "food-rotation",
    title: "Food you will actually eat",
    blurb: "90 days of familiar meals, then deeper layers toward a year.",
    horizon: "90 days to year",
    minutes: 14,
    reframe:
      "Calm you shops for stressed you. Same meals. Deeper shelves. Dates on every package.",
    sections: [
      {
        heading: "The rule",
        paragraphs: [
          "Do not buy novelty survival food you will not cook. Buy more of what you already eat.",
          "Ninety days of normal food is the first real milestone. A year is that habit repeated and expanded.",
        ],
      },
      {
        heading: "What to do this week",
        paragraphs: [
          "List seven dinners your household accepts without a fight.",
          "Buy one extra cycle of those staples. Write the month on the box.",
          "Put older items in front so nothing expires in the dark.",
        ],
      },
      {
        heading: "Toward a year",
        paragraphs: [
          "Add bulk staples only after the 90-day layer feels normal.",
          "Use more than one store or a local farm when you can, so one closure does not wipe your plan.",
        ],
      },
    ],
    placeLinks: [
      { label: "Grocery map", href: "/app/nearby?q=supermarket" },
      { label: "Year stock checklist", href: "/app/prepare" },
    ],
  },
  {
    slug: "cash-float",
    title: "Cash when cards fail",
    blurb: "A small float you can touch, separate from daily spend.",
    horizon: "Ongoing",
    minutes: 10,
    reframe:
      "A labeled buffer buys time. That is the whole job of cash when payment rails stall.",
    sections: [
      {
        heading: "How much",
        paragraphs: [
          "Aim for two to four weeks of essentials only: food, transport, basic utilities, medicine. Not lifestyle spend.",
          "If that number feels impossible, start with three days and raise it every payday.",
        ],
      },
      {
        heading: "What to do this week",
        paragraphs: [
          "Withdraw a starter amount and put it where you will not swipe it by habit.",
          "Open Nearby, search ATM, and save two locations in your network.",
          "Practice paying one small bill in cash this week so the path is not theoretical.",
        ],
      },
    ],
    placeLinks: [
      { label: "Cash map", href: "/app/nearby?q=ATM" },
      { label: "Offline value paths", href: "/app/offline-value" },
    ],
  },
  {
    slug: "docs-vault",
    title: "Documents when systems argue",
    blurb: "IDs and proofs offline, not only in email.",
    horizon: "Once, then review",
    minutes: 12,
    reframe:
      "Paper and an encrypted copy are dull. They are how you prove who you are when accounts lag.",
    sections: [
      {
        heading: "What belongs offline",
        paragraphs: [
          "Identity, insurance, property or lease proof, key medical notes, and recovery codes for critical accounts.",
        ],
      },
      {
        heading: "What to do this week",
        paragraphs: [
          "Photograph or scan the minimum set.",
          "Store a copy in Vault with a passphrase you can recall without your phone.",
          "Keep one paper packet in a known place at home.",
        ],
      },
    ],
    placeLinks: [
      { label: "Open Vault", href: "/app/vault" },
      { label: "Documents focus", href: "/app/focus/documents" },
    ],
  },
  {
    slug: "med-kit",
    title: "Health kit that is ready",
    blurb: "First aid and critical meds without a pharmacy run.",
    horizon: "Ongoing",
    minutes: 10,
    reframe:
      "A kit you never opened is only a box. Open it once. Know what is inside.",
    sections: [
      {
        heading: "Baseline",
        paragraphs: [
          "Bandages, pain relief, thermometer, gloves, and any personal critical meds with a safe extra supply if your clinician agrees.",
        ],
      },
      {
        heading: "What to do this week",
        paragraphs: [
          "Open your kit and discard expired items.",
          "List prescriptions that cannot lapse. Set a refill reminder before the bottle runs out.",
          "Save a pharmacy in Nearby.",
        ],
      },
    ],
    placeLinks: [
      { label: "Pharmacy map", href: "/app/nearby?q=pharmacy" },
      { label: "Health focus", href: "/app/focus/skills" },
    ],
  },
  {
    slug: "power-light",
    title: "Light when the grid blinks",
    blurb: "Phones charged, one light, one plan.",
    horizon: "Ongoing",
    minutes: 8,
    reframe:
      "You do not need a bunker. You need hours of light and a charged way to communicate.",
    sections: [
      {
        heading: "What to do this week",
        paragraphs: [
          "Pick a charging order: phone, light, radio if you have one.",
          "Test a flashlight or lantern. Put it where anyone in the home can find it.",
          "If you use a power bank, charge it on a schedule, not only when you remember.",
        ],
      },
    ],
    placeLinks: [
      { label: "Hardware near you", href: "/app/nearby?q=hardware" },
      { label: "Power What If", href: "/app/what-if" },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
