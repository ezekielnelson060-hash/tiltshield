export function greetingForHour(hour?: number): string {
  const h = hour ?? new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function resilienceLabel(score: number): string {
  if (score >= 80) return "Steady";
  if (score >= 60) return "Building";
  if (score >= 40) return "Fragile";
  if (score >= 20) return "Exposed";
  return "Critical";
}

export function formatMoney(n: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** e.g. 3rd Sept 2026 */
export function formatLongDate(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  const day = d.getDate();
  const ord =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const mon = d.toLocaleString("en-GB", { month: "short" });
  return `${day}${ord} ${mon} ${d.getFullYear()}`;
}
