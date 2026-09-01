"use client";

import { useEffect, useMemo, useState } from "react";
import {
  NEARBY_CATEGORIES,
  searchNearbyPlaces,
  osmEmbedUrl,
  type NearbyCategory,
  type NearbyPlace,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { AppTopBar } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      setError("Location unavailable — search still works worldwide.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location denied — results may be less local."),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const cat = NEARBY_CATEGORIES.find((c) => c.id === active);

  async function runSearch(term: string) {
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
      setError("Search failed. Check connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cat) void runSearch(cat.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, coords?.lat, coords?.lng]);

  const mapUrl = useMemo(() => {
    if (selected) return osmEmbedUrl(selected.lat, selected.lon);
    if (coords) return osmEmbedUrl(coords.lat, coords.lng);
    return null;
  }, [selected, coords]);

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 lg:px-8">
      <AppTopBar title="Nearby" backHref="/app/overview" />
      <p className="-mt-2 text-sm text-zinc-500">
        Search venues inside Tiltshield — map + results stay in the app.
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

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1018]">
        {mapUrl ? (
          <iframe
            title="Nearby map"
            src={mapUrl}
            className="h-52 w-full border-0 sm:h-64"
            loading="lazy"
          />
        ) : (
          <div className="flex h-52 items-center justify-center text-xs text-zinc-500 sm:h-64">
            Locating map…
          </div>
        )}
        <div className="border-t border-white/[0.06] px-4 py-3">
          <p className="text-sm font-medium text-zinc-100">
            {selected?.name || cat?.label || "Search"}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            {selected?.address
              ? selected.address.slice(0, 90) +
                (selected.address.length > 90 ? "…" : "")
              : error || "Pick a result below"}
          </p>
        </div>
      </div>

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
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm text-emerald-400">
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
            Search or tap a category to load venues near you.
          </p>
        )}
      </section>
    </div>
  );
}
