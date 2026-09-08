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
  | "family";

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
    tagline: "See the number. Feel the gap.",
    priceLabel: "$0",
    amountUsd: 0,
    interval: "none",
    billing: "free",
    features: [
      "Nine-question exposure map",
      "All four break points",
      "City / nation map",
      "Core 1-year plan outline",
    ],
    cta: "Measure my exposure",
  },
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro",
    tagline: "Live clocks + intel that stays on",
    priceLabel: "$15",
    amountUsd: 15,
    interval: "month",
    billing: "recurring",
    popular: true,
    badge: "Best value for most people",
    features: [
      "Everything in Free",
      "Live intel matched to your gaps",
      "Full What If scenarios",
      "Document vault + offline value",
      "Progress history + journal",
      "Year stock tracking",
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
    name: "Founding Lifetime",
    tagline: "One payment. Locked in early.",
    priceLabel: "$49",
    amountUsd: 49,
    interval: "once",
    billing: "one_time",
    badge: "Limited founding",
    features: [
      "Individual Pro tools forever",
      "No renewals",
      "Founding supporter status",
      "Does not include household seats",
    ],
    cta: "Lock founding · $49",
  },
  family_monthly: {
    id: "family_monthly",
    name: "Family",
    tagline: "Household clocks under one plan",
    priceLabel: "$29",
    amountUsd: 29,
    interval: "month",
    billing: "recurring",
    household: true,
    features: [
      "Everything in Pro",
      "Up to 6 household profiles",
      "Shared emergency plan",
      "Family shortest-clock view",
      "Cancel anytime",
    ],
    cta: "Start Family · $29/mo",
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
  return id === "family" || id === "family_monthly";
}

export function isRecurringProduct(id: string): boolean {
  return (
    id === "pro_monthly" ||
    id === "pro_annual" ||
    id === "family_monthly"
  );
}

export function premiumTierFromProduct(
  id: string
): "none" | "pro" | "family" {
  if (id === "family" || id === "family_monthly") return "family";
  if (
    id === "lifetime" ||
    id === "pro_monthly" ||
    id === "pro_annual"
  )
    return "pro";
  return "none";
}
