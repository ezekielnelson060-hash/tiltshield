"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OFFLINE_VALUE_PATHS } from "@/lib/offline-value";
import { searchNearbyPlaces, type NearbyPlace } from "@/lib/nearby";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard, IconBadge } from "@/components/app/glass-card";
import { PlaceRow } from "@/components/app/place-row";
import { cn } from "@/lib/utils";

export default function OfflineValuePage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 8000 }
    );
  }, []);

  async function runSearch(q: string) {
    setActiveQuery(q);
    setLoading(true);
    try {
      const places = await searchNearbyPlaces(q, coords, { limit: 12 });
      setResults(places);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Offline value"
        subtitle="If cards and banks stall for a long stretch — practical paths, not predictions."
        backHref="/app/risk"
        showBack
      />

      <GlassCard tone="danger" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-red-500/15 blur-3xl" />
        <div className="relative flex gap-4">
          <IconBadge tone="red"><span className="text-lg">⚠</span></IconBadge>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400/90">Scenario</p>
            <p className="mt-1 text-base font-semibold text-zinc-50">Payment rails stressed for months</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Cash float and a second rail first. Then documents offline.
              Store-of-value research is optional and educational — not a buy signal.
            </p>
          </div>
        </div>
      </GlassCard>

      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Practical paths</p>

      <div className="space-y-3">
        {OFFLINE_VALUE_PATHS.map((p, i) => (
          <GlassCard key={p.id} className="!p-0 overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs font-bold text-zinc-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-50">{p.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{p.why}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                    p.scope === "local" && "bg-emerald-500/15 text-emerald-400",
                    p.scope === "national" && "bg-sky-500/15 text-sky-400",
                    p.scope === "online" && "bg-violet-500/15 text-violet-400"
                  )}
                >
                  {p.scope}
                </span>
              </div>
              <p className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-300">
                {p.action}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.searchQuery && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading && activeQuery === p.searchQuery}
                    onClick={() => void runSearch(p.searchQuery!)}
                  >
                    {loading && activeQuery === p.searchQuery ? "Searching…" : "Find near you"}
                  </Button>
                )}
                {p.href && (
                  <Button asChild size="sm" variant="outline">
                    <a href={p.href} target="_blank" rel="noopener noreferrer">Official site →</a>
                  </Button>
                )}
                {p.id === "land-records" && (
                  <Button asChild size="sm" variant="outline">
                    <Link href="/app/vault">Open Vault →</Link>
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {(loading || results.length > 0 || activeQuery) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Places for “{activeQuery}”
            </p>
            <Link href="/app/nearby" className="text-xs font-medium text-emerald-400">Full finder →</Link>
          </div>
          {loading && <p className="text-center text-xs text-zinc-500">Searching near you…</p>}
          <div className="space-y-2">
            {results.map((r) => (
              <PlaceRow key={r.id} place={r} showSave={false} />
            ))}
          </div>
          {!loading && results.length === 0 && activeQuery && (
            <GlassCard>
              <p className="text-sm text-zinc-400">No venues nearby. Try Independent Finder or a different word.</p>
              <Button asChild size="sm" className="mt-3" variant="outline">
                <Link href="/app/nearby">Open Nearby</Link>
              </Button>
            </GlassCard>
          )}
        </section>
      )}

      <p className="text-center text-[11px] leading-relaxed text-zinc-600">
        Educational only — not financial, legal, or investment advice.
      </p>
    </div>
  );
}
