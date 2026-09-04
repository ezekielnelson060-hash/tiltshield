/** Locale-aware formatting — currency, distance, dates from the browser. */

export function getLocale(): string {
  if (typeof navigator === "undefined") return "en-US";
  return navigator.language || "en-US";
}

export function getCurrencyCode(): string {
  try {
    const locale = getLocale();
    const map: Record<string, string> = {
      "en-US": "USD",
      "en-GB": "GBP",
      "en-AU": "AUD",
      "en-CA": "CAD",
      "en-NZ": "NZD",
      "nl-NL": "EUR",
      "de-DE": "EUR",
      "fr-FR": "EUR",
      "fr-BE": "EUR",
      "es-ES": "EUR",
      "it-IT": "EUR",
      "pt-PT": "EUR",
      "pt-BR": "BRL",
      "ja-JP": "JPY",
      "zh-CN": "CNY",
      "zh-HK": "HKD",
      "zh-TW": "TWD",
      "ko-KR": "KRW",
      "sv-SE": "SEK",
      "nb-NO": "NOK",
      "da-DK": "DKK",
      "pl-PL": "PLN",
      "en-NG": "NGN",
      "en-ZA": "ZAR",
      "en-IN": "INR",
      "en-SG": "SGD",
      "en-IE": "EUR",
    };
    if (map[locale]) return map[locale];
    const base = locale.split("-")[0];
    const byBase: Record<string, string> = {
      en: "USD",
      nl: "EUR",
      de: "EUR",
      fr: "EUR",
      es: "EUR",
      it: "EUR",
      pt: "BRL",
      ja: "JPY",
      zh: "CNY",
      ko: "KRW",
    };
    return byBase[base] || "USD";
  } catch {
    return "USD";
  }
}

export function formatMoney(amount: number, currency?: string): string {
  const cur = currency || getCurrencyCode();
  try {
    return new Intl.NumberFormat(getLocale(), {
      style: "currency",
      currency: cur,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${cur} ${amount.toLocaleString()}`;
  }
}

export function formatDistance(km: number): string {
  const locale = getLocale();
  if (locale.startsWith("en-US")) {
    const mi = km * 0.621371;
    return mi < 0.1 ? `${Math.round(mi * 5280)} ft` : `${mi.toFixed(1)} mi`;
  }
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function greetingForHour(hour?: number): string {
  const h = hour ?? new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function resilienceLabel(score: number): string {
  if (score >= 75) return "Strong";
  if (score >= 55) return "Stable";
  if (score >= 40) return "Attention";
  return "Fragile";
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
