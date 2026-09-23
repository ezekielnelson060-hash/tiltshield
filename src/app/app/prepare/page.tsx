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
import {
  applyAnswerPatch,
  boostFromStockComplete,
  boostFromJournalText,
} from "@/lib/update-situation";
import { formatLongDate } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { ScorePulseBanner } from "@/components/app/score-pulse-banner";
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

const STOCK_CATEGORIES = [
  "Food & water",
  "Money",
  "Health",
  "Home",
  "Documents & people",
  "Your plan",
] as const;

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
  const [customGroup, setCustomGroup] = useState("Your plan");
  const [stockVersion, setStockVersion] = useState(0);

  useEffect(() => {
    setSession(loadSession());
    setChecks(loadStockChecks());
    setJournal(loadJournal());
    try {
      const t = new URLSearchParams(window.location.search).get("tab");
      if (t === "plan" || t === "stock" || t === "journal" || t === "finder") {
        setTab(t);
      }
    } catch {
      /* */
    }
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
      const turningOn = !prev[id];
      const next = { ...prev, [id]: turningOn };
      saveStockChecks(next);
      if (turningOn) {
        const patch = boostFromStockComplete(id);
        if (patch) {
          applyAnswerPatch(patch, "stock");
          setSession(loadSession());
        }
      }
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
    const jPatch = boostFromJournalText(text);
    if (jPatch) applyAnswerPatch(jPatch, "journal");
    for (const id of pickedStock) {
      const p = boostFromStockComplete(id);
      if (p) applyAnswerPatch(p, "journal");
    }
    if (pickedStock.length) {
      const c = loadStockChecks();
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
    setSession(loadSession());
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
    <div className="mx-auto max-w-2xl space-y-5 px-4 pb-24 pt-2">
      <PageHeader
        title="Prepare"
        subtitle="Build your stockpile and weekly moves for the year. Track what you have, log what you did."
      />

      <ScorePulseBanner onSessionRefresh={() => setSession(loadSession())} />

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
                  Stock checklist
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-50">
                  {progress.done}
                  <span className="text-lg font-medium text-zinc-500">/{progress.total}</span>
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">items on the list</p>
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

          {answers && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Where you stand
              </p>
              <p className="text-xs leading-relaxed text-zinc-400">{runwayStory(answers)}</p>
              <p className="text-xs leading-relaxed text-zinc-400">{foodStory(answers)}</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Year stockpile plan
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

          {moves.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                This week&apos;s moves
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

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Longform guides
            </p>
            <div className="space-y-2">
              <Link
                href="/guides"
                className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">Read the guides</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    Emergency fund · bank outage · income loss · phone · food prices
                  </p>
                </div>
                <span className="text-xs text-emerald-400">Open →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-5">
          <p className="text-sm text-zinc-400">Open Stock tab content is loading from local — if you see this after deploy, refresh.</p>
          <Link href="/app/prepare?tab=plan" className="text-emerald-400 text-sm">Back to plan →</Link>
        </div>
      )}

      {tab === "journal" && (
        <div className="space-y-5">
          <p className="text-sm text-zinc-400">Journal is available after full Prepare restore.</p>
        </div>
      )}

      {tab === "finder" && (
        <div className="space-y-5">
          <p className="text-sm text-zinc-400">Places finder is available after full Prepare restore.</p>
        </div>
      )}
    </div>
  );
}
