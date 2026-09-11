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
  loadStockChecks,
  saveStockChecks,
  applyJournalToStock,
  labelForStockId,
  phaseProgress,
  stockProgress,
} from "@/lib/year-stock";
import { buildExposureSnapshot } from "@/lib/break-point";
import { formatLongDate } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlaceRow } from "@/components/app/place-row";
import {
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
  const [justTicked, setJustTicked] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [selected, setSelected] = useState<NearbyPlace | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setJournal(loadJournal());
    setChecks(loadStockChecks());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  const answers = session?.answers;
  const snap = useMemo(() => {
    if (!session?.answers || !session?.scores) return null;
    return buildExposureSnapshot(session.answers, session.scores);
  }, [session]);
  const primary = snap?.primary;
  const moves = answers ? planMovesFromAssessment(answers) : [];
  const groups = Array.from(new Set(YEAR_STOCK.map((k) => k.group)));
  const progress = stockProgress(checks);
  const phases = phaseProgress(checks);
  const stockList = answers ? sortStockIds(YEAR_STOCK, answers) : YEAR_STOCK;

  function toggle(id: string) {
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
      const c = { ...loadStockChecks() };
      for (const id of pickedStock) c[id] = true;
      saveStockChecks(c);
      setChecks(c);
    } else {
      setChecks(loadStockChecks());
    }
    setJournal(loadJournal());
    setDraft("");
    setPickedStock([]);
    setJustTicked(newly.length ? newly : pickedStock);
    try {
      window.dispatchEvent(new Event("tiltshield:progress"));
    } catch {
      /* */
    }
  }

  function removeEntry(id: string) {
    deleteJournalEntry(id);
    setJournal(loadJournal());
  }

  async function search(q: string) {
    setLoading(true);
    try {
      const r = await searchNearbyPlaces(q, coords, { scope: "global", limit: 20 });
      setPlaces(r);
      setSelected(r[0] ?? null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Prepare"
        subtitle="12-month plan from your exposure map. Stock, journal, places — evidence, not hope."
        backHref="/app/overview"
        showBack
      />

      <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
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
        <div className="space-y-4">
          {primary && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400/90">
                Shortest clock drives the year plan
              </p>
              <p className="mt-1 text-sm text-zinc-100">
                <span className="font-semibold tabular-nums">{primary.value}</span>
                {" · "}
                {primary.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{primary.meaning}</p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Year checklist · {progress.done}/{progress.total} ({progress.pct}%)
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              12-month phases
            </p>
            {phases.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-50">
                      {p.title}
                      <span className="ml-2 text-[11px] font-normal text-zinc-500">
                        {p.months}
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {p.outcome}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-emerald-400">
                    {p.done}/{p.total}
                  </p>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500/80"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

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
              className="block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 hover:border-emerald-500/25"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-100">{a.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{a.why}</p>
                </div>
              </div>
            </Link>
          ))}
          <p className="text-center text-xs text-zinc-600">
            Year checklist {progress.done}/{progress.total} · Journal {journal.length}{" "}
            entries
          </p>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            Tick only when true. Log detail in Journal so Progress knows what moved.
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
                        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left",
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

      {tab === "journal" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-zinc-100">Prep journal</p>
            <p className="mt-1 text-xs text-zinc-400">
              Log what you got or did. Keywords and stock tags auto-tick the year checklist.
            </p>
            {primary && (
              <p className="mt-2 text-xs text-amber-200/90">
                Focus: shortest clock is {primary.label} ({primary.value}). Prefer entries that close that gap.
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
            rows={4}
            placeholder={
              kind === "got"
                ? "e.g. Bought 25kg rice + labeled cash envelope"
                : kind === "did"
                  ? "e.g. Tested backup card at the market"
                  : kind === "checked"
                    ? "e.g. Verified water store and purify tabs"
                    : "What moved this week?"
            }
            className="w-full resize-y rounded-2xl border border-white/[0.08] bg-[#080d16] px-4 py-3 text-sm text-zinc-100"
          />

          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Tag year-stock items (optional)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {YEAR_STOCK.map((item) => (
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
            Log entry
          </Button>
          {justTicked.length > 0 && (
            <p className="text-center text-xs text-emerald-400">
              Ticked: {justTicked.map(labelForStockId).join(", ")}
            </p>
          )}
          {journal.length === 0 ? (
            <p className="text-xs text-zinc-500">No entries yet. Log the first real move.</p>
          ) : (
            <div className="space-y-2">
              {journal.map((e) => (
                <div
                  key={e.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex justify-between gap-2">
                    <p className="text-[11px] text-zinc-500">
                      <span className="font-semibold text-emerald-400/90">
                        {kindLabel(e.kind)}
                      </span>
                      {" · "}
                      {formatLongDate(e.at)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeEntry(e.id)}
                      className="text-[11px] text-zinc-600 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-200">{e.text}</p>
                  {e.stockIds && e.stockIds.length > 0 && (
                    <p className="mt-1 text-[10px] text-zinc-500">
                      → {e.stockIds.map(labelForStockId).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "finder" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Search worldwide — suppliers and places you would trust on a hard day.
          </p>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void search(query || "pharmacy");
              }}
              placeholder="e.g. solar supplier, pharmacy chain…"
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
          <NearbyMap
            places={places}
            selected={selected}
            user={coords}
            onSelect={setSelected}
            scope="global"
            className="h-56 w-full overflow-hidden rounded-2xl border border-white/10"
          />
          <div className="space-y-2">
            {places.map((pl) => (
              <PlaceRow
                key={pl.id}
                place={pl}
                selected={selected?.id === pl.id}
                onSelect={() => setSelected(pl)}
                showSave={false}
              />
            ))}
          </div>
          <Link
            href="/app/nearby"
            className="block text-center text-sm font-medium text-emerald-400"
          >
            Open city / nation map →
          </Link>
        </div>
      )}
    </div>
  );
}
