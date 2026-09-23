"use client";

import { cn } from "@/lib/utils";
import {
  addCustomStockItem,
  removeCustomStockItem,
  saveStockChecks,
} from "@/lib/year-stock";

const STOCK_CATEGORIES = [
  "Food & water",
  "Money",
  "Health",
  "Home",
  "Documents & people",
  "Your plan",
] as const;

type StockRow = {
  id: string;
  label: string;
  hint?: string;
  group: string;
};

type Props = {
  groups: string[];
  stockList: StockRow[];
  checks: Record<string, boolean>;
  customDraft: string;
  setCustomDraft: (v: string) => void;
  customGroup: string;
  setCustomGroup: (v: string) => void;
  setStockVersion: (fn: (v: number) => number) => void;
  setChecks: (
    fn: (prev: Record<string, boolean>) => Record<string, boolean>
  ) => void;
  toggleStock: (id: string) => void;
};

export function PrepareStockTab({
  groups,
  stockList,
  checks,
  customDraft,
  setCustomDraft,
  customGroup,
  setCustomGroup,
  setStockVersion,
  setChecks,
  toggleStock,
}: Props) {
  return (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Add to your list
            </p>
            <div className="mt-2 space-y-2">
              <input
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                placeholder="Something you need on the shelf or in the plan"
                className="w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
              />
              <div className="flex gap-2">
                <select
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                >
                  {STOCK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!customDraft.trim()}
                  onClick={() => {
                    const label = customDraft.trim();
                    if (!label) return;
                    const item = addCustomStockItem(label, customGroup);
                    setStockVersion((v) => v + 1);
                    setCustomDraft("");
                    setChecks((prev) => {
                      const next = { ...prev, [item.id]: false };
                      saveStockChecks(next);
                      return next;
                    });
                  }}
                  className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {g}
              </p>
              <div className="space-y-2">
                {stockList
                  .filter((k) => k.group === g)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleStock(item.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition",
                        checks[item.id]
                          ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                          : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px]",
                          checks[item.id]
                            ? "border-emerald-400 bg-emerald-500 text-zinc-950"
                            : "border-zinc-600 text-transparent"
                        )}
                      >
                        ✓
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-zinc-100">
                          {item.label}
                        </span>
                        {item.hint && (
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-zinc-500">
                            {item.hint}
                          </span>
                        )}
                      </span>
                      {item.id.startsWith("custom_") && (
                        <button
                          type="button"
                          className="shrink-0 text-[11px] text-zinc-500 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomStockItem(item.id);
                            setStockVersion((v) => v + 1);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
  );
}
