"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatLongDate } from "@/lib/locale";
import {
  kindLabel,
  type JournalEntry,
  type JournalKind,
} from "@/lib/journal";
import { labelForStockId } from "@/lib/year-stock";

const KINDS: { id: JournalKind; label: string }[] = [
  { id: "got", label: "Got" },
  { id: "did", label: "Did" },
  { id: "checked", label: "Checked" },
  { id: "note", label: "Note" },
];

type StockRow = { id: string; label: string };

type Props = {
  primary: { label: string; value: string } | null | undefined;
  kind: JournalKind;
  setKind: (k: JournalKind) => void;
  draft: string;
  setDraft: (v: string) => void;
  catalog: StockRow[];
  pickedStock: string[];
  checks: Record<string, boolean>;
  togglePick: (id: string) => void;
  submitJournal: () => void;
  justTicked: string[];
  journal: JournalEntry[];
  removeEntry: (id: string) => void;
};

export function PrepareJournalTab({
  primary,
  kind,
  setKind,
  draft,
  setDraft,
  catalog,
  pickedStock,
  checks,
  togglePick,
  submitJournal,
  justTicked,
  journal,
  removeEntry,
}: Props) {
  return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-zinc-100">Journal</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Write what you got or finished. Matching lines on your stock list tick off
              automatically.
            </p>
            {primary && (
              <p className="mt-2 text-xs text-amber-200/90">
                Priority: <span className="font-semibold">{primary.label}</span> (
                {primary.value}). Entries that close this gap matter most.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKind(k.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium",
                  kind === k.id
                    ? "bg-emerald-500 text-zinc-950"
                    : "border border-white/10 text-zinc-400"
                )}
              >
                {k.label}
              </button>
            ))}
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder={
              kind === "got"
                ? "e.g. Bought 25kg rice + labeled cash envelope"
                : kind === "did"
                  ? "e.g. Tested backup card at the market"
                  : kind === "checked"
                    ? "e.g. Verified water store and purify tabs"
                    : "What moved this week?"
            }
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/40 focus:outline-none"
          />

          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Tag year-stock items (optional)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {catalog.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePick(item.id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px]",
                    pickedStock.includes(item.id) || checks[item.id]
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "border border-white/10 text-zinc-500"
                  )}
                >
                  {item.label.length > 28 ? item.label.slice(0, 26) + "…" : item.label}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" disabled={!draft.trim()} onClick={submitJournal}>
            Save entry
          </Button>

          {justTicked.length > 0 && (
            <p className="text-center text-xs text-emerald-400">
              Ticked: {justTicked.map(labelForStockId).join(", ")}
            </p>
          )}

          {journal.length === 0 ? (
            <p className="text-center text-xs text-zinc-600">
              No entries yet. One honest line beats a blank checklist.
            </p>
          ) : (
            <ul className="space-y-2">
              {journal.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-zinc-500">
                        <span className="font-semibold text-emerald-400/90">
                          {kindLabel(e.kind)}
                        </span>
                        {" · "}
                        {formatLongDate(e.at)}
                      </p>
                      <p className="mt-1 text-sm text-zinc-100">{e.text}</p>
                      {e.stockIds && e.stockIds.length > 0 && (
                        <p className="mt-1 text-[10px] text-zinc-500">
                          → {e.stockIds.map(labelForStockId).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEntry(e.id)}
                      className="text-[10px] text-zinc-600 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
  );
}
