"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { loadSession, type TiltSession } from "@/lib/session";
import { rankPrepareActions } from "@/lib/prepare-rank";
import { sortStockIds } from "@/lib/prepare-rank";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NEARBY_CATEGORIES,
  searchNearbyPlaces,
  type NearbyPlace,
} from "@/lib/nearby";

const NearbyMap = dynamic(
  () => import("@/components/map/NearbyMap").then((m) => m.NearbyMap),
  { ssr: false }
);

type Tab = "plan" | "stock" | "finder";

type StockItem = {
  id: string;
  label: string;
  group: string;
  hint?: string;
};

const YEAR_STOCK: StockItem[] = [
  { id: "water_plan", label: "Water plan at home", group: "Year foundation", hint: "Store + purify" },
  { id: "food_90", label: "90 days of normal food", group: "Year foundation", hint: "Then grow the buffer" },
  { id: "food_rotate", label: "Date labels on food", group: "Year foundation" },
  { id: "cash_float", label: "Cash for 2–4 weeks", group: "Money & access" },
  { id: "alt_pay", label: "Second way to pay (tested)", group: "Money & access" },
  { id: "meds_30", label: "Extra critical meds (if safe)", group: "Health" },
  { id: "first_aid", label: "First-aid kit ready", group: "Health" },
  { id: "light_power", label: "Lights and charged power banks", group: "Home" },
  { id: "docs_offline", label: "IDs saved offline", group: "Docs & people" },
  { id: "vendors_3", label: "3 nearby places you can use offline", group: "Docs & people" },
  { id: "meetup", label: "Family meetup plan", group: "Docs & people" },
];

const STOCK_KEY = "tiltshield_year_stock";

export default function PreparePage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [tab, setTab] = useState<Tab>("plan");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    try {
      const raw = localStorage.getItem(STOCK_KEY);
      if (raw) setChecks(JSON.parse(raw));
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
  }, []);

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STOCK_KEY, JSON.stringify(next));
      } catch {
        /* */
      }
      return next;
    });
  }

  async function search(q: string) {
    setLoading(true);
    try {
      let r = await searchNearbyPlaces(q, coords);
      if (!r.length) r = await searchNearbyPlaces(q, coords, { national: true });
      setPlaces(r);
    } finally {
      setLoading(false);
    }
  }

  const answers = session?.answers;
  const ranked = answers ? rankPrepareActions(answers) : [];
  const pantryDays = answers?.food_buffer_days ?? 0;
  const groups = Array.from(new Set(YEAR_STOCK.map((k) => k.group)));
  const done = YEAR_STOCK.filter((k) => checks[k.id]).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Prepare"
        subtitle="Simple checklist. One box at a time toward a safer year."
        backHref="/app/overview"
        showBack
      />

      <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
        {(
          [
            ["plan", "Plan"],
            ["stock", "1-year stock"],
            ["finder", "Finder"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-full py-2 text-xs font-semibold transition",
              tab === id
                ? "bg-emerald-500 text-zinc-950"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "plan" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
            You have about <strong>{pantryDays}</strong> food days noted. Aim for 90 days next.
          </div>
          {ranked.slice(0, 5).map((a, i) => (
            <div
              key={a.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-100">{a.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {a.impact} · {a.minutes} min
                  </p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-zinc-600">
            Year checklist {done}/{YEAR_STOCK.length}
          </p>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            Why a year? Short kits run out. Tick what you have. Then add the next layer.
          </p>
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {g}
              </p>
              <div className="space-y-2">
                {(answers
                  ? sortStockIds(YEAR_STOCK, answers)
                  : YEAR_STOCK
                )
                  .filter((k) => k.group === g)
                  .map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => toggle(k.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                        checks[k.id]
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-white/[0.08] bg-white/[0.03]"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px]",
                          checks[k.id]
                            ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                            : "border-zinc-600"
                        )}
                      >
                        {checks[k.id] ? "✓" : ""}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-zinc-100">
                          {k.label}
                        </span>
                        {k.hint && (
                          <span className="mt-0.5 block text-xs text-zinc-500">
                            {k.hint}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "finder" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            Find real places near you. Save the ones you trust.
          </p>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Farm, solar, ATM, co-op…"
              className="flex-1 rounded-xl border border-white/[0.08] bg-[#080d16] px-4 py-2.5 text-sm text-zinc-100"
            />
            <Button
              size="sm"
              disabled={loading}
              onClick={() => void search(query || "pharmacy")}
            >
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {NEARBY_CATEGORIES.slice(0, 8).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setQuery(c.label);
                  void search(c.query);
                }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300"
              >
                {c.label}
              </button>
            ))}
          </div>
          {coords && (
            <NearbyMap
              center={coords}
              places={places}
              className="h-48 w-full overflow-hidden rounded-2xl border border-white/10"
            />
          )}
          <Link
            href="/app/nearby"
            className="block text-center text-sm font-medium text-emerald-400"
          >
            Open full Independent Finder →
          </Link>
        </div>
      )}
    </div>
  );
}
