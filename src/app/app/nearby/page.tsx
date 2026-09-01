"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  NEARBY_CATEGORIES,
  searchNearbyPlaces,
  type NearbyCategory,
  type NearbyPlace,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { AppTopBar } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-white/[0.08] text-xs text-zinc-500 sm:h-72">
        Loading map…
      </div>
    ),
  }
);

export default function NearbyPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [active, setActive] = useState<NearbyCategory>("pharmacy");
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location unavailable — search still works.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location denied — results may be less local."),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const cat = NEARBY_CATEGORIES.find((c) => c.id === active);

  const runSearch = useCallback(
    async (term: string) => {
      const q = term.trim();
      if (!q) return;
      setLoading(true);
      setError(null);
      try {
        const results = await searchNearbyPlaces(q, coords);
        setPlaces(results);
        setSelected(results[0] || null);
        if (!results.length) setError("No venues found. Try another term.");
      } catch {
        setError("Search failed. Check connection.");
      } finally {
        setLoading(false);
      }
    },
    [coords]
  );

  useEffect(() => {
    if (cat) void runSearch(cat.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, coords?.lat, coords?.lng]);

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 lg:px-8">
      <AppTopBar title="Nearby" backHref="/app/overview" />
      <p className="-mt-2 text-sm text-zinc-500">
        Search inside Tiltshield — multi-pin map, results stay here.
      </p>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void runSearch(query);
          }}
          placeholder="Search pharmacies, markets, fuel…"
          className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-4 pr-24 text-sm text-zinc-50 placeholder:text-zinc-600"
        />
        <Button
          type="button"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2"
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
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              active === c.id
                ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300"
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
      />

      {selected && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
          <p className="text-sm font-medium text-zinc-50">{selected.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{selected.address}</p>
          {selected.distanceKm != null && (
            <p className="mt-1 text-[11px] text-emerald-400/90">
              {formatDistance(selected.distanceKm)} away
            </p>
          )}
        </div>
      )}

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {loading ? "Searching…" : `${places.length} places`}
        </p>
        {places.map((p) => {
          const isSel = selected?.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                isSel
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"
              )}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                📍
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-100">{p.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{p.address}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
                  {p.type}
                  {p.distanceKm != null && <> · {formatDistance(p.distanceKm)}</>}
                </p>
              </div>
            </button>
          );
        })}
        {!loading && places.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            {error || "Search or tap a category to load venues."}
          </p>
        )}
      </section>
    </div>
  );
}
