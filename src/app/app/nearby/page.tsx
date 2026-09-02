"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  NEARBY_CATEGORIES,
  FINDER_GROUPS,
  searchNearbyPlaces,
  mapsSearchUrl,
  type NearbyCategory,
  type NearbyPlace,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";

const NearbyMap = dynamic(
  () => import("@/components/map/NearbyMap").then((m) => m.NearbyMap),
  { ssr: false, loading: () => (
    <div className="flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-[#080d16] text-xs text-zinc-500">
      Loading map…
    </div>
  ) }
);

export default function NearbyPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<NearbyCategory | null>("pharmacy");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 10000 }
    );
  }, []);

  const cat = NEARBY_CATEGORIES.find((c) => c.id === active);

  const runSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      setLoading(true);
      setError(null);
      try {
        let results = await searchNearbyPlaces(q, coords, { limit: 12 });
        if (!results.length) {
          results = await searchNearbyPlaces(q, coords, {
            national: true,
            limit: 15,
          });
        }
        setPlaces(results);
        if (!results.length) {
          setError(
            "No venues found. Try pharmacy, bank, or market — or open Google Maps below."
          );
        }
      } catch {
        setError("Search failed. Try again or use Google Maps.");
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    },
    [coords]
  );

  useEffect(() => {
    if (cat?.query) void runSearch(cat.query);
  }, [cat?.query, coords, runSearch]);

  function onChip(id: NearbyCategory) {
    setActive(id);
    const c = NEARBY_CATEGORIES.find((x) => x.id === id);
    if (c) {
      setQuery(c.label);
      void runSearch(c.query);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <PageHeader
        title="Nearby"
        subtitle="What do you need? Find real places — not restaurant lists."
        backHref="/app/overview"
        showBack
      />

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void runSearch(query);
          }}
          placeholder="Bottled water, pharmacy, generator…"
          className="flex-1 rounded-xl border border-white/[0.08] bg-[#080d16] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <Button
          size="sm"
          className="shrink-0"
          disabled={loading}
          onClick={() => void runSearch(query || cat?.query || "pharmacy")}
        >
          Search
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["pharmacy", "💊 Health"],
            ["food", "🛒 Food"],
            ["fuel", "⛽ Fuel"],
            ["cash", "🏦 Banking"],
            ["hardware", "🧰 Supplies"],
            ["solar", "🔋 Power"],
            ["water", "💧 Water"],
            ["community", "🏠 Community"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChip(id as NearbyCategory)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              active === id
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/10 bg-white/[0.04] text-zinc-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <NearbyMap
        center={coords}
        places={places}
        className="h-56 w-full overflow-hidden rounded-2xl border border-white/10"
      />

      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {loading ? "Searching…" : `${places.length} places`}
      </p>

      <div className="space-y-2">
        {places.map((pl) => (
          <GlassCard key={pl.id} className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-100">{pl.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                  {pl.address}
                </p>
                {pl.distanceKm != null && (
                  <p className="mt-1 text-[11px] text-emerald-400">
                    {formatDistance(pl.distanceKm)}
                  </p>
                )}
              </div>
              <a
                href={mapsSearchUrl(pl.name, pl.lat, pl.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-medium text-emerald-400"
              >
                Directions
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      {!loading && places.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
          <p className="text-sm text-zinc-400">
            {error || "Search or tap a need above."}
          </p>
          <a
            className="mt-3 block text-sm font-medium text-emerald-400"
            href={mapsSearchUrl(
              query || cat?.query || "pharmacy",
              coords?.lat,
              coords?.lng
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Search in Google Maps →
          </a>
          <button
            type="button"
            className="mt-2 text-xs text-zinc-500 underline"
            onClick={() =>
              void runSearch(query || cat?.query || "pharmacy")
            }
          >
            Search again (wider)
          </button>
        </div>
      )}
    </div>
  );
}
