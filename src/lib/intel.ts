export type IntelScope = "for_you" | "local" | "global" | "watchlist";
export type Impact = "low" | "medium" | "high";

export type IntelItem = {
  id: string;
  scope: IntelScope;
  title: string;
  summary: string;
  impact: Impact;
  category: string;
  hoursAgo: number;
  relevanceKeys?: string[];
  actionHint?: string;
};

export const INTEL_LIBRARY: IntelItem[] = [
  {
    id: "cash-access",
    scope: "global",
    title: "Physical cash access tightens in more cities",
    summary:
      "ATM networks and bank branches continue to shrink. Households that rely only on cards or apps face longer waits when digital rails lag.",
    impact: "high",
    category: "Financial",
    hoursAgo: 4,
    relevanceKeys: ["money", "alt_payment"],
    actionHint:
      "Keep a small cash float for essentials. Test withdrawing and spending it this month.",
  },
  {
    id: "payment-rails",
    scope: "for_you",
    title: "Single payment rail remains a household weak point",
    summary:
      "If one bank app, card network, or wallet fails, homes without a backup method lose access to food, fuel, and meds quickly.",
    impact: "high",
    category: "Financial",
    hoursAgo: 2,
    relevanceKeys: ["money", "digital", "alt_payment"],
    actionHint:
      "Confirm one backup payment method and offline contacts for key vendors.",
  },
  {
    id: "organic-supply",
    scope: "global",
    title: "Organic and specialty food supply chains stay fragile",
    summary:
      "Shorter shelf life and thinner logistics mean organic staples can vanish from shelves faster than conventional goods during disruptions.",
    impact: "medium",
    category: "Essentials",
    hoursAgo: 9,
    relevanceKeys: ["food", "home"],
    actionHint:
      "Stock 14+ days of foods you already cook — including any organic staples you depend on.",
  },
  {
    id: "med-access",
    scope: "for_you",
    title: "Prescription refill delays reported in several markets",
    summary:
      "Pharmacy stockouts and prior-authorization delays increase risk for households without a multi-week buffer of critical meds.",
    impact: "high",
    category: "Health",
    hoursAgo: 6,
    relevanceKeys: ["emergency", "skills"],
    actionHint:
      "Ask your clinician about an emergency refill buffer. Note two pharmacies near you.",
  },
  {
    id: "energy-grid",
    scope: "local",
    title: "Grid stress and planned outages remain seasonal risks",
    summary:
      "Peak demand and aging infrastructure raise the chance of multi-hour power loss. Cold/hot weather amplifies impact on food and meds.",
    impact: "medium",
    category: "Energy",
    hoursAgo: 11,
    relevanceKeys: ["home", "emergency", "food"],
    actionHint:
      "Charge power banks. Know fridge/freezer hold times. Flashlight + radio checked.",
  },
  {
    id: "fuel-prices",
    scope: "global",
    title: "Transport fuel price swings hit last-mile delivery",
    summary:
      "Sudden fuel spikes raise grocery and pharmacy delivery costs and can thin stock at remote stations.",
    impact: "medium",
    category: "Economic",
    hoursAgo: 14,
    relevanceKeys: ["money", "food", "home"],
    actionHint: "Keep a half-tank habit and a short list of alternate stations via Nearby.",
  },
  {
    id: "cbdc-cash",
    scope: "watchlist",
    title: "Digital currency pilots expand — cash still matters offline",
    summary:
      "Central bank digital currency trials grow. Until dual-offline systems are universal, physical cash and alternate rails remain resilience tools.",
    impact: "medium",
    category: "Financial",
    hoursAgo: 20,
    relevanceKeys: ["money", "digital"],
    actionHint:
      "Practice one week of essential purchases with a backup method (cash or second rail).",
  },
  {
    id: "cloud-auth",
    scope: "global",
    title: "Cloud authentication outages block apps and banking",
    summary:
      "When identity providers degrade, password resets and 2FA can lock you out of critical accounts without offline recovery codes.",
    impact: "high",
    category: "Digital",
    hoursAgo: 8,
    relevanceKeys: ["digital", "documents"],
    actionHint:
      "Print recovery codes. Store copies offline in Vault. Know offline contacts.",
  },
  {
    id: "weather-local",
    scope: "local",
    title: "Severe weather can cut power, roads, and delivery",
    summary:
      "Storm windows of 24–72 hours commonly disrupt power, transit, and last-mile food/med delivery.",
    impact: "medium",
    category: "Local",
    hoursAgo: 3,
    relevanceKeys: ["home", "emergency", "food"],
    actionHint: "Check 72-hour water, food, light, and meds before the window.",
  },
  {
    id: "income-single",
    scope: "for_you",
    title: "Single-income households remain highly exposed",
    summary:
      "If primary income pauses, runway is determined only by savings and essential costs — not hope.",
    impact: "high",
    category: "Financial",
    hoursAgo: 1,
    relevanceKeys: ["money"],
    actionHint: "Run What If → Income stops with your real numbers.",
  },
  {
    id: "food-inflation",
    scope: "global",
    title: "Staple food inflation still elevates household exposure",
    summary:
      "Even modest sustained food inflation drains emergency buffers faster for households with thin runway.",
    impact: "medium",
    category: "Essentials",
    hoursAgo: 18,
    relevanceKeys: ["food", "money"],
    actionHint: "Use Calculators to stress food spend ×2 against your emergency fund.",
  },
  {
    id: "pharmacy-hours",
    scope: "local",
    title: "After-hours pharmacy access is uneven by neighborhood",
    summary:
      "Night and holiday coverage varies widely. Knowing a 24h option before you need it matters.",
    impact: "low",
    category: "Health",
    hoursAgo: 30,
    relevanceKeys: ["emergency", "skills"],
    actionHint: "Save one 24h pharmacy in Nearby and one vendor phone in Prepare.",
  },
];

export function personalizeIntel(input: {
  overall: number;
  topCategory?: string;
  hasAltPayment?: boolean;
  incomeSources?: number;
}): IntelItem[] {
  const scored = INTEL_LIBRARY.map((item) => {
    let score = 0;
    if (item.impact === "high") score += 3;
    if (item.impact === "medium") score += 2;
    if (item.scope === "for_you") score += 2;
    if (
      input.topCategory &&
      item.relevanceKeys?.some((k) =>
        k.includes(String(input.topCategory).toLowerCase())
      )
    ) {
      score += 4;
    }
    if (!input.hasAltPayment && item.relevanceKeys?.includes("alt_payment")) {
      score += 3;
    }
    if ((input.incomeSources || 1) <= 1 && item.id === "income-single") {
      score += 5;
    }
    if (input.overall < 55 && item.impact === "high") score += 2;
    return { item, score };
  });
  scored.sort((a, b) => b.score - a.score || a.item.hoursAgo - b.item.hoursAgo);
  return scored.map((s) => s.item);
}
