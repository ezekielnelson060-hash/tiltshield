import { isPremium, getPremiumTier } from "@/lib/session";

/**
 * Free — build the habit
 * - Assessment + exposure score
 * - Financial break point only
 * - Prepare (Plan / Stock / Journal / Places)
 * - What If: 2 scenarios
 * - Intel: top 3 matched signals
 * - Calculators + Update my situation
 *
 * Pro — $15/mo or $79/yr
 * - Every break point
 * - Full What If board
 * - Full intel
 * - Vault
 *
 * Family — household seats + Pro tools
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

/** Prepare stays free so daily use builds the habit. */
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
