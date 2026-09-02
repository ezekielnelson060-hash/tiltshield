export type PublicAlert = {
  id: string;
  source: string;
  title: string;
  summary: string;
  severity: "info" | "watch" | "warning";
  category: "weather" | "grid" | "health" | "finance" | "local";
  href?: string;
  publishedAt: string;
};

/** Static high-signal playbooks always available offline. */
export const BASELINE_ALERTS: PublicAlert[] = [
  {
    id: "baseline-grid",
    source: "Tiltshield",
    title: "Treat multi-hour power loss as a default drill",
    summary:
      "Grid stress is seasonal and regional. Light, water, and fridge discipline matter more than perfect forecasts.",
    severity: "watch",
    category: "grid",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "baseline-cash",
    source: "Tiltshield",
    title: "Keep a small cash float tested this month",
    summary:
      "Payment outages are short for most people — painful if you have zero offline float.",
    severity: "info",
    category: "finance",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "baseline-heat-cold",
    source: "Tiltshield",
    title: "Extreme temperature weeks raise outage impact",
    summary:
      "Heat and cold amplify food spoilage and medical risk when power fails. Check water and med storage.",
    severity: "watch",
    category: "weather",
    publishedAt: new Date().toISOString(),
  },
];

export async function fetchWeatherAlerts(
  lat: number,
  lon: number
): Promise<PublicAlert[]> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const j = await res.json();
    const temp = j?.current?.temperature_2m;
    const wind = j?.current?.wind_speed_10m;
    const out: PublicAlert[] = [];
    const now = new Date().toISOString();
    if (typeof temp === "number" && temp >= 35) {
      out.push({
        id: `heat-${lat.toFixed(2)}`,
        source: "Open-Meteo",
        title: `High temperature near you (${Math.round(temp)}°)`,
        summary:
          "Heat raises grid load and hydration risk. Confirm water buffer and charged power banks.",
        severity: "warning",
        category: "weather",
        href: "https://open-meteo.com/",
        publishedAt: now,
      });
    } else if (typeof temp === "number" && temp <= 0) {
      out.push({
        id: `cold-${lat.toFixed(2)}`,
        source: "Open-Meteo",
        title: `Freezing conditions near you (${Math.round(temp)}°)`,
        summary:
          "Cold outages hit harder. Check light, layers, and med storage temperatures.",
        severity: "warning",
        category: "weather",
        href: "https://open-meteo.com/",
        publishedAt: now,
      });
    }
    if (typeof wind === "number" && wind >= 60) {
      out.push({
        id: `wind-${lat.toFixed(2)}`,
        source: "Open-Meteo",
        title: `Strong winds (${Math.round(wind)} km/h)`,
        summary:
          "Wind events increase local outage risk. Charge devices and review 72h kit.",
        severity: "watch",
        category: "weather",
        publishedAt: now,
      });
    }
    const precip = j?.daily?.precipitation_sum?.[0];
    if (typeof precip === "number" && precip >= 25) {
      out.push({
        id: `rain-${lat.toFixed(2)}`,
        source: "Open-Meteo",
        title: `Heavy precipitation expected (~${Math.round(precip)} mm)`,
        summary:
          "Flooding and travel disruption possible. Know higher ground routes and keep docs offline.",
        severity: "watch",
        category: "weather",
        publishedAt: now,
      });
    }
    return out;
  } catch {
    return [];
  }
}
