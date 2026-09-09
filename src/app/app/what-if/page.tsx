"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { UpgradeGate } from "@/components/app/upgrade-gate";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  runWhatIf,
  type WhatIfScenario,
  type WhatIfResult,
} from "@/lib/whatif";
import {
  searchNearbyPlaces,
  type NearbyPlace,
} from "@/lib/nearby";
import { PlaceRow } from "@/components/app/place-row";
import {
  IllusWallet,
  IllusPhone,
  IllusBolt,
  IllusCart,
} from "@/components/illustrations";

const SCENARIOS: {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  group: string;
  free?: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  nearbyQuery?: string;
}[] = [
  { id: "income_stops", label: "Income stops", prompt: "What if money in stopped today?", group: "Money", free: true, Icon: IllusWallet, nearbyQuery: "ATM" },
  { id: "payment_rail_fails", label: "Payment fails", prompt: "What if your primary card/app failed?", group: "Money", Icon: IllusWallet, nearbyQuery: "bank" },
  { id: "bank_app_down", label: "Bank app down", prompt: "What if the bank app was offline for 72h?", group: "Money", Icon: IllusWallet, nearbyQuery: "ATM" },
  { id: "phone_lost", label: "Phone gone", prompt: "What if your phone was gone today?", group: "Digital", free: true, Icon: IllusPhone },
  { id: "email_compromised", label: "Email locked", prompt: "What if your main email was locked?", group: "Digital", Icon: IllusPhone },
  { id: "power_outage", label: "Power out", prompt: "What if the grid dropped for 48h?", group: "Home", Icon: IllusBolt, nearbyQuery: "hardware store" },
  { id: "food_price_spike", label: "Food prices spike", prompt: "What if food costs jumped 30%?", group: "Food", Icon: IllusCart, nearbyQuery: "market" },
  { id: "travel_disruption", label: "Travel blocked", prompt: "What if major travel routes failed?", group: "Mobility", Icon: IllusBolt },
];

const GROUPS = [
  { id: "Money", label: "Money" },
  { id: "Digital", label: "Digital" },
  { id: "Home", label: "Home" },
  { id: "Food", label: "Food" },
  { id: "Mobility", label: "Mobility" },
];

export default function WhatIfPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [active, setActive] = useState<WhatIfScenario | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
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
    } catch {
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  }

  function run(id: WhatIfScenario, free?: boolean) {
    if (!session) return;
    if (!free && !premium) return;
    setActive(id);
    const r = runWhatIf(id, session.answers, session.scores);
    setResult(r);
    const meta = SCENARIOS.find((s) => s.id === id);
    if (meta?.nearbyQuery) void loadPlaces(meta.nearbyQuery);
    else setPlaces([]);
  }

  const activeMeta = SCENARIOS.find((s) => s.id === active);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="What If?"
        subtitle="Run the disruption before it runs you."
        backHref="/app/overview"
        showBack
      />

      {!premium && (
        <UpgradeGate
          title="Two free scenarios. Full board needs Pro."
          body="Free: Income stops + Phone gone. Pro unlocks all 8 scenarios with personal impact and nearby places."
        />
      )}

      {GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {group.label}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SCENARIOS.filter((s) => s.group === group.id).map((s) => {
              const locked = !s.free && !premium;
              const Icon = s.Icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => run(s.id, s.free)}
                  className={cn(
                    "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-left transition",
                    active === s.id && "border-emerald-500/40 bg-emerald-500/[0.08]",
                    locked && "opacity-70"
                  )}
                >
                  <Icon className="mb-2 h-8 w-8 text-emerald-400/80" />
                  <p className="text-sm font-semibold text-zinc-100">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{s.prompt}</p>
                  {locked && (
                    <span className="absolute right-2 top-2 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                      Pro
                    </span>
                  )}
                  {s.free && !premium && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-300">
                      Free
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {result && activeMeta && (
        <GlassCard className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
            Scenario result · {activeMeta.label}
          </p>
          <p className="text-sm font-semibold text-zinc-50">{result.headline}</p>
          <p className="text-sm leading-relaxed text-zinc-400">{result.detail}</p>
          {result.actions?.length > 0 && (
            <ul className="space-y-1.5">
              {result.actions.map((a, i) => (
                <li key={i} className="text-xs text-zinc-300">
                  · {a}
                </li>
              ))}
            </ul>
          )}
          {placesLoading && (
            <p className="text-xs text-zinc-500">Finding nearby options…</p>
          )}
          {places.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Nearby that helps
              </p>
              {places.slice(0, 4).map((pl) => (
                <PlaceRow key={pl.id} place={pl} />
              ))}
            </div>
          )}
          <Link
            href="/app/prepare"
            className="inline-block text-xs font-medium text-emerald-400 hover:text-emerald-300"
          >
            Turn this into a year-plan action →
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
