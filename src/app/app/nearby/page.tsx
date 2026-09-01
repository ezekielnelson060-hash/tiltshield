"use client";

import { useEffect, useState } from "react";
import {
  NEARBY_CATEGORIES,
  googleMapsSearchUrl,
  mapsSearchUrl,
  type NearbyCategory,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NearbyPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<NearbyCategory | null>("pharmacy");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location not available on this device. Search still works.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () =>
        setError("Location permission denied. You can still search by category."),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const selected = NEARBY_CATEGORIES.find((c) => c.id === active);
  const searchQ = query.trim() || selected?.query || "pharmacy";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Nearby</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Find resources around your current location — food, pharmacy, banking,
          fuel, emergency. Same product worldwide; local results from your map
          provider.
        </p>
      </div>

      {coords && (
        <p className="text-xs text-zinc-600">
          Location ready · ~{formatDistance(0.8)} example radius in your units
        </p>
      )}
      {error && <p className="text-xs text-amber-500/90">{error}</p>}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search places, services, or supplies…"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-50"
      />

      <div className="flex flex-wrap gap-2">
        {NEARBY_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActive(c.id);
              setQuery("");
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              active === c.id
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-zinc-900 text-zinc-500"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-sm text-zinc-300">
          Searching for: <span className="font-medium text-zinc-50">{searchQ}</span>
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Opens your map app with local results — not a fixed list of chains.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <a
              href={googleMapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={mapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
              target="_blank"
              rel="noreferrer"
            >
              Open in OpenStreetMap
            </a>
          </Button>
        </div>
      </section>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NEARBY_CATEGORIES.map((c) => (
          <li key={c.id}>
            <a
              href={googleMapsSearchUrl(c.query, coords?.lat, coords?.lng)}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-zinc-800 px-3 py-3 text-center text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
