"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { loadSession, type TiltSession } from "@/lib/session";
import { sortStockIds } from "@/lib/prepare-rank";
import {
  planMovesFromAssessment,
  foodStory,
  runwayStory,
} from "@/lib/plan-from-assessment";
import {
  addJournalEntry,
  deleteJournalEntry,
  loadJournal,
  kindLabel,
  type JournalEntry,
  type JournalKind,
} from "@/lib/journal";
import {
  YEAR_STOCK,
  YEAR_PHASES,
  loadStockChecks,
  saveStockChecks,
  applyJournalToStock,
  labelForStockId,
  phaseProgress,
  stockProgress,
  allStockItems,
  addCustomStockItem,
  removeCustomStockItem,
  loadCustomStock,
} from "@/lib/year-stock";
import { buildExposureSnapshot } from "@/lib/break-point";
import { formatLongDate } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlaceRow } from "@/components/app/place-row";
import {
  NEARBY_CATEGORIES,
  searchNearbyPlaces,
  type NearbyPlace,
} from "@/lib/nearby";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  { ssr: false }
);

type Tab = "plan" | "stock" | "journal" | "finder";

const KINDS: { id: JournalKind; label: string }[] = [
  { id: "got", label: "Got" },
  { id: "did", label: "Did" },
  { id: "checked", label: "Checked" },
  { id: "note", label: "Note" },
];

export default function PreparePage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [tab, setTab] = useState<Tab>("plan");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState<JournalKind>("got");
  const [pickedStock, setPickedStock] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [justTicked, setJustTicked] = useState<string[]>([]);
  const [customDraft, setCustomDraft] = useState("");
  const [stockVersion, setStockVersion] = useState(0);

  useEffect(() => {
    setSession(loadSession());
    setChecks(loadStockChecks());
    setJournal(loadJournal());
  }, []);

  const answers = session?.answers;
  const snap = useMemo(() => {
    if (!session?.answers || !session?.scores) return null;
    return buildExposureSnapshot(session.answers, session.scores);
  }, [session]);
  const primary = snap?.primary;
  const moves = answers ? planMovesFromAssessment(answers) : [];
  const catalog = useMemo(() => allStockItems(), [stockVersion]);
  const groups = Array.from(new Set(catalog.map((k) => k.group)));
  const progress = stockProgress(checks);
  const phases = phaseProgress(checks);
  const stockList = answers ? sortStockIds(catalog, answers) : catalog;

  function toggleStock(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveStockChecks(next);
      try {
        window.dispatchEvent(new Event("tiltshield:progress"));
      } catch {
        /* */
      }
      return next;
    });
  }

  function togglePick(id: string) {
    setPickedStock((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function submitJournal() {
    const text = draft.trim();
    if (!text) return;
    addJournalEntry(text, { kind, stockIds: pickedStock });
    const newly = applyJournalToStock(text);
    if (pickedStock.length) {
      const c = loadStockChecks();
      for (const id of pickedStock) c[id] = true;
      saveStockChecks(c);
    }
    setJournal(loadJournal());
    setChecks(loadStockChecks());
    setDraft("");
    setPickedStock([]);
    setJustTicked(newly.length ? newly : pickedStock);
  }

  async function runSearch(q: string) {
    setLoading(true);
    try {
      const list = await searchNearbyPlaces(q || "market", coords, {
        scope: "city",
        limit: 12,
      });
      setPlaces(list);
      setSelected(list[0] || null);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:max-w-none lg:px-8 lg:py-8 pb-24">
      <PageHeader
        title="Prepare"
        subtitle="Your 12-month readiness plan. Track stock, log progress, map places."
        backHref="/app/overview"
        showBack
      />

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(
          [
            ["plan", "Plan"],
            ["stock", "Stock"],
            ["journal", "Journal"],
            ["finder", "Places"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium",
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
        <div className="space-y-5">
          {primary && (
            <div className="rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-500/[0.08] to-transparent px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-400">
                Your shortest break point
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-50 tabular-nums">
                {primary.value}
              </p>
              <p className="mt-0.5 text-sm font-medium text-zinc-200">{primary.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{primary.meaning}</p>
            </div>
          )}

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400/90">
                  Year progress
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-50">
                  {progress.done}
                  <span className="text-lg font-medium text-zinc-500">/{progress.total}</span>
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">items complete</p>
              </div>
              <p className="text-2xl font-bold tabular-nums text-emerald-400">{progress.pct}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>

          {moves.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Do these next
              </p>
              <ol className="space-y-2">
                {moves.slice(0, 4).map((m, i) => (
                  <li
                    key={m.id || i}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] font-bold text-emerald-400">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-100">{m.title}</p>
                        {m.why && (
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{m.why}</p>
                        )}
                        {m.minutes && (
                          <p className="mt-1.5 text-[11px] text-zinc-600">~{m.minutes}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {answers && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                From your assessment
              </p>
              <p className="text-xs leading-relaxed text-zinc-400">{runwayStory(answers)}</p>
              <p className="text-xs leading-relaxed text-zinc-400">{foodStory(answers)}</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              12-month roadmap
            </p>
            <div className="space-y-2">
              {phases.map((p, idx) => {
                const isCurrent =
                  !p.complete && phases.slice(0, idx).every((x) => x.complete);
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "rounded-2xl border px-4 py-3",
                      isCurrent
                        ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                        : p.complete
                          ? "border-white/[0.06] bg-white/[0.02] opacity-80"
                          : "border-white/[0.08] bg-white/[0.03]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-50">{p.title}</p>
                          <span className="text-[11px] text-zinc-500">{p.months}</span>
                          {isCurrent && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                              Current
                            </span>
                          )}
                          {p.complete && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                              Done
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{p.outcome}</p>
                      </div>
                      <p className="shrink-0 text-xs font-semibold tabular-nums text-emerald-400">
                        {p.done}/{p.total}
                      </p>
                    </div>
                    <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-500/90"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <ul className="mt-2.5 space-y-1">
                      {p.stockIds.map((id) => (
                        <li
                          key={id}
                          className={cn(
                            "flex items-center gap-2 text-[11px]",
                            checks[id] ? "text-emerald-400/90" : "text-zinc-500"
                          )}
                        >
                          <span className="text-[10px]">{checks[id] ? "✓" : "○"}</span>
                          <span>{labelForStockId(id)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Add to your list
            </p>
            <div className="mt-2 flex gap-2">
              <input
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                placeholder="Something you need on the shelf or in the plan"
                className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
              />
              <button
                type="button"
                disabled={!customDraft.trim()}
                onClick={() => {
                  const label = customDraft.trim();
                  if (!label) return;
                  const item = addCustomStockItem(label);
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
                        <span className="mb-1 inline-block rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                          {item.group}
                        </span>
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
      )}

      {tab === "journal" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-zinc-100">Journal</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Write what you got or finished. Matching lines on your stock list tick off automatically.
            </p>
            {primary && (
              <p className="mt-2 text-xs text-amber-200/90">
                Priority: <span className="font-semibold">{primary.label}</span> ({primary.value}).
                Entries that close this gap matter most.
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
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
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
            placeholder="What did you get or finish?"
            className="w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50"
          />
          <div className="flex flex-wrap gap-2">
            {catalog.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => togglePick(item.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  pickedStock.includes(item.id) || checks[item.id]
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 text-zinc-500"
                )}
              >
                {item.label.slice(0, 28)}
              </button>
            ))}
          </div>
          <Button type="button" onClick={submitJournal} disabled={!draft.trim()}>
            Save entry
          </Button>
          {justTicked.length > 0 && (
            <p className="text-xs text-emerald-400">
              Ticked: {justTicked.map(labelForStockId).join(", ")}
            </p>
          )}
          <div className="space-y-2">
            {journal.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  {kindLabel(e.kind)} · {formatLongDate(e.at)}
                </p>
                <p className="mt-1 text-sm text-zinc-200">{e.text}</p>
                {e.stockIds?.length ? (
                  <p className="mt-1 text-[11px] text-emerald-400/80">
                    → {e.stockIds.map(labelForStockId).join(" · ")}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="mt-1 text-[11px] text-zinc-600 hover:text-red-400"
                  onClick={() => {
                    deleteJournalEntry(e.id);
                    setJournal(loadJournal());
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "finder" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places near you"
              className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm"
            />
            <Button type="button" onClick={() => void runSearch(query)}>
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {NEARBY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setQuery(c.label);
                  void runSearch(c.query);
                }}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
              >
                {c.label}
              </button>
            ))}
          </div>
          {loading && <p className="text-xs text-zinc-500">Searching…</p>}
          <NearbyMap places={places} selected={selected} user={coords} />
          <div className="space-y-2">
            {places.map((pl) => (
              <PlaceRow
                key={pl.id}
                place={pl}
                onSelect={() => setSelected(pl)}
                active={selected?.id === pl.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
