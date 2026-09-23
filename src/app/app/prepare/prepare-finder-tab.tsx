"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PlaceRow } from "@/components/app/place-row";
import {
  NEARBY_CATEGORIES,
  type NearbyPlace,
} from "@/lib/nearby";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  { ssr: false }
);

type Props = {
  query: string;
  setQuery: (v: string) => void;
  loading: boolean;
  search: (q: string) => void;
  places: NearbyPlace[];
  selected: NearbyPlace | null;
  setSelected: (p: NearbyPlace | null) => void;
};

export function PrepareFinderTab({
  query,
  setQuery,
  loading,
  search,
  places,
  selected,
  setSelected,
}: Props) {
  return (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            Search suppliers when local is not enough. Save contacts offline.
          </p>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="e.g. pharmacy, hardware, grain store"
              className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500/40 focus:outline-none"
            />
            <Button disabled={loading || !query.trim()} onClick={() => search(query)}>
              {loading ? "…" : "Search"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {NEARBY_CATEGORIES.slice(0, 8).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setQuery(c.label);
                  void search(c.label);
                }}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-zinc-400"
              >
                {c.label}
              </button>
            ))}
          </div>
          {typeof window !== "undefined" && places.length > 0 && (
            <NearbyMap places={places} selected={selected} onSelect={setSelected} />
          )}
          <div className="space-y-2">
            {places.map((p) => (
              <PlaceRow
                key={p.id}
                place={p}
                selected={selected?.id === p.id}
                onSelect={() => setSelected(p)}
              />
            ))}
          </div>
        </div>
  );
}
