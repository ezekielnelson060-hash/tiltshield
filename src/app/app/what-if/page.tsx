"use client";

import { useEffect, useState, type JSX } from "react";
import Link from "next/link";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { PageHeader } from "@/components/app/page-header";
import { openUpgrade } from "@/lib/upgrade";
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

/** Concrete next step for each scenario — leads into the real screen. */
const ACTIONS: Record<
  string,
  { label: string; href: string; doNext: string }
> = {
  income_stops: {
    label: "Set cash runway",
    href: "/app/situation",
    doNext:
      "Open Update my situation. Enter monthly expenses and liquid months. Save — your break point updates.",
  },
  job_loss: {
    label: "Set cash runway",
    href: "/app/situation",
    doNext:
      "Enter expenses and reserves in Update my situation, then mark a second income path if you have one.",
  },
  banking_down: {
    label: "Add offline pay path",
    href: "/app/offline-value",
    doNext:
      "Record cash float and a second pay rail. Then toggle tested second way to pay in Update my situation.",
  },
  digital_payments_only: {
    label: "Fix payment rails",
    href: "/app/situation",
    doNext:
      "In Update my situation: set digital dependence, alt payment, and value outside bank apps. Save.",
  },
  major_expense: {
    label: "Build the buffer",
    href: "/app/situation",
    doNext: "Raise liquid months toward 90 days of essentials in Update my situation.",
  },
  phone_lost: {
    label: "Phone backup plan",
    href: "/app/situation",
    doNext:
      "In Update my situation, turn on Plan if phone is gone and offline contacts. Then log it in Prepare journal.",
  },
  internet_outage: {
    label: "Offline docs & contacts",
    href: "/app/situation",
    doNext:
      "Toggle offline docs and contacts in Update my situation. Print one contact sheet this week.",
  },
  email_compromised: {
    label: "Secure login path",
    href: "/app/situation",
    doNext:
      "Confirm offline recovery for email and turn on phone backup in Update my situation.",
  },
  power_grid: {
    label: "Stock power basics",
    href: "/app/prepare?tab=stock",
    doNext: "Open Stock. Tick power/lighting items you already have. Add what you still need.",
  },
  food_prices_double: {
    label: "Extend food buffer",
    href: "/app/prepare?tab=stock",
    doNext:
      "Open Stock. Tick food lines on the shelf. Log days of food in Update my situation.",
  },
  store_unavailable: {
    label: "Map a second store",
    href: "/app/nearby?q=supermarket",
    doNext: "Search nearby markets. Save one backup store to your network.",
  },
  travel_disruption: {
    label: "Map backup routes",
    href: "/app/nearby?q=transport",
    doNext: "Find an alternate route or hub near you and save it to Network.",
  },
};

const SCENARIOS: ScenarioDef[] = [
  {
    id: "income_stops",
    label: "Income stops",
    prompt: "What if money in stopped today?",
    group: "Money",
    free: true,
    Icon: IllusWallet,
    nearbyQuery: "ATM",
  },
  {
    id: "banking_down",
    label: "Bank closed",
    prompt: "What if banks and cards failed 72h?",
    group: "Money",
    Icon: IllusBank,
    nearbyQuery: "ATM",
  },
  {
    id: "digital_payments_only",
    label: "Payments break",
    prompt: "What if card and app pay stopped?",
    group: "Money",
    Icon: IllusPhone,
    nearbyQuery: "bank",
  },
  {
    id: "major_expense",
    label: "Big bill hits",
    prompt: "What if a large unexpected bill arrived?",
    group: "Money",
    Icon: IllusWallet,
  },
  {
    id: "phone_lost",
    label: "Phone gone",
    prompt: "What if your phone was gone today?",
    group: "Digital",
    free: true,
    Icon: IllusPhone,
  },
  {
    id: "internet_outage",
    label: "No internet",
    prompt: "What if the internet stayed down?",
    group: "Digital",
    Icon: IllusBolt,
  },
  {
    id: "email_compromised",
    label: "Email locked",
    prompt: "What if your main email was locked?",
    group: "Digital",
    Icon: IllusPhone,
  },
  {
    id: "power_grid",
    label: "Power out",
    prompt: "What if the grid dropped for 48h?",
    group: "Home",
    Icon: IllusBolt,
    nearbyQuery: "hardware store",
  },
  {
    id: "food_prices_double",
    label: "Food costs jump",
    prompt: "What if food cost a lot more?",
    group: "Food",
    Icon: IllusFood,
    nearbyQuery: "market",
  },
  {
    id: "store_unavailable",
    label: "Store closed",
    prompt: "What if your usual store was closed?",
    group: "Food",
    Icon: IllusFood,
    nearbyQuery: "supermarket",
  },
  {
    id: "travel_disruption",
    label: "Travel blocked",
    prompt: "What if major routes failed?",
    group: "Mobility",
    Icon: IllusBolt,
    nearbyQuery: "bus station",
  },
];

const GROUPS = ["Money", "Digital", "Home", "Food", "Mobility"];

export default function WhatIfPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [active, setActive] = useState<WhatIfScenario | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 8000 }
    );
  }, []);

  async function run(id: WhatIfScenario, free?: boolean) {
    if (!free && !premium) {
      openUpgrade({
        feature: "What If",
        title: "This scenario is Pro",
        body: "Free includes two scenarios. Pro opens the full board.",
      });
      return;
    }
    if (active === id) {
      setActive(null);
      setResult(null);
      setPlaces([]);
      return;
    }
    const s = loadSession();
    if (!s?.answers) return;
    const r = runWhatIf(id, s.answers);
    setActive(id);
    setResult(r);

    const def = SCENARIOS.find((x) => x.id === id);
    if (def?.nearbyQuery && coords) {
      setPlacesLoading(true);
      try {
        const found = await searchNearbyPlaces(def.nearbyQuery, coords, {
          scope: "city",
          limit: 4,
        });
        setPlaces(found);
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
        <p className="text-zinc-400">
          Finish assessment once so scenarios use your numbers.
        </p>
        <Link
          href="/assessment"
          className="mt-4 inline-block text-sm font-medium text-emerald-400"
        >
          Measure exposure →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24 lg:px-8">
      <PageHeader
        title="What If?"
        subtitle="Run the hit before it lands. Free: two scenarios. Pro: the full board."
        backHref="/app/overview"
        showBack
      />

      {GROUPS.map((g) => {
        const items = SCENARIOS.filter((s) => s.group === g);
        if (!items.length) return null;
        return (
          <div key={g}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {g}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {items.map((s) => {
                const locked = !s.free && !premium;
                const Icon = s.Icon;
                const open = active === s.id && !!result;
                const action = ACTIONS[s.id];
                return (
                  <div key={s.id} className={cn("col-span-1", open && "col-span-2")}>
                    <button
                      type="button"
                      onClick={() => void run(s.id, s.free)}
                      className={cn(
                        "relative w-full rounded-2xl border px-3 py-3 text-left transition",
                        open
                          ? "border-emerald-500/35 bg-emerald-500/[0.07]"
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

                    {open && result && (
                      <div className="mt-2 space-y-3 rounded-2xl border border-white/[0.08] bg-[#060a12] px-4 py-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                          Scenario · {s.label}
                        </p>
                        <p className="text-sm font-semibold text-zinc-50">{result.title}</p>
                        <p className="text-sm leading-relaxed text-zinc-300">{result.summary}</p>
                        <p className="text-sm leading-relaxed text-zinc-500">{result.detail}</p>
                        {result.recommendation && (
                          <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-100/90">
                            {result.recommendation}
                          </p>
                        )}

                        {action && (
                          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                              Do this next
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                              {action.doNext}
                            </p>
                            <Link
                              href={action.href}
                              className="mt-3 inline-flex rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-zinc-950"
                            >
                              {action.label} →
                            </Link>
                          </div>
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
