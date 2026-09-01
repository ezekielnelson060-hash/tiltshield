"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { googleMapsSearchUrl } from "@/lib/nearby";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { cn } from "@/lib/utils";

type KitItem = { id: string; label: string; group: string };
type Vendor = {
  id: string;
  name: string;
  category: string;
  phone: string;
  note: string;
};
type Recipe = {
  id: string;
  title: string;
  needs: string[];
  steps: string;
  minPantryDays: number;
};

const KIT_DEFAULTS: KitItem[] = [
  { id: "water", label: "Drinking water — 3+ days per person", group: "Home stock" },
  { id: "food_shelf", label: "Shelf-stable food you already eat (7–30 days)", group: "Home stock" },
  { id: "recipes", label: "Two shelf recipes you have actually cooked", group: "Home stock" },
  { id: "light", label: "Flashlight / lantern + batteries", group: "Home kit" },
  { id: "powerbank", label: "Charged power bank", group: "Home kit" },
  { id: "cash", label: "Small cash float for essentials", group: "Home kit" },
  { id: "med_basic", label: "First-aid: bandages, antiseptic, pain relief", group: "Medical" },
  { id: "med_personal", label: "Personal prescription meds (extra days)", group: "Medical" },
  { id: "docs", label: "Offline copies of IDs & key papers", group: "Documents" },
];

const RECIPES: Recipe[] = [
  {
    id: "rice_beans",
    title: "Rice + beans skillet",
    needs: ["Rice", "Dry beans or lentils", "Oil", "Salt"],
    steps: "Cook beans · cook rice · combine",
    minPantryDays: 14,
  },
  {
    id: "oats",
    title: "Oat breakfast base",
    needs: ["Rolled oats", "Water or powdered milk", "Honey or sugar"],
    steps: "Hot water + oats · stir · sweeten",
    minPantryDays: 7,
  },
  {
    id: "pasta",
    title: "Pasta emergency bowl",
    needs: ["Dry pasta", "Tomato jar/can", "Salt"],
    steps: "Boil pasta · warm sauce · combine",
    minPantryDays: 10,
  },
];

const KIT_KEY = "tiltshield_kit_checks";
const VENDOR_KEY = "tiltshield_vendors";
const RECIPE_DONE_KEY = "tiltshield_recipes_practiced";

export default function PreparePage() {
  const [tab, setTab] = useState<"plan" | "topics" | "templates">("plan");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [practiced, setPracticed] = useState<Record<string, boolean>>({});
  const [pantryDays, setPantryDays] = useState(0);
  const [query, setQuery] = useState("");
  const [saveName, setSaveName] = useState("");
  const [category, setCategory] = useState("Food");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      setChecks(JSON.parse(localStorage.getItem(KIT_KEY) || "{}"));
      setVendors(JSON.parse(localStorage.getItem(VENDOR_KEY) || "[]"));
      setPracticed(JSON.parse(localStorage.getItem(RECIPE_DONE_KEY) || "{}"));
    } catch {
      /* */
    }
    const s = loadSession();
    if (s?.answers) setPantryDays(s.answers.food_buffer_days || 0);
  }, []);

  const groups = Array.from(new Set(KIT_DEFAULTS.map((k) => k.group)));
  const done = KIT_DEFAULTS.filter((k) => checks[k.id]).length;
  const prioritized = useMemo(
    () =>
      [...RECIPES].sort((a, b) => {
        const aNeed = pantryDays < a.minPantryDays ? 0 : 1;
        const bNeed = pantryDays < b.minPantryDays ? 0 : 1;
        return aNeed - bNeed;
      }),
    [pantryDays]
  );

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(KIT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleRecipe(id: string) {
    setPracticed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(RECIPE_DONE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function saveVendors(list: Vendor[]) {
    setVendors(list);
    localStorage.setItem(VENDOR_KEY, JSON.stringify(list));
  }

  function searchMap(q: string) {
    const term = q.trim();
    if (!term) return;
    window.open(googleMapsSearchUrl(term), "_blank", "noreferrer");
  }

  function addVendor() {
    const n = (saveName || query).trim();
    if (!n) return;
    saveVendors([
      {
        id: crypto.randomUUID(),
        name: n,
        category,
        phone: phone.trim(),
        note: note.trim(),
      },
      ...vendors,
    ]);
    setSaveName("");
    setPhone("");
    setNote("");
  }

  const planActions = [
    {
      title: "Build a 7-day cash buffer",
      impact: "High impact",
      time: "12 min",
      href: "/app/calculators",
    },
    {
      title: "Back up critical documents",
      impact: "Medium impact",
      time: "8 min",
      href: "/app/vault",
    },
    {
      title: "Create offline contacts list",
      impact: "Low impact",
      time: "4 min",
      href: "#",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Prepare"
        subtitle="Your personalized action plan."
        backHref="/app/overview"
      />

      <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
        {(
          [
            ["plan", "Plan"],
            ["topics", "Topics"],
            ["templates", "Templates"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-xs font-semibold transition",
              tab === id
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "plan" && (
        <div className="space-y-3">
          {planActions.map((a, i) =>
            a.href === "#" ? (
              <button
                key={a.title}
                type="button"
                onClick={() => setTab("templates")}
                className="flex w-full items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-left transition hover:border-emerald-500/25"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-50">{a.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {a.impact} · {a.time}
                  </p>
                </div>
                <span className="mt-1 h-4 w-4 rounded border border-zinc-600" />
              </button>
            ) : (
              <Link
                key={a.title}
                href={a.href}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 transition hover:border-emerald-500/25"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-50">{a.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {a.impact} · {a.time}
                  </p>
                </div>
                <span className="mt-1 h-4 w-4 rounded border border-zinc-600" />
              </Link>
            )
          )}
          <p className="pt-1 text-center text-xs text-zinc-500">
            Kit progress {done}/{KIT_DEFAULTS.length}
          </p>
        </div>
      )}

      {tab === "topics" && (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g} className="space-y-2">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {g}
              </h2>
              <ul className="space-y-1.5">
                {KIT_DEFAULTS.filter((k) => k.group === g).map((k) => (
                  <li key={k.id}>
                    <button
                      type="button"
                      onClick={() => toggle(k.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                        checks[k.id]
                          ? "border-emerald-500/30 bg-emerald-500/10 text-zinc-100"
                          : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px]",
                          checks[k.id]
                            ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                            : "border-zinc-600"
                        )}
                      >
                        {checks[k.id] ? "✓" : ""}
                      </span>
                      {k.label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-50">Find vendors near you</h2>
            <p className="text-xs text-zinc-500">
              Search the map for venues — then save the ones you trust offline.
            </p>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchMap(query);
                }}
                placeholder="Search pharmacies, markets, fuel…"
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-4 pr-24 text-sm text-zinc-50 placeholder:text-zinc-600"
              />
              <Button
                type="button"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => searchMap(query)}
              >
                Search
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Pharmacy", "Grocery", "Organic market", "Fuel", "ATM", "Clinic"].map(
                (q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      searchMap(q);
                    }}
                    className="rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400 ring-1 ring-white/[0.06] hover:text-emerald-400"
                  >
                    {q}
                  </button>
                )
              )}
            </div>
            <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Save contact offline
              </p>
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Name / shop"
                className="w-full rounded-lg border border-white/[0.08] bg-[#060a12] px-3 py-2 text-sm text-zinc-50"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-[#060a12] px-3 py-2 text-sm text-zinc-50"
              >
                {["Food", "Pharmacy", "Fuel", "Repair", "Other"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-lg border border-white/[0.08] bg-[#060a12] px-3 py-2 text-sm text-zinc-50"
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note — hours, area"
                className="w-full rounded-lg border border-white/[0.08] bg-[#060a12] px-3 py-2 text-sm text-zinc-50"
              />
              <Button type="button" size="sm" onClick={addVendor}>
                Save vendor
              </Button>
            </div>
            {vendors.map((v) => (
              <div
                key={v.id}
                className="flex justify-between rounded-xl border border-white/[0.08] px-4 py-3 text-sm"
              >
                <div>
                  <p className="text-zinc-200">
                    {v.name} <span className="text-zinc-500">· {v.category}</span>
                  </p>
                  {v.phone && <p className="text-xs text-emerald-400">{v.phone}</p>}
                </div>
                <button
                  type="button"
                  className="text-xs text-zinc-500"
                  onClick={() => saveVendors(vendors.filter((x) => x.id !== v.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-50">Recipes</h2>
            {prioritized.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{r.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{r.needs.join(" · ")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRecipe(r.id)}
                    className={cn(
                      "text-[10px] font-medium",
                      practiced[r.id] ? "text-emerald-400" : "text-zinc-500"
                    )}
                  >
                    {practiced[r.id] ? "Practiced" : "Mark"}
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
