"use client";

import { useEffect, useState, type JSX } from "react";
import Link from "next/link";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { UpgradeGate } from "@/components/app/upgrade-gate";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";
import { runWhatIf } from "@/lib/whatif";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import {
  searchNearbyPlaces,
  type NearbyPlace,
} from "@/lib/nearby";
import { PlaceRow } from "@/components/app/place-row";
import {
  IllusWallet,
  IllusPhone,
  IllusBolt,
  IllusFood,
  IllusBank,
} from "@/components/illustrations";

type ScenarioDef = {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  group: string;
  free?: boolean;
  Icon: (p: { className?: string; size?: number }) => JSX.Element;
  nearbyQuery?: string;
};

const SCENARIOS: ScenarioDef[] = [
  { id: "income_stops", label: "Income stops", prompt: "What if money in stopped today?", group: "Money", free: true, Icon: IllusWallet, nearbyQuery: "ATM" },
  { id: "banking_down", label: "Bank closed", prompt: "What if banks and cards failed 72h?", group: "Money", Icon: IllusBank, nearbyQuery: "ATM" },
  { id: "digital_payments_only", label: "Payments break", prompt: "What if card and app pay stopped?", group: "Money", Icon: IllusPhone, nearbyQuery: "bank" },
  { id: "major_expense", label: "Big bill hits", prompt: "What if a large unexpected bill arrived?", group: "Money", Icon: IllusWallet },
  { id: "phone_lost", label: "Phone gone", prompt: "What if your phone was gone today?", group: "Digital", free: true, Icon: IllusPhone },
  { id: "internet_outage", label: "No internet", prompt: "What if the internet stayed down?", group: "Digital", Icon: IllusBolt },
  { id: "email_compromised", label: "Email locked", prompt: "What if your main email was locked?", group: "Digital", Icon: IllusPhone },
  { id: "power_grid", label: "Power out", prompt: "What if the grid dropped for 48h?", group: "Home", Icon: IllusBolt, nearbyQuery: "hardware store" },
  { id: "food_prices_double", label: "Food costs jump", prompt: "What if food cost a lot more?", group: "Food", Icon: IllusFood, nearbyQuery: "market" },
  { id: "store_unavailable", label: "Store closed", prompt: "What if your usual store was closed?", group: "Food", Icon: IllusFood, nearbyQuery: "supermarket" },
  { id: "travel_disruption", label: "Travel blocked", prompt: "What if major routes failed?", group: "Mobility", Icon: IllusBolt },
];

const GROUPS = ["Money", "Digital", "Home", "Food", "Mobility"];

export default function WhatIfPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [active, setActive] = useState<WhatIfScenario | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [needPro, setNeedPro] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
  }, []);

  async function run(id: WhatIfScenario, free?: boolean) {
    if (!session) return;
    if (!free && !premium) {
      setNeedPro(true);
      return;
    }
    setNeedPro(false);
    setActive(id);
    const r = runWhatIf(id, session.answers);
    setResult(r);

    const meta = SCENARIOS.find((s) => s.id === id);
    if (meta?.nearbyQuery) {
      setPlacesLoading(true);
      try {
        const list = await searchNearbyPlaces(meta.nearbyQuery, null, {
          scope: "city",
          limit: 6,
        });
        setPlaces(list);
      } catch {
        setPlaces([]);
      } finally {
        setPlacesLoading(false);
      }
    } else {
      setPlaces([]);
    }
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Finish your assessment first.</p>
        <Link href="/assessment" className="mt-4 inline-block text-sm font-medium text-emerald-400">
          Get my score →
        </Link>
      </div>
    );
  }

  const activeMeta = SCENARIOS.find((s) => s.id === active);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:max-w-none lg:px-8 lg:py-8">
      <PageHeader
        title="What If?"
        subtitle="Test systems — money, digital, food, mobility — before the world does."
        backHref="/app/overview"
        showBack
      />

      {!premium && (
        <UpgradeGate
          title={needPro ? "That scenario is Pro" : "Two free scenarios. Full board needs Pro."}
          body="Free: Income stops + Phone gone. Pro unlocks every scenario with personal impact and nearby places."
        />
      )}

      {GROUPS.map((group) => {
        const items = SCENARIOS.filter((s) => s.group === group);
        if (!items.length) return null;
        return (
          <div key={group}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {group}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {items.map((s) => {
                const locked = !s.free && !premium;
                const Icon = s.Icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => void run(s.id, s.free)}
                    className={cn(
                      "relative rounded-2xl border px-3 py-3 text-left transition",
                      active === s.id
                        ? "border-emerald-500/40 bg-emerald-500/[0.08]"
                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/15",
                      locked && "opacity-75"
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
        );
      })}

      {result && activeMeta && (
        <GlassCard className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
            Scenario · {activeMeta.label}
          </p>
          <p className="text-sm font-semibold text-zinc-50">{result.title}</p>
          <p className="text-sm leading-relaxed text-zinc-300">{result.summary}</p>
          <p className="text-sm leading-relaxed text-zinc-500">{result.detail}</p>
          {result.recommendation && (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-100/90">
              {result.recommendation}
            </p>
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
