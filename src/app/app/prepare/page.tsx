"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession, type TiltSession } from "@/lib/session";
import { sortStockIds } from "@/lib/prepare-rank";
import { planMovesFromAssessment, foodStory, runwayStory } from "@/lib/plan-from-assessment";
import { addJournalEntry, deleteJournalEntry, loadJournal, kindLabel, type JournalEntry, type JournalKind } from "@/lib/journal";
import {
  loadStockChecks, saveStockChecks, applyJournalToStock, labelForStockId,
  phaseProgress, stockProgress, allStockItems, addCustomStockItem, removeCustomStockItem,
} from "@/lib/year-stock";
import { buildExposureSnapshot } from "@/lib/break-point";
import { formatLongDate } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  applyAnswerPatch, boostFromStockComplete, boostFromJournalText,
} from "@/lib/update-situation";

type Tab = "plan" | "stock" | "journal";

const STOCK_CATEGORIES = ["Food & water", "Money", "Health", "Home", "Documents & people", "Your plan"] as const;
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
  const [customDraft, setCustomDraft] = useState("");
  const [customGroup, setCustomGroup] = useState("Your plan");
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
      const turningOn = !prev[id];
      const next = { ...prev, [id]: turningOn };
      saveStockChecks(next);
      if (turningOn) {
        const patch = boostFromStockComplete(id);
        if (patch) applyAnswerPatch(patch, "stock");
      }
      try { window.dispatchEvent(new Event("tiltshield:progress")); } catch { /* */ }
      return next;
    });
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
    } else setChecks(loadStockChecks());
    setJournal(loadJournal());
    setDraft("");
    setPickedStock([]);
    setJustTicked(newly.length ? newly : pickedStock);
    try { window.dispatchEvent(new Event("tiltshield:progress")); } catch { /* */ }
  }

  return (
    <div className="space-y-5 pb-24">
      <PageHeader title="Prepare" subtitle="Your 12-month readiness plan. Track stock, log progress." />
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(["plan", "stock", "journal"] as const).map((id) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className={cn("flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize",
              tab === id ? "bg-emerald-500 text-zinc-950" : "text-zinc-400")}>{id}</button>
        ))}
      </div>

      {tab === "plan" && (
        <div className="space-y-4">
          {primary && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-400">Your shortest break point</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">{primary.value}</p>
              <p className="text-sm text-zinc-200">{primary.label}</p>
              <p className="mt-1 text-xs text-zinc-400">{primary.meaning}</p>
            </div>
          )}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-4">
            <p className="text-[10px] font-semibold uppercase text-emerald-400">Year progress</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-50">{progress.done}<span className="text-lg text-zinc-500">/{progress.total}</span></p>
            <div className="mt-2 h-2 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress.pct}%` }} /></div>
          </div>
          {moves.length > 0 && (
            <ol className="space-y-2">
              {moves.slice(0, 4).map((m, i) => (
                <li key={m.id || i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-100">{i + 1}. {m.title}</p>
                  {m.why && <p className="mt-1 text-xs text-zinc-500">{m.why}</p>}
                </li>
              ))}
            </ol>
          )}
          {answers && (
            <div className="space-y-1 text-xs text-zinc-400">
              <p>{runwayStory(answers)}</p>
              <p>{foodStory(answers)}</p>
            </div>
          )}
          <div className="space-y-2">
            {phases.map((p, idx) => {
              const isCurrent = !p.complete && phases.slice(0, idx).every((x) => x.complete);
              return (
                <div key={p.id} className={cn("rounded-2xl border px-4 py-3", isCurrent ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "border-white/[0.08] bg-white/[0.03]")}>
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-zinc-50">{p.title} <span className="text-[11px] font-normal text-zinc-500">{p.months}</span></p>
                    <p className="text-xs text-emerald-400">{p.done}/{p.total}</p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{p.outcome}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "stock" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 space-y-2">
            <p className="text-[10px] font-semibold uppercase text-zinc-500">Add to your list</p>
            <input value={customDraft} onChange={(e) => setCustomDraft(e.target.value)}
              placeholder="Something you need on the shelf or in the plan"
              className="w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50" />
            <div className="flex gap-2">
              <select value={customGroup} onChange={(e) => setCustomGroup(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-200">
                {STOCK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" disabled={!customDraft.trim()}
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
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-40">Add</button>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-2 text-[10px] font-semibold uppercase text-zinc-500">{g}</p>
              <div className="space-y-2">
                {stockList.filter((k) => k.group === g).map((item) => (
                  <button key={item.id} type="button" onClick={() => toggleStock(item.id)}
                    className={cn("flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left",
                      checks[item.id] ? "border-emerald-500/30 bg-emerald-500/[0.08]" : "border-white/[0.08] bg-white/[0.03]")}>
                    <span className={cn("mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border text-[10px]",
                      checks[item.id] ? "border-emerald-400 bg-emerald-500 text-zinc-950" : "border-zinc-600 text-transparent")}>✓</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-zinc-100">{item.label}</span>
                      {item.hint && <span className="mt-0.5 block text-[11px] text-zinc-500">{item.hint}</span>}
                    </span>
                    {item.id.startsWith("custom_") && (
                      <button type="button" className="text-[11px] text-zinc-500" onClick={(e) => {
                        e.stopPropagation();
                        removeCustomStockItem(item.id);
                        setStockVersion((v) => v + 1);
                      }}>Remove</button>
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
          <p className="text-xs text-zinc-500">Write what you got or finished. Matching stock lines tick off; your score can move.</p>
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button key={k.id} type="button" onClick={() => setKind(k.id)}
                className={cn("rounded-full px-3 py-1 text-[11px]", kind === k.id ? "bg-emerald-500 text-zinc-950" : "border border-white/10 text-zinc-400")}>{k.label}</button>
            ))}
          </div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
            placeholder="What did you get or finish?"
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100" />
          <div className="flex flex-wrap gap-1.5">
            {catalog.map((item) => (
              <button key={item.id} type="button" onClick={() => setPickedStock((prev) => prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id])}
                className={cn("rounded-full px-2.5 py-1 text-[10px]", pickedStock.includes(item.id) || checks[item.id] ? "bg-emerald-500/20 text-emerald-300" : "border border-white/10 text-zinc-500")}>
                {item.label.length > 28 ? item.label.slice(0, 26) + "…" : item.label}
              </button>
            ))}
          </div>
          <Button className="w-full" disabled={!draft.trim()} onClick={submitJournal}>Save entry</Button>
          {justTicked.length > 0 && <p className="text-center text-xs text-emerald-400">Ticked: {justTicked.map(labelForStockId).join(", ")}</p>}
          <ul className="space-y-2">
            {journal.map((e) => (
              <li key={e.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                <p className="text-[10px] text-zinc-500"><span className="text-emerald-400">{kindLabel(e.kind)}</span> · {formatLongDate(e.at)}</p>
                <p className="mt-1 text-sm text-zinc-100">{e.text}</p>
                <button type="button" className="mt-1 text-[10px] text-zinc-600" onClick={() => { deleteJournalEntry(e.id); setJournal(loadJournal()); }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-[11px] text-zinc-600">
        <Link href="/app/situation" className="text-emerald-400">Update my situation →</Link>
      </p>
    </div>
  );
}
