"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTrustedPlaces, type TrustedPlace } from "@/lib/network";
import { mapsSearchUrl } from "@/lib/nearby";
import { GlassCard } from "@/components/app/glass-card";

/** Shows saved places under a What If result. */
export function WhatIfTrustedNetwork() {
  const [trusted, setTrusted] = useState<TrustedPlace[]>([]);

  useEffect(() => {
    setTrusted(loadTrustedPlaces());
  }, []);

  if (trusted.length === 0) return null;

  return (
    <GlassCard>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        From your network
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Places you already saved — use these first when this scenario bites.
      </p>
      <ul className="mt-3 space-y-2">
        {trusted.slice(0, 5).map((p) => (
          <li key={p.id}>
            <a
              href={mapsSearchUrl(p.name, p.lat, p.lon)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
            >
              <span>
                <span className="block text-sm font-medium text-zinc-100">
                  {p.name}
                </span>
                {p.query && (
                  <span className="text-[11px] text-zinc-500">
                    Saved for: {p.query}
                  </span>
                )}
              </span>
              <span className="text-xs text-emerald-400">Map ↗</span>
            </a>
          </li>
        ))}
      </ul>
      <Link
        href="/app/network"
        className="mt-3 inline-block text-xs font-medium text-emerald-400"
      >
        Manage network →
      </Link>
    </GlassCard>
  );
}
