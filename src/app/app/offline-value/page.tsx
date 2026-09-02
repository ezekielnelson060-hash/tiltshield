"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OFFLINE_VALUE_PATHS } from "@/lib/offline-value";
import { searchNearbyPlaces, type NearbyPlace } from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";

/** Educational playbook if cards/banks are impaired — not financial advice. */
export default function OfflineValuePage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 8000 }
    );
  }, []);

  async function runNational(q: string) {
    setActiveQuery(q);
    setLoading(true);
    try {
      const places = await searchNearbyPlaces(q, coords);
      setResults(places);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Offline value"
        subtitle="If cards and banks are impaired for a long stretch — practical paths, not predictions."
        backHref="/app/risk"
        showBack
      />

      <GlassCard tone="danger">
        <p className="text-sm font-medium text-zinc-100">
          Scenario: payment rails stressed for months
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Focus on cash float, a second rail, documents offline, and only then any
          store-of-value research. Educational — not advice to buy assets.
        </p>
      </GlassCard>

      <div className="space-y-3">
        {OFFLINE_VALUE_PATHS.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-50">{p.title}</p>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {p.scope}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">{p.why}</p>
            <p className="mt-2 text-sm text-zinc-300">{p.action}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.searchQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => void runNational(p.searchQuery!)}
                >
                  Find near / region
                </Button>
              )}
              {p.href && (
                <Button asChild size="sm" variant="outline">
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    Official site →
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(loading || results.length > 0 || activeQuery) && (
        <section className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {loading
              ? "Searching…"
              : activeQuery
                ? `Results for “${activeQuery}”`
                : "Results"}
          </p>
          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
            >
              <p className="text-sm font-medium text-zinc-100">{r.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                {r.address}
              </p>
              {r.distanceKm != null && (
                <p className="mt-1 text-[11px] text-emerald-400/90">
                  {formatDistance(r.distanceKm)} from you
                </p>
              )}
            </div>
          ))}
          {!loading && results.length === 0 && activeQuery && (
            <p className="text-sm text-zinc-500">
              No venues nearby — try Independent Finder for a wider map search.
            </p>
          )}
          <Button asChild size="sm" variant="outline">
            <Link href="/app/nearby">Open Independent Finder</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
