import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Server-side Nominatim reverse geocode — avoids browser CORS blocks. */
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");
  if (!lat || !lng) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }
  const la = Number(lat);
  const lo = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) {
    return NextResponse.json({ error: "invalid coords" }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${la}&lon=${lo}&zoom=12&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Tiltshield/1.0 (https://www.tiltshield.xyz)",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "geocode failed" }, { status: 502 });
    }
    const j = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const a = j.address || {};
    const city =
      a.city ||
      a.town ||
      a.village ||
      a.municipality ||
      a.suburb ||
      a.county ||
      "";
    const region = a.state || a.region || a.state_district || "";
    const country = a.country_code
      ? String(a.country_code).toUpperCase()
      : a.country || "";
    const label =
      [city, region].filter(Boolean).join(", ") ||
      country ||
      j.display_name?.split(",").slice(0, 2).join(",").trim() ||
      "Your area";
    return NextResponse.json({
      city: city || region || "Your area",
      region,
      country,
      label,
    });
  } catch {
    return NextResponse.json({ error: "geocode error" }, { status: 500 });
  }
}
