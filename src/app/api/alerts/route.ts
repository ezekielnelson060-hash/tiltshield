import { NextRequest, NextResponse } from "next/server";
import { BASELINE_ALERTS, fetchWeatherAlerts } from "@/lib/alerts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = parseFloat(sp.get("lat") || "");
  const lon = parseFloat(sp.get("lon") || "");
  let weather: Awaited<ReturnType<typeof fetchWeatherAlerts>> = [];
  if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
    weather = await fetchWeatherAlerts(lat, lon);
  }
  const alerts = [...weather, ...BASELINE_ALERTS];
  return NextResponse.json({
    alerts,
    fetchedAt: new Date().toISOString(),
    note: "Weather from Open-Meteo; baseline playbooks always included. Not an official government warning service.",
  });
}
