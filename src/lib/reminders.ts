/** Monthly re-assessment cadence (product loop). */

export const ASSESSMENT_INTERVAL_DAYS = 28;

export function assessmentDue(daysSince: number | null): boolean {
  if (daysSince == null) return true;
  return daysSince >= ASSESSMENT_INTERVAL_DAYS;
}

export function assessmentDueLabel(daysSince: number | null): string {
  if (daysSince == null) return "Take your first full assessment.";
  if (daysSince === 0) return "Assessed today.";
  if (daysSince < ASSESSMENT_INTERVAL_DAYS) {
    const left = ASSESSMENT_INTERVAL_DAYS - daysSince;
    return `Next full check in about ${left} day${left === 1 ? "" : "s"}.`;
  }
  return `It's been ${daysSince} days — retake to refresh your plan.`;
}
