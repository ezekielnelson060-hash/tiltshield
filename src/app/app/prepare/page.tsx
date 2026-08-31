"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type KitItem = { id: string; label: string; group: string };
type Vendor = { id: string; name: string; category: string; phone: string; note: string };
type Recipe = {
  id: string;
  title: string;
  needs: string[];
  steps: string;
  daysStretch: number;
  minPantryDays: number;
};

const KIT_DEFAULTS: KitItem[] = [
  { id: "water", label: "Drinking water (3+ days)", group: "Home stock" },
  { id: "food_shelf", label: "Shelf-stable food (7–30 days)", group: "Home stock" },
  { id: "recipes", label: "Practiced 2+ shelf recipes", group: "Home stock" },
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

const RECIPES: Recipe[] = [
  {
    id: "rice_beans",
    title: "Rice + beans skillet",
    needs: ["Rice", "Dry beans or lentils", "Oil", "Salt", "Shelf spices"],
    steps: "Cook beans · cook rice · combine with oil and spice · add canned veg if available",
    daysStretch: 5,
    minPantryDays: 14,
  },
  {
    id: "oats",
    title: "Oat breakfast base",
    needs: ["Rolled oats", "Water or powdered milk", "Honey or sugar", "Dried fruit"],
    steps: "Hot water + oats · stir · sweeten · add fruit",
    daysStretch: 7,
    minPantryDays: 7,
  },
  {
    id: "pasta",
    title: "Pasta emergency bowl",
    needs: ["Dry pasta", "Tomato jar/can or oil + garlic", "Salt"],
    steps: "Boil pasta · warm sauce · combine · optional canned protein",
    daysStretch: 4,
    minPantryDays: 10,
  },
  {
    id: "broth",
    title: "Broth + grain recovery",
    needs: ["Bouillon cubes", "Rice or noodles", "Canned vegetables"],
    steps: "Boil water + bouillon · add grain · stir in veg",
    daysStretch: 3,
    minPantryDays: 5,
  },
  {
    id: "peanut",
    title: "Peanut / seed calorie packs",
    needs: ["Peanut butter or seeds", "Crackers or flatbread", "Honey optional"],
    steps: "No cook · portion for quick energy when fuel is limited",
    daysStretch: 3,
    minPantryDays: 3,
  },
  {
    id: "eggs_alt",
    title: "Shelf protein stretch",
    needs: ["Canned fish or beans", "Rice or pasta", "Oil"],
    steps: "Warm protein · serve over grain · salt and oil",
    daysStretch: 4,
    minPantryDays: 14,
  },
];

const KIT_KEY = "tiltshield_kit_checks";
const VENDOR_KEY = "tiltshield_vendors";
const RECIPE_DONE_KEY = "tiltshield_recipes_practiced";

export default function PreparePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [practiced, setPracticed] = useState<Record<string, boolean>>({});
  const [pantryDays, setPantryDays] = useState(0);
  const [supplyWeeks, setSupplyWeeks] = useState(0);
  const [name, setName] = useState("");
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
    if (s?.answers) {
      setPantryDays(s.answers.food_buffer_days || 0);
      setSupplyWeeks(s.answers.emergency_supply_weeks || 0);
    }
  }, []);

  const totalFoodDays = pantryDays + Math.round(supplyWeeks * 7);

  const prioritized = useMemo(() => {
    return [...RECIPES].sort((a, b) => {
      const aNeed = pantryDays < a.minPantryDays ? 0 : 1;
      const bNeed = pantryDays < b.minPantryDays ? 0 : 1;
      return aNeed - bNeed;
    });
  }, [pantryDays]);

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
  const recipesDone = RECIPES.filter((r) => practiced[r.id]).length;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Prepare</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Stock the home. Practice meals. Know who to call in your city.
        </p>
        <p className="mt-2 text-xs text-zinc-600">
          {done}/{KIT_DEFAULTS.length} kit items · {recipesDone}/{RECIPES.length} recipes practiced
          {totalFoodDays > 0 && <> · ~{totalFoodDays} food days on file</>}
        </p>
      </div>

      {pantryDays < 14 && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
          Your assessment shows about <strong>{pantryDays}</strong> pantry days. Aim for 14+ of food
          you already eat, then expand emergency stores.
        </div>
      )}

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
          <h2 className="text-lg font-semibold text-zinc-50">Recipe planner</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Priority order uses your pantry days ({pantryDays || "—"}). Mark a recipe once you have
            cooked it once.
          </p>
        </div>
        <div className="space-y-2">
          {prioritized.map((r) => {
            const priority = pantryDays < r.minPantryDays;
            return (
              <div
                key={r.id}
                className={cn(
                  "rounded-xl border px-4 py-3",
                  practiced[r.id]
                    ? "border-emerald-500/25 bg-emerald-500/5"
                    : priority
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-zinc-800 bg-zinc-900/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {r.title}
                      {priority && !practiced[r.id] && (
                        <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-amber-400">
                          Priority
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">Stock: {r.needs.join(", ")}</p>
                    <p className="mt-1 text-xs text-zinc-500">Do: {r.steps}</p>
                    <p className="mt-1 text-[10px] text-zinc-600">
                      ~{r.daysStretch} days stretch when ingredients are stocked
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRecipe(r.id)}
                    className={cn(
                      "shrink-0 rounded-lg border px-2 py-1 text-[10px] font-medium",
                      practiced[r.id]
                        ? "border-emerald-500/40 text-emerald-400"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    {practiced[r.id] ? "Practiced" : "Mark practiced"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Local vendors</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Food, pharmacy, fuel, repair — contacts in your city beyond a single app.
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
              No vendors yet. Add one market, pharmacy, or repair contact.
            </p>
          )}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/app/actions">Today's actions</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/app/calculators">Calculators</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/assessment">Update pantry days</Link>
        </Button>
      </div>
    </div>
  );
}
