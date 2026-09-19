import { isPremium, getPremiumTier } from "@/lib/session";

/**
 * Free (habit + hook)
 * - Assessment, exposure score
 * - Financial break point only
 * - Prepare: Plan / Stock / Journal
 * - What If: 2 free scenarios
 * - Intel: top 3 matched signals
 * - Calculators (local)
 *
 * Pro ($15/mo or $79/yr)
 * - Every break point
 * - Full What If board
 * - Full intel
 * - Vault, deeper household tools
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

/** Prepare plan/stock/journal stays free so daily use builds the habit. */
export function canUseYearPlan(): boolean {
  return true;
}

export function canUseHousehold(): boolean {
  return getPremiumTier() === "family" || hasProAccess();
}

/** Free always surfaces financial — not necessarily the shortest clock. */
export function freeTierBreakPointId(): string {
  return "financial";
}
