export type Guide = {
  slug: string;
  title: string;
  blurb: string;
  minutes: number;
  horizon: string;
  body: string[];
};

/** Guides = steps toward ~1 year household resilience (layered, not panic). */
export const GUIDES: Guide[] = [
  {
    slug: "year-food-water",
    title: "Food & water for a year (layered)",
    blurb:
      "Start at 14–30 days of meals you already eat, then rotate toward a deep pantry — without waste.",
    minutes: 12,
    horizon: "12 months",
    body: [
      "Write 10 meals your household already cooks that use dry, canned, frozen, or long-life staples.",
      "Build a 14-day bridge first: two full cycles of those ingredients, labeled with pack dates.",
      "Water baseline: about 3 liters per person per day for drinking and basic hygiene. Store what you can rotate; add purification so you are not only counting bottles.",
      "Extend toward 90 days of staples you will actually eat. Only then expand volume toward a year using rotation (first-in, first-out).",
      "Practice cooking two shelf-stable meals without delivery apps so stress does not invent a menu.",
      "Review quarterly: eat the oldest stock, replace what you used, adjust for household size.",
    ],
  },
  {
    slug: "year-cash-access",
    title: "Money access for a disrupted year",
    blurb:
      "Cash float, second payment rails, and a buffer sized from your real income — not hope.",
    minutes: 10,
    horizon: "12 months",
    body: [
      "Size a cash float for 2–4 weeks of essentials you control — separate from long-term savings.",
      "Confirm one backup payment method and test it this month.",
      "Use Tiltshield runway numbers: if income stopped, how many days do you really cover?",
      "Automate a transfer toward a 90-day essential buffer after income lands; keep that discipline across the year.",
      "Do not post photos of cash. Split small amounts if that fits your security context.",
      "Retake the assessment when rent, income, or dependents change.",
    ],
  },
  {
    slug: "year-health-meds",
    title: "Health buffer across 12 months",
    blurb:
      "Meds, first aid, and care continuity — only within what your clinician allows.",
    minutes: 9,
    horizon: "12 months",
    body: [
      "List critical prescriptions and OTC items your household actually uses.",
      "With a clinician’s guidance, work toward a lawful buffer of critical meds and a complete first-aid kit.",
      "Store meds correctly (temperature, light, expiry). Rotate anything nearing expiry.",
      "Know the nearest clinic and pharmacy offline — save them in Prepare → Network.",
      "Document allergies and conditions on paper in the Vault, not only on your phone.",
      "Review the kit every quarter the same day you rotate pantry stock.",
    ],
  },
  {
    slug: "year-power-home",
    title: "Power, light, and home systems",
    blurb:
      "Lights, charge, priorities, and documents that survive a dead phone.",
    minutes: 8,
    horizon: "12 months",
    body: [
      "Charge and test power banks monthly; keep one light source that does not depend on the grid alone.",
      "Decide what must stay powered (comms, medical devices) vs what can wait.",
      "Encrypt IDs, insurance, and recovery sheets in the Vault with a passphrase you will remember offline.",
      "Print or write one recovery sheet for the top accounts if your phone is gone.",
      "Walk your home once: water shutoff, main electrics, exits — everyone should know them.",
      "Revisit after any move or major appliance change.",
    ],
  },
  {
    slug: "year-local-network",
    title: "Local network for a long disruption",
    blurb:
      "Vendors and people who still work when one app is down — built before you need them.",
    minutes: 8,
    horizon: "12 months",
    body: [
      "Use Prepare → Network or Nearby to search pharmacies, markets, clinics, fuel, and ATMs near you.",
      "Save at least three trusted places offline inside Tiltshield, not only inside one delivery app.",
      "Prefer vendors who accept cash or more than one payment method.",
      "Agree a household meetup point and one offline contact who is not only in your phone.",
      "Touch the list quarterly: call or visit under calm conditions.",
      "After any move, rebuild the list for the new area the same week.",
    ],
  },
  {
    slug: "year-digital-recovery",
    title: "Digital recovery without the primary phone",
    blurb:
      "If the device is lost — which accounts still open?",
    minutes: 10,
    horizon: "12 months",
    body: [
      "List critical accounts: email, bank, government portals, cloud, any offline seed material.",
      "Print or write recovery codes for the top five. Store offline — not only on the same phone.",
      "Prefer a second factor that is not SMS-only where possible.",
      "Keep one trusted human contact on paper who can help if email is locked.",
      "Quarterly drill: open recovery without the primary device.",
      "Pair this with the Vault so documents and codes are encrypted on-device.",
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
