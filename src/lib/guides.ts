export type Guide = {
  slug: string;
  title: string;
  blurb: string;
  minutes: number;
  body: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "30-days-food",
    title: "How to store 30 days of food",
    blurb: "Meals you already eat, rotation, and water — without panic buying.",
    minutes: 8,
    body: [
      "List 10 meals your household already eats that use dry, canned, or frozen staples.",
      "Buy an extra cycle of those ingredients — not unfamiliar bulk you will never cook.",
      "Store water: about 3 liters per person per day for drinking and basic hygiene. Rotate bottles every 6–12 months.",
      "Use first-in, first-out: date packages with a marker; cook the oldest first.",
      "Practice two shelf recipes from Tiltshield Prepare so stress does not invent a menu.",
      "Aim for 14 pantry days first, then extend toward 30 with shelf-stable protein and grains.",
    ],
  },
  {
    slug: "cash-float",
    title: "Cash float without paranoia",
    blurb: "Size a small cash reserve you can actually use if cards fail.",
    minutes: 5,
    body: [
      "Target 3–7 days of essential spend in cash you control — not your full emergency fund.",
      "Split locations: a small amount at home, a small amount on your person if safe for your context.",
      "Test that you can pay a real local vendor in cash once this month.",
      "Do not post photos of cash stashes. Do not keep your entire buffer in one drawer.",
      "Pair cash with an alternate payment method from your assessment.",
    ],
  },
  {
    slug: "offline-recovery",
    title: "Offline account recovery",
    blurb: "If your phone is lost, which accounts still open?",
    minutes: 10,
    body: [
      "List critical accounts: email, bank, government ID portals, cloud, crypto if any.",
      "Print or write recovery codes for the top 5. Store offline — not only in the same phone.",
      "Add a second factor that is not SMS-only where possible.",
      "Keep one trusted contact offline (paper) who can help if you are locked out of email.",
      "Re-test once a quarter without the primary phone.",
    ],
  },
  {
    slug: "local-vendors",
    title: "Build a local vendor list",
    blurb: "People and shops that still work when one app is down.",
    minutes: 6,
    body: [
      "Identify food, pharmacy, fuel or transport, water, and one repair contact in your city.",
      "Save name, phone, and area in Tiltshield Prepare.",
      "Visit or call once so the relationship is real before you need it.",
      "Prefer vendors who accept cash or dual payment methods.",
    ],
  },
  {
    slug: "income-buffer",
    title: "Turn surplus into a 90-day buffer",
    blurb: "Use your take-home income plan from Overview.",
    minutes: 7,
    body: [
      "Open Overview and read the suggested weekly transfer.",
      "Open a separate buffer account or envelope labeled only for essentials.",
      "Automate the transfer the day after income lands.",
      "Review when rent or income changes — retake the assessment monthly.",
      "Do not treat the buffer as lifestyle spending.",
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
