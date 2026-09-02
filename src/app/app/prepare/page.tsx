"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { loadSession, type TiltSession } from "@/lib/session";
import { sortStockIds } from "@/lib/prepare-rank";
import {
  planMovesFromAssessment,
  foodStory,
  runwayStory,
} from "@/lib/plan-from-assessment";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NEARBY_CATEGORIES,
  searchNearbyPlaces,
  type NearbyPlace,
} from "@/lib/nearby";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
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
  { id: "water_plan", label: "Water you can reach at home", group: "Year foundation", hint: "Store + a simple purify method" },
  { id: "food_90", label: "90 days of food you already eat", group: "Year foundation", hint: "Same meals — deeper shelves" },
  { id: "food_rotate", label: "Dates on every package", group: "Year foundation", hint: "Oldest first so nothing is wasted" },
  { id: "cash_float", label: "Cash for 2–4 weeks of essentials", group: "Money & access" },
  { id: "alt_pay", label: "A second way to pay — tested", group: "Money & access" },
  { id: "meds_30", label: "Extra critical meds (if safe)", group: "Health" },
  { id: "first_aid", label: "First-aid kit ready", group: "Health" },
  { id: "light_power", label: "Lights and charged power banks", group: "Home" },
  { id: "docs_offline", label: "ID copies you can reach offline", group: "Docs & people" },
  { id: "vendor_3", label: "Three places nearby that work offline", group: "Docs & people" },
  { id: "family_plan", label: "Household meetup plan", group: "Docs & people" },
];

const STOCK_KEY = "tiltshield_year_stock";

export default function PreparePage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [tab, setTab] = useState<Tab>("plan");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
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
      setSelected(r[0] ?? null);
    } finally {
      setLoading(false);
    }
  }

  const answers = session?.answers;
  const moves = answers ? planMovesFromAssessment(answers) : [];
  const groups = Array.from(new Set(YEAR_STOCK.map((k) => k.group)));
  const done = YEAR_STOCK.filter((k) => checks[k.id]).length;
  const stockList = answers ? sortStockIds(YEAR_STOCK, answers) : YEAR_STOCK;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Prepare"
        subtitle="Your year of calm — built from what you told us, one honest step at a time."
        backHref="/app/overview"
        showBack
      />

      <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
        {(
          [
            ["plan", "Your plan"],
            ["stock", "Year stock"],
            ["finder", "Places"],
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
          {answers && (
            <>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-zinc-300">
                {runwayStory(answers)}
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
                {foodStory(answers)}
              </div>
            </>
          )}
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Ordered for your gaps
          </p>
          {moves.map((a, i) => (
            <Link
              key={a.id}
              href={a.href}
              className="block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition hover:border-emerald-500/25"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-100">{a.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    {a.why}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-400/90">
                    {a.minutes} · Open →
                  </p>
                </div>
              </div>
            </Link>
          ))}
          <p className="text-center text-xs text-zinc-600">
            Year checklist {done}/{YEAR_STOCK.length} complete
          </p>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-400">
            A year is not one shopping trip. It is water, food you will eat, money
            you can touch, medicine, light, papers, and people — layered over time.
          </p>
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {g}
              </p>
              <div className="space-y-2">
                {stockList
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
          <p className="text-sm text-zinc-400">
            Find real places near you. Save the ones you would trust on a hard day.
          </p>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pharmacy, market, ATM…"
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
          <NearbyMap
            places={places}
            selected={selected}
            user={coords}
            onSelect={setSelected}
            className="h-48 w-full overflow-hidden rounded-2xl border border-white/10"
          />
          <Link
            href="/app/nearby"
            className="block text-center text-sm font-medium text-emerald-400"
          >
            Open full map →
          </Link>
        </div>
      )}
    </div>
  );
}
