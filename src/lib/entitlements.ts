import { isPremium, getPremiumTier } from "@/lib/session";

/**
 * Free: score + financial break point only.
 * Pro / Family / Founding: full product.
 */
export function hasProAccess(): boolean {
  return isPremium();
}

export function canSeeAllBreakPoints(): boolean {
  return hasProAccess();
}

export function canSeeFinancialBreakPoint(): boolean {
  return true;
}

export function canUseWhatIf(): boolean {
  return hasProAccess();
}

export function canUseVault(): boolean {
  return hasProAccess();
}

export function canUseFullIntel(): boolean {
  return hasProAccess();
}

export function canUseYearPlan(): boolean {
  return hasProAccess();
}

export function canUseHousehold(): boolean {
  return getPremiumTier() === "family" || hasProAccess();
}

/** Free always surfaces financial — not necessarily the shortest clock. */
export function freeTierBreakPointId(): string {
  return "financial";
}
