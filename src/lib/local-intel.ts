/** Weather / place-driven resilience hints for product-standard local intelligence. */

export type LocalHint = {
  id: string;
  title: string;
  summary: string;
  actionHint: string;
  impact: "low" | "medium" | "high";
  category: string;
};

export function localHintsFromWeather(input: {
  tempC?: number | null;
  place?: string | null;
}): LocalHint[] {
  const hints: LocalHint[] = [];
  const t = input.tempC;
  const where = input.place ? ` in ${input.place}` : "";

  if (t != null && t >= 32) {
    hints.push({
      id: "heat-grid",
      title: `Heat stress${where} raises outage and hydration risk`,
      summary:
        "High temperatures increase grid load and food spoilage risk if power fails. Water and cooling matter more than usual.",
      actionHint: "Confirm water buffer and charged power banks this week.",
      impact: "medium",
      category: "Local",
    });
  }
  if (t != null && t <= 2) {
    hints.push({
      id: "cold-grid",
      title: `Cold conditions${where} amplify power and heat dependence`,
      summary:
        "Low temperatures make outages more dangerous. Backup heat/light and med storage conditions matter.",
      actionHint: "Check light + power banks and a warm layer kit at home.",
      impact: "medium",
      category: "Local",
    });
  }
  if (input.place) {
    hints.push({
      id: "local-vendors",
      title: `Map offline-capable vendors near ${input.place}`,
      summary:
        "Apps fail; street-level options do not. Pharmacy, food, and cash access should be known before a disruption.",
      actionHint: "Open Nearby and save 3 places you can reach without an app.",
      impact: "low",
      category: "Local",
    });
  }
  return hints;
}
