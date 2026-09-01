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
    id: "payment-rails",
    scope: "for_you",
    title: "Heavy reliance on a single payment rail increases exposure",
    summary:
      "If cards, one bank app, or one network fails, households without cash or a second method lose access to essentials quickly.",
    impact: "high",
    category: "Financial",
    hoursAgo: 1,
    relevanceKeys: ["money", "digital", "alt_payment"],
    actionHint:
      "Confirm one backup payment method and a small cash float for essentials. Test both this month.",
  },
  {
    id: "pay-net",
    scope: "global",
    title: "Major payment network disruption reported",
    summary:
      "Intermittent failures on a large card network may affect digital checkout and ATM cash for some regions.",
    impact: "high",
    category: "Financial",
    hoursAgo: 5,
    relevanceKeys: ["digital", "money", "alt_payment"],
    actionHint: "Confirm a secondary payment method and a small cash float.",
  },
  {
    id: "energy",
    scope: "global",
    title: "Energy prices elevated in several markets",
    summary:
      "Household energy and transport costs may rise. Exposure depends on your utilities and commute.",
    impact: "medium",
    category: "Economic",
    hoursAgo: 12,
    relevanceKeys: ["home", "money"],
    actionHint: "Review essential expense buffer for utilities.",
  },
  {
    id: "weather",
    scope: "local",
    title: "Severe weather window in your region",
    summary:
      "Conditions may affect power, transport, and last-mile delivery for 24–72 hours.",
    impact: "medium",
    category: "Local",
    hoursAgo: 3,
    relevanceKeys: ["home", "emergency", "food"],
    actionHint: "Check 72-hour essentials and power backups.",
  },
  {
    id: "cloud",
    scope: "global",
    title: "Widespread cloud provider degradation",
    summary:
      "Some authentication and SaaS tools may be slow or unavailable. Offline access to critical docs matters.",
    impact: "medium",
    category: "Digital",
    hoursAgo: 8,
    relevanceKeys: ["digital", "documents"],
    actionHint: "Verify offline copies of identity and recovery codes.",
  },
  {
    id: "food-supply",
    scope: "global",
    title: "Supply chain delays for staples",
    summary:
      "Select grocery categories may see short gaps or price spikes depending on your region.",
    impact: "low",
    category: "Essentials",
    hoursAgo: 24,
    relevanceKeys: ["food"],
    actionHint: "Rotate pantry staples you already eat.",
  },
  {
    id: "jobs",
    scope: "for_you",
    title: "Single-income households remain highly exposed",
    summary:
      "If your primary income pauses, runway is determined only by savings and essential costs.",
    impact: "high",
    category: "Financial",
    hoursAgo: 2,
    relevanceKeys: ["money", "income"],
    actionHint: "Use What If → Income stops with your real numbers.",
  },
];

export function personalizeIntel(opts: {
  overall: number;
  topCategory?: string;
  hasAltPayment?: boolean;
  incomeSources?: number;
}): IntelItem[] {
  const scored = INTEL_LIBRARY.map((item) => {
    let score = 0;
    if (item.scope === "for_you") score += 2;
    if (item.impact === "high") score += 2;
    if (item.impact === "medium") score += 1;
    if (
      opts.topCategory &&
      item.relevanceKeys?.some((k) =>
        k.includes(opts.topCategory!.toLowerCase().slice(0, 4))
      )
    )
      score += 3;
    if (opts.incomeSources === 1 && item.id === "jobs") score += 4;
    if (opts.hasAltPayment === false && (item.id === "pay-net" || item.id === "payment-rails"))
      score += 3;
    if (opts.overall < 50 && item.impact !== "low") score += 1;
    return { item, score };
  });
  return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
}
