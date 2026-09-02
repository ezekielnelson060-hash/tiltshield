"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  NEARBY_CATEGORIES,
  FINDER_GROUPS,
  searchNearbyPlaces,
  type NearbyCategory,
  type NearbyPlace,
} from "@/lib/nearby";
import { CURATED_DIRECTORY } from "@/lib/directory";
import { formatDistance } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [group, setGroup] = useState<
    "essentials" | "offgrid" | "cash" | "community"
  >("essentials");
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
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location denied — results may be less local."),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const cat = NEARBY_CATEGORIES.find((c) => c.id === active);
  const chips = NEARBY_CATEGORIES.filter((c) => c.group === group);
  const groupMeta = FINDER_GROUPS.find((g) => g.id === group);
  const playbooks = CURATED_DIRECTORY.filter(
    (d) => d.group === group || (group === "essentials" && d.group === "essentials")
  ).slice(0, 8);

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
  }, [active, coords?.lat, coords?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <PageHeader
        title="Independent Finder"
        subtitle="Support local. Map cash, farms, hardware, solar, and community spaces near you."
        backHref="/app/more"
        showBack
      />

      <p className="text-xs text-zinc-500">
        Parallel economy framing: pay how you want when systems stress — know who
        is near you first.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FINDER_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              setGroup(g.id);
              const first = NEARBY_CATEGORIES.find((c) => c.group === g.id);
              if (first) setActive(first.id);
            }}
            className={cn(
              "rounded-xl border px-2.5 py-2.5 text-left transition",
              group === g.id
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"
            )}
          >
            <p className="text-[11px] font-semibold text-zinc-100">{g.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[10px] text-zinc-500">
              {g.blurb}
            </p>
          </button>
        ))}
      </div>

      {groupMeta && (
        <p className="text-[11px] text-zinc-500">{groupMeta.blurb}</p>
      )}

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Directory playbooks
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {playbooks.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setQuery(d.searchQuery);
                void runSearch(d.searchQuery);
              }}
              className="min-w-[148px] shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-emerald-500/30"
            >
              <p className="text-[11px] font-semibold text-zinc-100">{d.title}</p>
              <p className="mt-0.5 line-clamp-2 text-[10px] text-zinc-500">
                {d.tip}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void runSearch(query);
          }}
          placeholder="Search farms, solar, ATM, co-op…"
          className="flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600"
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
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              active === c.id
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-zinc-200"
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
          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
            {selected.address}
          </p>
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
                <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                  {p.address}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">
                  {p.type}
                  {p.distanceKm != null && (
                    <> · {formatDistance(p.distanceKm)}</>
                  )}
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
