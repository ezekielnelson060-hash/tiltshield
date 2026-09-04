"use client";

import { useState } from "react";
import type { NearbyPlace } from "@/lib/nearby";
import { mapsSearchUrl } from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { cn } from "@/lib/utils";

type Props = {
  place: NearbyPlace;
  selected?: boolean;
  onSelect?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  showSave?: boolean;
};

/**
 * Expandable place card — name always visible; tap opens address, type, distance, actions.
 */
export function PlaceRow({
  place,
  selected,
  onSelect,
  saved,
  onToggleSave,
  showSave = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const dist =
    place.distanceKm != null
      ? place.distanceKm < 1
        ? `${Math.round(place.distanceKm * 1000)} m`
        : formatDistance(place.distanceKm)
      : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition",
        selected
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-white/[0.08] bg-white/[0.03]"
      )}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        onClick={() => {
          setOpen((v) => !v);
          onSelect?.();
        }}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-sm text-emerald-400">
          📍
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-50">
            {place.name}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
            {[place.type, dist].filter(Boolean).join(" · ") || "Tap for details"}
          </span>
        </span>
        <span
          className={cn(
            "shrink-0 text-xs text-zinc-500 transition",
            open && "rotate-180 text-emerald-400"
          )}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/[0.06] px-4 pb-4 pt-3">
          {place.address ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Address
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                {place.address}
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">
              Address not listed — open map for the pin.
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
            {place.type && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                {place.type}
              </span>
            )}
            {dist && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                {dist} away
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={mapsSearchUrl(place.name, place.lat, place.lon)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300"
            >
              Open in Maps ↗
            </a>
            {showSave && onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave();
                }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                  saved
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                    : "border-white/10 bg-white/[0.04] text-zinc-300"
                )}
              >
                {saved ? "Saved ✓" : "Save place"}
              </button>
            )}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                place.name + (place.address ? " " + place.address : "")
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-400"
            >
              Find contact
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
