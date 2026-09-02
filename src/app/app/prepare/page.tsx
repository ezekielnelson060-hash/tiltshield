"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { searchNearbyPlaces, type NearbyPlace } from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { cn } from "@/lib/utils";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-44 items-center justify-center rounded-2xl border border-white/[0.08] text-xs text-zinc-500">
        Loading map…
      </div>
    ),
  }
);

type StockItem = { id: string; label: string; group: string; hint?: string };

const YEAR_STOCK: StockItem[] = [
  { id: "water_plan", label: "Water plan (store + purify + rotate)", group: "Year foundation", hint: "Continuous access, not one bulk buy" },
  { id: "food_90", label: "90 days of food you already eat", group: "Year foundation", hint: "Then expand deeper" },
  { id: "food_rotate", label: "Rotation system (date labels, FIFO)", group: "Year foundation" },
  { id: "cash_float", label: "Cash float for 2–4 weeks essentials", group: "Money & access" },
  { id: "alt_pay", label: "Second payment method tested this quarter", group: "Money & access" },
  { id: "meds_30", label: "Critical meds buffer (as clinician allows)", group: "Health" },
  { id: "first_aid", label: "First-aid kit checked", group: "Health" },
  { id: "light_power", label: "Light + charged power banks", group: "Home systems" },
  { id: "docs_offline", label: "IDs & key papers offline (Vault)", group: "Home systems" },
  { id: "vendor_3", label: "3 local vendors reachable offline", group: "Local network" },
  { id: "family_plan", label: "Household meetup / contact plan", group: "Local network" },
];

const STOCK_KEY = "tiltshield_year_stock";
const VENDOR_KEY = "tiltshield_saved_places";

type SavedPlace = NearbyPlace;

export default function PreparePage() {
  const [tab, setTab] = useState<"plan" | "stock" | "network">("plan");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<SavedPlace[]>([]);
  const [pantryDays, setPantryDays] = useState(0);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setChecks(JSON.parse(localStorage.getItem(STOCK_KEY) || "{}"));
      setSaved(JSON.parse(localStorage.getItem(VENDOR_KEY) || "[]"));
    } catch {
      /* */
    }
    const s = loadSession();
    if (s?.answers) setPantryDays(s.answers.food_buffer_days || 0);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  const groups = Array.from(new Set(YEAR_STOCK.map((k) => k.group)));
  const done = YEAR_STOCK.filter((k) => checks[k.id]).length;

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STOCK_KEY, JSON.stringify(next));
      return next;
    });
  }

  function persistSaved(list: SavedPlace[]) {
    setSaved(list);
    localStorage.setItem(VENDOR_KEY, JSON.stringify(list));
  }

  async function runSearch(term: string) {
    const q = term.trim();
    if (!q) return;
    setLoading(true);
    try {
      const results = await searchNearbyPlaces(q, coords);
      setPlaces(results);
      setSelected(results[0] || null);
    } finally {
      setLoading(false);
    }
  }

  function saveSelected() {
    if (!selected) return;
    if (saved.some((s) => s.id === selected.id)) return;
    persistSaved([{ ...selected }, ...saved].slice(0, 20));
  }

  const planActions = [
    { title: "Build a 7–30 day cash + food bridge", impact: "High impact", time: "20 min", href: "/app/calculators" },
    { title: "Encrypt IDs & recovery docs in Vault", impact: "High impact", time: "10 min", href: "/app/vault" },
    { title: "Map 3 offline-capable local vendors", impact: "Medium impact", time: "15 min", href: "#network" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Prepare"
        subtitle="Build toward a full year of household resilience — step by step."
        backHref="/app/overview"
      />

      <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
        {(
          [
            ["plan", "Plan"],
            ["stock", "1-year stock"],
            ["network", "Network"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-xs font-semibold transition",
              tab === id ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "plan" && (
        <div className="space-y-3">
          {pantryDays > 0 && pantryDays < 30 && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
              About <strong>{pantryDays}</strong> food days on file. Stretch toward 90 days, then a full year via rotation.
            </div>
          )}
          {planActions.map((a, i) =>
            a.href === "#network" ? (
              <button
                key={a.title}
                type="button"
                onClick={() => setTab("network")}
                className="flex w-full items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-left hover:border-emerald-500/25"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-50">{a.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{a.impact} · {a.time}</p>
                </div>
              </button>
            ) : (
              <Link key={a.title} href={a.href} className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 hover:border-emerald-500/25">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-50">{a.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{a.impact} · {a.time}</p>
                </div>
              </Link>
            )
          )}
          <p className="text-center text-xs text-zinc-500">Year checklist {done}/{YEAR_STOCK.length}</p>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-5">
          <p className="text-sm text-zinc-500">A full year is layers: water, food rotation, meds, money access, power, people.</p>
          {groups.map((g) => (
            <section key={g} className="space-y-2">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{g}</h2>
              <ul className="space-y-1.5">
                {YEAR_STOCK.filter((k) => k.group === g).map((k) => (
                  <li key={k.id}>
                    <button type="button" onClick={() => toggle(k.id)} className={cn("flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm", checks[k.id] ? "border-emerald-500/30 bg-emerald-500/10 text-zinc-100" : "border-white/[0.08] bg-white/[0.03] text-zinc-400")}>
                      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px]", checks[k.id] ? "border-emerald-500 bg-emerald-500 text-zinc-950" : "border-zinc-600")}>{checks[k.id] ? "✓" : ""}</span>
                      <span>{k.label}{k.hint && <span className="mt-0.5 block text-[11px] text-zinc-500">{k.hint}</span>}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === "network" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">Find places near you — multi-pin map + results stay in the app. Save ones you trust offline.</p>
          <div className="relative">
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void runSearch(query); }} placeholder="Pharmacy, market, clinic…" className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-4 pr-24 text-sm text-zinc-50 placeholder:text-zinc-600" />
            <Button type="button" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" disabled={loading} onClick={() => void runSearch(query || "pharmacy")}>{loading ? "…" : "Search"}</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {["pharmacy", "supermarket", "clinic", "fuel", "atm"].map((q) => (
              <button key={q} type="button" onClick={() => { setQuery(q); void runSearch(q); }} className="rounded-full bg-white/[0.04] px-3 py-1.5 text-xs capitalize text-zinc-400 ring-1 ring-white/[0.06] hover:text-emerald-400">{q}</button>
            ))}
          </div>
          <NearbyMap places={places} selected={selected} user={coords} onSelect={setSelected} className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/[0.08] sm:h-56" />
          <div className="space-y-2">
            {places.map((p) => (
              <button key={p.id} type="button" onClick={() => setSelected(p)} className={cn("flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left", selected?.id === p.id ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/[0.08] bg-white/[0.03]")}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-100">{p.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{p.address}</p>
                  {p.distanceKm != null && <p className="mt-1 text-[10px] text-zinc-600">{formatDistance(p.distanceKm)}</p>}
                </div>
              </button>
            ))}
          </div>
          {selected && <Button type="button" size="sm" onClick={saveSelected}>Save “{selected.name}” offline</Button>}
          {saved.length > 0 && (
            <section className="space-y-2 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Saved offline</p>
              {saved.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-xl border border-white/[0.08] px-4 py-3">
                  <div>
                    <p className="text-sm text-zinc-100">{v.name}</p>
                    <p className="line-clamp-1 text-xs text-zinc-500">{v.address}</p>
                  </div>
                  <button type="button" className="text-xs text-zinc-500" onClick={() => persistSaved(saved.filter((x) => x.id !== v.id))}>Remove</button>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
