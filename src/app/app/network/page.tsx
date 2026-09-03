"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadTrustedPlaces,
  removeTrustedPlace,
  type TrustedPlace,
} from "@/lib/network";
import { mapsSearchUrl } from "@/lib/nearby";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";

export default function NetworkPage() {
  const [places, setPlaces] = useState<TrustedPlace[]>([]);

  useEffect(() => {
    setPlaces(loadTrustedPlaces());
  }, []);

  function remove(id: string) {
    setPlaces(removeTrustedPlace(id));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Your network"
        subtitle="Places you chose on purpose — pharmacy, cash, food, people anchors."
        backHref="/app/more"
        showBack
      />

      <GlassCard>
        <p className="text-sm text-zinc-300">
          {places.length === 0
            ? "No trusted places yet. Search Nearby and tap Save on spots you would use on a hard day."
            : `${places.length} trusted place${places.length === 1 ? "" : "s"} on this device.`}
        </p>
        <Button asChild size="sm" className="mt-3">
          <Link href="/app/nearby">Find places to save →</Link>
        </Button>
      </GlassCard>

      <div className="space-y-2">
        {places.map((p) => (
          <div
            key={p.id}
            className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-100">{p.name}</p>
              {p.query && (
                <p className="mt-0.5 text-[11px] text-zinc-500">For: {p.query}</p>
              )}
              {p.note && (
                <p className="mt-1 text-xs text-zinc-400">{p.note}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href={mapsSearchUrl(p.name, p.lat, p.lon)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-400"
                >
                  Open map ↗
                </a>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="text-xs text-zinc-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {places.length > 0 && (
        <p className="text-center text-[11px] text-zinc-600">
          Stored on this device. Export or cloud sync can come later — your pins stay local for now.
        </p>
      )}
    </div>
  );
}
