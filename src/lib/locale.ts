/** Locale-aware formatting. Currency defaults to USD for Tiltshield. */

export function getLocale(): string {
  if (typeof navigator === "undefined") return "en-US";
  return navigator.language || "en-US";
}

/** Product currency is USD globally unless you override. */
export function getCurrencyCode(): string {
  if (typeof window !== "undefined") {
    try {
      const forced = localStorage.getItem("tiltshield_currency");
      if (forced && forced.length === 3) return forced.toUpperCase();
    } catch {
      /* */
    }
  }
  return "USD";
}

export function formatMoney(amount: number, currency?: string): string {
  const cur = currency || getCurrencyCode();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount || 0);
  } catch {
    return `$${Math.round(amount || 0)}`;
  }
}

export function formatDistance(km: number): string {
  if (km < 0.1) return "under 100 m";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function greetingForHour(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function resilienceLabel(score: number): string {
  if (score >= 80) return "Strong base";
  if (score >= 60) return "Stable";
  if (score >= 40) return "Building";
  return "Exposed";
}
