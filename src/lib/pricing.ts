/**
 * Tiltshield commercial catalog.
 * Recurring is the default business model; lifetime is a limited founding lane.
 */

export type ProductId =
  | "free"
  | "pro_monthly"
  | "pro_annual"
  | "lifetime"
  | "family_monthly"
  | "family"
  | "family_annual";

export type BillingKind = "free" | "recurring" | "one_time";

export type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  priceLabel: string;
  amountUsd: number;
  interval: "none" | "month" | "year" | "once";
  billing: BillingKind;
  popular?: boolean;
  badge?: string;
  features: string[];
  cta: string;
  household?: boolean;
};

export const PRODUCTS: Record<ProductId, Product> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Know your number",
    priceLabel: "$0",
    amountUsd: 0,
    interval: "none",
    billing: "free",
    features: [
      "10-question resilience assessment",
      "Your overall exposure score (0–100)",
      "One break point revealed: Financial dependency",
      "See where you stand—no account required",
    ],
    cta: "Measure my exposure",
  },
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro",
    tagline: "Close the gaps · cancel anytime",
    priceLabel: "$15",
    amountUsd: 15,
    interval: "month",
    billing: "recurring",
    popular: true,
    badge: "Recommended",
    features: [
      "Everything in Free",
      "All four break points unlocked",
      "What If? simulator — 8 scenarios",
      "Live intel matched to your gaps",
      "Secure vault",
      "12-month preparedness tracker",
      "Physical asset & cash inventory",
      "Cancel anytime",
    ],
    cta: "Start Pro · $15/mo",
  },
  pro_annual: {
    id: "pro_annual",
    name: "Pro Annual",
    tagline: "Lower effective monthly rate",
    priceLabel: "$79",
    amountUsd: 79,
    interval: "year",
    billing: "recurring",
    badge: "Billed yearly",
    features: [
      "Everything in Pro Monthly",
      "Billed once a year",
      "Priority feature access",
    ],
    cta: "Go annual · $79/yr",
  },
  lifetime: {
    id: "lifetime",
    name: "Founding Member",
    tagline: "Lifetime Pro. No renewals. Only 100 seats.",
    priceLabel: "$149",
    amountUsd: 149,
    interval: "once",
    billing: "one_time",
    badge: "Only 100 seats",
    features: [
      "Lifetime Pro access forever",
      "No renewals. No price increases",
      "Full feature stack including future releases",
      "Founding supporter status",
    ],
    cta: "Claim founding access →",
  },
  family_monthly: {
    id: "family_monthly",
    name: "Family",
    tagline: "Protect the household · up to 6 profiles",
    priceLabel: "$29",
    amountUsd: 29,
    interval: "month",
    billing: "recurring",
    household: true,
    features: [
      "Everything in Pro",
      "Up to 6 household profiles",
      "Shared emergency plan & contact tree",
      "Family-wide shortest-clock view",
      "Cancel anytime",
    ],
    cta: "Start Family · $29/mo",
  },
  family_annual: {
    id: "family_annual",
    name: "Family Annual",
    tagline: "Household plan, billed yearly",
    priceLabel: "$179",
    amountUsd: 179,
    interval: "year",
    billing: "recurring",
    household: true,
    badge: "Save vs monthly",
    features: [
      "Everything in Family Monthly",
      "Billed once a year",
      "Up to 6 household profiles",
    ],
    cta: "Family annual · $179/yr",
  },
  family: {
    id: "family",
    name: "Family Lifetime",
    tagline: "One payment for the house",
    priceLabel: "$99",
    amountUsd: 99,
    interval: "once",
    billing: "one_time",
    household: true,
    badge: "Founding household",
    features: [
      "Everything in Family Monthly",
      "One payment, no renewals",
      "Up to 6 profiles",
    ],
    cta: "Family founding · $99",
  },
};

export const LANDING_PRIMARY: ProductId[] = [
  "free",
  "pro_monthly",
  "family_monthly",
];

export const LANDING_FOUNDING: ProductId[] = ["pro_annual", "lifetime", "family"];

export function productAmount(id: ProductId): number {
  return PRODUCTS[id]?.amountUsd ?? 0;
}

export function isHouseholdProduct(id: string): boolean {
  return id === "family" || id === "family_monthly" || id === "family_annual";
}

export function isRecurringProduct(id: string): boolean {
  return (
    id === "pro_monthly" ||
    id === "pro_annual" ||
    id === "family_monthly" ||
    id === "family_annual"
  );
}

export function premiumTierFromProduct(
  id: string
): "none" | "pro" | "family" {
  if (id === "family" || id === "family_monthly" || id === "family_annual")
    return "family";
  if (
    id === "lifetime" ||
    id === "pro_monthly" ||
    id === "pro_annual"
  )
    return "pro";
  return "none";
}
