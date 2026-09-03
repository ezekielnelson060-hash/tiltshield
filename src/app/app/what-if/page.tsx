"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { runWhatIf } from "@/lib/scoring";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { WhatIfTrustedNetwork } from "@/components/app/whatif-trusted";
import { GlassCard } from "@/components/app/glass-card";
import {
  searchNearbyPlaces,
  mapsSearchUrl,
  type NearbyPlace,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import {
  IllusWallet,
  IllusBolt,
  IllusPhone,
  IllusBank,
  IllusBriefcase,
  IllusShield,
  IllusFood,
} from "@/components/illustrations";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  { ssr: false }
);

type Group =
  | "Money"
  | "Digital"
  | "Essentials"
  | "Mobility"
  | "Information"
  | "Personal";

const SCENARIOS: {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  group: Group;
  free?: boolean;
  Icon: (p: { size?: number }) => JSX.Element;
  nearbyQuery?: string;
}[] = [
  { id: "income_stops", label: "Income stops", prompt: "What if money in stopped today?", group: "Money", free: true, Icon: IllusWallet, nearbyQuery: "ATM" },
  { id: "banking_down", label: "Bank closed", prompt: "What if bank apps and cards failed?", group: "Money", Icon: IllusBank, nearbyQuery: "ATM" },
  { id: "digital_payments_only", label: "Payments break", prompt: "What if card and app pay stopped?", group: "Money", Icon: IllusPhone, nearbyQuery: "ATM" },
  { id: "currency_shock", label: "Currency stress", prompt: "What if your currency lost value fast?", group: "Money", Icon: IllusWallet, nearbyQuery: "bank" },
  { id: "major_expense", label: "Big bill hits", prompt: "What if a large unexpected bill arrived?", group: "Money", Icon: IllusBriefcase, nearbyQuery: "bank" },
  { id: "phone_lost", label: "Phone gone", prompt: "What if your phone was gone today?", group: "Digital", free: true, Icon: IllusPhone },
  { id: "internet_down", label: "No internet", prompt: "What if the internet stayed down?", group: "Digital", Icon: IllusBolt, nearbyQuery: "library" },
  { id: "email_compromised", label: "Email locked", prompt: "What if your main email was locked?", group: "Digital", Icon: IllusPhone },
  { id: "cloud_down", label: "Cloud offline", prompt: "What if cloud drives were unreachable?", group: "Digital", Icon: IllusBolt },
  { id: "2fa_down", label: "No 2FA codes", prompt: "What if SMS codes stopped arriving?", group: "Digital", Icon: IllusPhone },
  { id: "food_prices_double", label: "Food costs jump", prompt: "What if food cost a lot more?", group: "Essentials", Icon: IllusFood, nearbyQuery: "supermarket" },
  { id: "store_unavailable", label: "Store closed", prompt: "What if your usual store was closed?", group: "Essentials", Icon: IllusFood, nearbyQuery: "supermarket" },
  { id: "fuel_scarce", label: "Hard to get fuel", prompt: "What if fuel was hard to buy?", group: "Essentials", Icon: IllusBolt, nearbyQuery: "fuel" },
  { id: "power_grid", label: "Power out", prompt: "What if the lights went out?", group: "Essentials", Icon: IllusBolt, nearbyQuery: "hardware" },
  { id: "water_disruption", label: "Water issues", prompt: "What if tap water was uncertain?", group: "Essentials", Icon: IllusFood, nearbyQuery: "bottled water" },
  { id: "transit_down", label: "No public transit", prompt: "What if buses or trains stopped?", group: "Mobility", Icon: IllusBolt, nearbyQuery: "bus station" },
  { id: "vehicle_down", label: "No vehicle", prompt: "What if your vehicle was unavailable?", group: "Mobility", Icon: IllusBolt, nearbyQuery: "bus station" },
  { id: "travel_disruption", label: "Travel blocked", prompt: "What if major travel routes failed?", group: "Mobility", Icon: IllusBolt },
  { id: "comms_outage", label: "Comms outage", prompt: "What if calls and messages lagged?", group: "Information", Icon: IllusPhone, nearbyQuery: "community centre" },
  { id: "social_down", label: "Platforms down", prompt: "What if major apps went offline?", group: "Information", Icon: IllusPhone },
  { id: "news_unreliable", label: "Unclear news", prompt: "What if you could not trust the feed?", group: "Information", Icon: IllusShield, nearbyQuery: "library" },
  { id: "job_loss", label: "Job ends", prompt: "What if your main job ended?", group: "Personal", Icon: IllusBriefcase, nearbyQuery: "ATM" },
  { id: "relocation", label: "Must move", prompt: "What if you had to leave quickly?", group: "Personal", Icon: IllusBolt },
  { id: "family_emergency", label: "Family emergency", prompt: "What if family needed you urgently?", group: "Personal", Icon: IllusShield, nearbyQuery: "hospital" },
  { id: "medical_emergency", label: "Medical cost", prompt: "What if a sudden medical bill hit?", group: "Personal", Icon: IllusShield, nearbyQuery: "pharmacy" },
];

const GROUPS: { id: Group; label: string }[] = [
  { id: "Money", label: "Money" },
  { id: "Digital", label: "Digital" },
  { id: "Essentials", label: "Essentials" },
  { id: "Mobility", label: "Mobility" },
  { id: "Information", label: "Information" },
  { id: "Personal", label: "Personal" },
];

export default function WhatIfPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [active, setActive] = useState<WhatIfScenario | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [running, setRunning] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
  const [placesLoading, setPlacesLoading] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  async function loadPlaces(q: string) {
    setPlacesLoading(true);
    try {
      let r = await searchNearbyPlaces(q, coords, { limit: 6 });
      if (!r.length) {
        r = await searchNearbyPlaces(q, coords, { national: true, limit: 8 });
      }
      setPlaces(r);
      setSelected(r[0] ?? null);
    } catch {
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }

  function run(id: WhatIfScenario, free?: boolean) {
    if (!session) return;
    if (!free && !premium) {
      alert("More scenarios unlock with the plan.");
      return;
    }
    setActive(id);
    setRunning(true);
    setResult(null);
    setPlaces([]);
    setSelected(null);
    setTimeout(() => {
      setResult(runWhatIf(id, session.answers));
      setRunning(false);
      const meta = SCENARIOS.find((s) => s.id === id);
      if (meta?.nearbyQuery) void loadPlaces(meta.nearbyQuery);
    }, 400);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Finish your assessment first.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my score</Link>
        </Button>
      </div>
    );
  }

  const runway = Math.round((session.answers.emergency_fund_months || 0) * 30);
  const activeMeta = SCENARIOS.find((s) => s.id === active);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="What If?"
        subtitle="Test systems — money, digital, food, mobility — then see places that still help."
        backHref="/app/overview"
        showBack
      />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "days runway", value: String(runway) },
          { label: "income sources", value: String(session.answers.income_sources || 1) },
          { label: "backup pay", value: session.answers.alt_payment_method ? "yes" : "no" },
        ].map((b) => (
          <GlassCard key={b.label} className="!p-3.5 text-center">
            <p className="text-2xl font-bold tabular-nums text-zinc-50">{b.value}</p>
            <p className="mt-1 text-[10px] text-zinc-500">{b.label}</p>
          </GlassCard>
        ))}
      </div>

      {result && active && (
        <div className="space-y-3">
          <GlassCard
            tone={
              result.severity === "critical" || result.severity === "high"
                ? "danger"
                : "success"
            }
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Result · {result.severity}
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-50">{result.title}</p>
            <p className="mt-2 text-xl font-bold leading-snug text-zinc-50">
              {result.summary}
            </p>
            <p className="mt-2 text-sm text-zinc-400">{result.detail}</p>
            <p className="mt-3 text-sm text-emerald-400/90">{result.recommendation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/app/prepare"
                className="inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
              >
                What to do next →
              </Link>
              {activeMeta?.nearbyQuery && (
                <Link
                  href={`/app/nearby?q=${encodeURIComponent(activeMeta.nearbyQuery)}`}
                  className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200"
                >
                  Full map · {activeMeta.nearbyQuery} →
                </Link>
              )}
            </div>
            <button
              type="button"
              className="mt-3 block text-xs text-zinc-500"
              onClick={() => {
                setResult(null);
                setActive(null);
                setPlaces([]);
              }}
            >
              Clear
            </button>
          </GlassCard>

          {activeMeta?.nearbyQuery && (
            <GlassCard>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Nearby for this scenario
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Searching “{activeMeta.nearbyQuery}” near you — real places you can reach.
              </p>
              {placesLoading && (
                <p className="mt-3 text-xs text-zinc-500">Finding places…</p>
              )}
              {!placesLoading && places.length > 0 && (
                <>
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    <NearbyMap
                      places={places}
                      selected={selected}
                      user={coords}
                      onSelect={setSelected}
                      className="h-40 w-full"
                    />
                  </div>
                  <ul className="mt-3 space-y-2">
                    {places.slice(0, 5).map((pl) => (
                      <li key={pl.id}>
                        <a
                          href={mapsSearchUrl(pl.name, pl.lat, pl.lon)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-emerald-500/25"
                        >
                          <span>
                            <span className="block text-sm font-medium text-zinc-100">
                              {pl.name}
                            </span>
                            {pl.distanceM != null && (
                              <span className="text-[11px] text-zinc-500">
                                {formatDistance(pl.distanceM)}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-emerald-400">Map ↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!placesLoading && places.length === 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-zinc-500">
                    No pins found here. Open the wider map or search by name.
                  </p>
                  <a
                    href={mapsSearchUrl(
                      activeMeta.nearbyQuery,
                      coords?.lat,
                      coords?.lng
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-xs font-medium text-emerald-400"
                  >
                    Search on Google Maps →
                  </a>
                </div>
              )}
            </GlassCard>
          )}

          <WhatIfTrustedNetwork />
        </div>
      )}

      {GROUPS.map((group) => (
        <section key={group.id} className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {group.label}
          </p>
          <div className="space-y-2">
            {SCENARIOS.filter((s) => s.group === group.id).map((s) => {
              const locked = !s.free && !premium;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => run(s.id, s.free)}
                  disabled={running}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                    isActive
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/15",
                    locked && "opacity-70"
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                    <s.Icon size={28} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-zinc-100">
                      {s.label}
                      {locked && (
                        <span className="ml-2 text-[10px] font-normal text-zinc-500">
                          Plan
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {s.prompt}
                    </span>
                  </span>
                  <span className="text-zinc-600">→</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
