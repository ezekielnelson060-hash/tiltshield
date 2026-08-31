"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type KitItem = { id: string; label: string; group: string };
type Vendor = { id: string; name: string; category: string; phone: string; note: string };

const KIT_DEFAULTS: KitItem[] = [
  { id: "water", label: "Drinking water (3+ days)", group: "Home stock" },
  { id: "food_shelf", label: "Shelf-stable food (7–30 days)", group: "Home stock" },
  { id: "recipes", label: "Simple recipes using what you stock", group: "Home stock" },
  { id: "light", label: "Flashlight / lantern + batteries", group: "Home kit" },
  { id: "powerbank", label: "Charged power bank", group: "Home kit" },
  { id: "cash", label: "Small cash float for local spend", group: "Home kit" },
  { id: "med_basic", label: "First-aid: bandages, antiseptic, pain relief", group: "Medical" },
  { id: "med_personal", label: "Personal prescription meds (extra days)", group: "Medical" },
  { id: "med_thermo", label: "Thermometer", group: "Medical" },
  { id: "gold", label: "Hard assets noted (gold/silver) — optional", group: "Value" },
  { id: "docs", label: "Offline copies of IDs & key papers", group: "Documents" },
  { id: "seeds", label: "Hardware wallet seed / recovery offline", group: "Documents" },
];

const KIT_KEY = "tiltshield_kit_checks";
const VENDOR_KEY = "tiltshield_vendors";

const RECIPES = [
  {
    title: "Rice + beans skillet",
    needs: "Rice, dry beans or lentils, oil, salt, any shelf spices",
    steps: "Soak/cook beans · cook rice · combine with oil and spice · stretch with canned veg if you have it",
  },
  {
    title: "Oat breakfast base",
    needs: "Rolled oats, powdered milk or water, honey/sugar, dried fruit",
    steps: "Hot water + oats · stir · add sweetener and fruit · stores well in bulk",
  },
  {
    title: "Pasta emergency bowl",
    needs: "Dry pasta, jar/can tomato or oil + garlic, salt",
    steps: "Boil pasta · warm sauce or oil · combine · optional canned protein",
  },
  {
    title: "Broth + grain recovery",
    needs: "Bouillon or stock cubes, rice or noodles, any veg can",
    steps: "Boil water + bouillon · add grain · stir in veg · soft food when stress is high",
  },
];

export default function PreparePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      setChecks(JSON.parse(localStorage.getItem(KIT_KEY) || "{}"));
      setVendors(JSON.parse(localStorage.getItem(VENDOR_KEY) || "[]"));
    } catch {
      /* */
    }
  }, []);

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(KIT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function saveVendors(list: Vendor[]) {
    setVendors(list);
    localStorage.setItem(VENDOR_KEY, JSON.stringify(list));
  }

  function addVendor() {
    if (!name.trim()) return;
    saveVendors([
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        category,
        phone: phone.trim(),
        note: note.trim(),
      },
      ...vendors,
    ]);
    setName("");
    setPhone("");
    setNote("");
  }

  const groups = Array.from(new Set(KIT_DEFAULTS.map((k) => k.group)));
  const done = KIT_DEFAULTS.filter((k) => checks[k.id]).length;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Prepare</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Stock the home. Build kits. Know who to call in your city when systems are slow or offline.
        </p>
        <p className="mt-2 text-xs text-zinc-600">
          {done} of {KIT_DEFAULTS.length} checklist items ready
        </p>
      </div>

      {groups.map((g) => (
        <section key={g} className="space-y-2">
          <h2 className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{g}</h2>
          <ul className="space-y-1.5">
            {KIT_DEFAULTS.filter((k) => k.group === g).map((k) => (
              <li key={k.id}>
                <button
                  type="button"
                  onClick={() => toggle(k.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                    checks[k.id]
                      ? "border-emerald-500/30 bg-emerald-500/5 text-zinc-200"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px]",
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

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Recipes from shelf stock</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Simple meals from food you can store — practice cooking them before you need them.
          </p>
        </div>
        <div className="space-y-2">
          {RECIPES.map((r) => (
            <div key={r.title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
              <p className="text-sm font-medium text-zinc-100">{r.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                <span className="text-zinc-400">Stock: </span>
                {r.needs}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                <span className="text-zinc-400">Do: </span>
                {r.steps}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Local vendors</h2>
          <p className="mt-1 text-sm text-zinc-500">
            People and shops in your city — food, pharmacy, fuel, repair — you can reach without only relying on one app.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name / shop"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
          >
            {["Food", "Pharmacy", "Fuel", "Repair", "Water", "Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (area, hours, what they supply)"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
          />
          <Button type="button" size="sm" onClick={addVendor}>
            Add vendor
          </Button>
        </div>
        <ul className="space-y-2">
          {vendors.map((v) => (
            <li
              key={v.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  {v.name}{" "}
                  <span className="text-xs font-normal text-zinc-500">· {v.category}</span>
                </p>
                {v.phone && <p className="mt-0.5 text-xs text-emerald-400">{v.phone}</p>}
                {v.note && <p className="mt-0.5 text-xs text-zinc-500">{v.note}</p>}
              </div>
              <button
                type="button"
                className="text-xs text-zinc-600 hover:text-red-400"
                onClick={() => saveVendors(vendors.filter((x) => x.id !== v.id))}
              >
                Remove
              </button>
            </li>
          ))}
          {vendors.length === 0 && (
            <p className="text-sm text-zinc-500">
              No vendors yet. Add one market, pharmacy, or repair contact you trust.
            </p>
          )}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/app/actions">Today&apos;s actions</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/app/calculators">Calculators</Link>
        </Button>
      </div>
    </div>
  );
}
