"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  NEARBY_CATEGORIES,
  searchNearbyPlaces,
  mapsSearchUrl,
  type NearbyPlace,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";
import {
  loadTrustedPlaces,
  saveTrustedPlace,
  removeTrustedPlace,
} from "@/lib/network";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-[#080d16] text-xs text-zinc-500">
        Loading map…
      </div>
    ),
  }
);

export default function NearbyPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>("pharmacy");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trustedIds, setTrustedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTrustedIds(new Set(loadTrustedPlaces().map((p) => p.id)));
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
        setSelected(results[0] ?? null);
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
    try {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) {
        setQuery(q);
        void runSearch(q);
      }
    } catch {
      /* */
    }
  }, [coords, runSearch]);

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <PageHeader
        title="Nearby"
        subtitle="What do you need? Search, then save the places you would trust on a hard day."
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
          placeholder="Pharmacy, ATM, market, water…"
          className="flex-1 rounded-xl border border-white/[0.08] bg-[#080d16] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <Button
          size="sm"
          disabled={loading}
          onClick={() => void runSearch(query || cat?.query || "pharmacy")}
        >
          {loading ? "…" : "Search"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {NEARBY_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActive(c.id);
              setQuery(c.query);
              void runSearch(c.query);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              active === c.id
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/10 bg-white/[0.04] text-zinc-400"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <NearbyMap
        places={places}
        selected={selected}
        user={coords}
        onSelect={setSelected}
        className="h-56 w-full overflow-hidden rounded-2xl border border-white/10"
      />

      {error && (
        <GlassCard tone="danger">
          <p className="text-sm text-zinc-300">{error}</p>
          <a
            href={mapsSearchUrl(
              query || cat?.query || "pharmacy",
              coords?.lat,
              coords?.lng
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-medium text-emerald-400"
          >
            Open in Google Maps →
          </a>
        </GlassCard>
      )}

      <div className="space-y-2">
        {places.map((pl) => {
          const saved = trustedIds.has(pl.id);
          return (
            <div
              key={pl.id}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-4 py-3 transition",
                selected?.id === pl.id
                  ? "border-emerald-500/35 bg-emerald-500/10"
                  : "border-white/[0.08] bg-white/[0.03]"
              )}
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setSelected(pl)}
              >
                <p className="text-sm font-medium text-zinc-100">{pl.name}</p>
                {pl.distanceM != null && (
                  <p className="text-[11px] text-zinc-500">
                    {formatDistance(pl.distanceM)}
                  </p>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (saved) {
                    setTrustedIds(
                      new Set(removeTrustedPlace(pl.id).map((p) => p.id))
                    );
                  } else {
                    saveTrustedPlace({
                      id: pl.id,
                      name: pl.name,
                      lat: pl.lat,
                      lon: pl.lon,
                      query: query || cat?.query,
                    });
                    setTrustedIds(
                      new Set(loadTrustedPlaces().map((p) => p.id))
                    );
                  }
                }}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold",
                  saved
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-white/[0.06] text-zinc-300 hover:bg-emerald-500/15 hover:text-emerald-300"
                )}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <a
                href={mapsSearchUrl(pl.name, pl.lat, pl.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs text-emerald-400"
              >
                Map ↗
              </a>
            </div>
          );
        })}
      </div>

      {!loading && places.length === 0 && !error && (
        <p className="text-center text-xs text-zinc-600">
          Pick a need above or type what you&apos;re looking for.
        </p>
      )}

      {trustedIds.size > 0 && (
        <Link
          href="/app/network"
          className="block text-center text-xs font-medium text-emerald-400"
        >
          View your network ({trustedIds.size}) →
        </Link>
      )}
    </div>
  );
}

function Link({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
