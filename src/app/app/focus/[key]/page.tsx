"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCategoryAction } from "@/lib/category-actions";
import { loadSession } from "@/lib/session";
import { searchNearbyPlaces, type NearbyPlace } from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/components/app/icons";
import { cn } from "@/lib/utils";

export default function FocusPage() {
  const params = useParams();
  const key = String(params?.key || "");
  const action = getCategoryAction(key);
  const [score, setScore] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const s = loadSession();
    if (s && key in s.scores) {
      setScore((s.scores as Record<string, number>)[key] ?? null);
    }
    try {
      const raw = localStorage.getItem(`tiltshield_focus_done_${key}`);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* */
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000 }
      );
    }
  }, [key]);

  if (!action) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-zinc-500">
        Unknown area.{" "}
        <Link href="/app/overview" className="text-emerald-400">
          Back to Today
        </Link>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[action.key as keyof typeof CATEGORY_ICONS];

  function toggleStep(i: number) {
    setDone((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try {
        localStorage.setItem(
          `tiltshield_focus_done_${key}`,
          JSON.stringify(next)
        );
      } catch {
        /* */
      }
      return next;
    });
  }

  async function findPlace(query: string) {
    setLoading(true);
    try {
      const r = await searchNearbyPlaces(query, coords, {
        national: true,
        limit: 8,
      });
      setPlaces(r);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title={action.label}
        subtitle={action.tagline}
        backHref="/app/overview"
        showBack
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-gradient-to-b from-[#121a28] to-[#080d16] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
            {Icon ? <Icon className="h-6 w-6 text-emerald-400" /> : null}
          </span>
          <div>
            {score != null && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Your score · {score} / 100
              </p>
            )}
            <p className="mt-2 text-base font-medium leading-relaxed text-zinc-100">
              {action.reframe}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your moves
        </p>
        {action.steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => toggleStep(i)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
              done[i]
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px]",
                done[i]
                  ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                  : "border-zinc-600"
              )}
            >
              {done[i] ? "✓" : ""}
            </span>
            <span>
              <span className="block text-sm font-medium text-zinc-100">
                {s.title}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-500">{s.detail}</span>
            </span>
          </button>
        ))}
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Know a place for this
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {action.places.map((p) =>
            p.internal ? (
              <Link
                key={p.label}
                href={p.internal}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-500/30"
              >
                {p.label} →
              </Link>
            ) : p.href ? (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-emerald-500/30"
              >
                {p.label} ↗
              </a>
            ) : (
              <button
                key={p.label}
                type="button"
                disabled={loading || !p.query}
                onClick={() => p.query && void findPlace(p.query)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-zinc-100 transition hover:border-emerald-500/30 disabled:opacity-50"
              >
                Find {p.label}
              </button>
            )
          )}
        </div>
        {places.length > 0 && (
          <div className="space-y-2 pt-1">
            {places.map((pl) => (
              <div
                key={pl.id}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
              >
                <p className="text-sm font-medium text-zinc-100">{pl.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                  {pl.address}
                </p>
                {pl.distanceKm != null && (
                  <p className="mt-1 text-[11px] text-emerald-400">
                    {formatDistance(pl.distanceKm)} from you
                  </p>
                )}
              </div>
            ))}
            <Button asChild size="sm" variant="outline">
              <Link href="/app/nearby">Open full map</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Go deeper
        </p>
        <div className="flex flex-wrap gap-2">
          {action.deepLinks.map((d) => (
            <Button key={d.href} asChild size="sm" variant="outline">
              <Link href={d.href}>{d.label}</Link>
            </Button>
          ))}
          <Button asChild size="sm">
            <Link href={`/app/risk?cat=${action.key}`}>Full risk detail</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
