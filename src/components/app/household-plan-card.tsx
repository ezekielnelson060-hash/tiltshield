"use client";

import { useEffect, useState } from "react";
import {
  loadHouseholdPlan,
  toggleHouseholdPlanItem,
  householdPlanProgress,
  pullPlanFromCloud,
  type HouseholdPlanItem,
} from "@/lib/household-plan";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";

export function HouseholdPlanCard() {
  const [items, setItems] = useState<HouseholdPlanItem[]>([]);

  useEffect(() => {
    setItems(loadHouseholdPlan());
    void pullPlanFromCloud().then(setItems);
  }, []);

  const prog = householdPlanProgress(items.length ? items : loadHouseholdPlan());

  return (
    <GlassCard>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        Shared year plan
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        One list for the roof — syncs when you are signed in.
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${prog.pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-zinc-500">
        {prog.done}/{prog.total} done
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.id}>
            <button
              type="button"
              onClick={() => setItems(toggleHouseholdPlanItem(i.id))}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                i.done
                  ? "border-emerald-500/25 bg-emerald-500/10 text-zinc-400 line-through"
                  : "border-white/[0.08] bg-white/[0.03] text-zinc-200"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                  i.done
                    ? "border-emerald-400 bg-emerald-500 text-zinc-950"
                    : "border-white/20"
                )}
              >
                {i.done ? "✓" : ""}
              </span>
              {i.label}
            </button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
