"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadSession,
  loadHistory,
  daysSinceLastAssessment,
  mergeCloudHistory,
  type TiltSession,
  type HistoryEntry,
} from "@/lib/session";
import { loadHistoryFromCloud } from "@/lib/persist";
import { getActiveMemberId } from "@/lib/family";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const mid = getActiveMemberId();
    setSession(loadSession(mid));
    setHistory(loadHistory(mid));
    setDaysSince(daysSinceLastAssessment(mid));
    setSyncing(true);
    void (async () => {
      const cloud = await loadHistoryFromCloud();
      if (cloud.length) {
        mergeCloudHistory(cloud);
        setHistory(loadHistory(mid));
      }
      setSyncing(false);
    })();
  }, []);

  if (!session && history.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">No assessments yet.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my readiness score</Link>
        </Button>
      </div>
    );
  }

  const current =
    session?.scores.overall ?? history[history.length - 1]?.overall ?? 0;
  const prev = history.length >= 2 ? history[history.length - 2].overall : null;
  const delta = prev != null ? current - prev : null;
  const maxScore = Math.max(...history.map((h) => h.overall), current, 1);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">History</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Local + cloud score history. Retake monthly to see preparation move the needle.
          {syncing && " Syncing…"}
        </p>
      </div>

      {daysSince != null && daysSince >= 28 && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
          Last full assessment was about <strong>{daysSince} days</strong> ago.
          <div className="mt-3">
            <Button asChild size="sm">
              <Link href="/assessment">Retake assessment</Link>
            </Button>
          </div>
        </div>
      )}

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Latest</p>
          <p className="mt-1 text-2xl font-bold text-zinc-50">{current}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Change</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              delta == null
                ? "text-zinc-500"
                : delta > 0
                  ? "text-emerald-400"
                  : delta < 0
                    ? "text-red-400"
                    : "text-zinc-400"
            }`}
          >
            {delta != null ? (delta > 0 ? `+${delta}` : delta) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Checks</p>
          <p className="mt-1 text-2xl font-bold text-zinc-50">{history.length || 1}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Score timeline
        </p>
        <div className="mt-6 flex h-36 items-end gap-1.5 sm:gap-2">
          {(history.length > 0
            ? history
            : [
                {
                  date: session?.completedAt || new Date().toISOString(),
                  overall: current,
                },
              ]
          ).map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] tabular-nums text-zinc-500">{h.overall}</span>
              <div
                className="w-full max-w-[48px] rounded-t bg-emerald-500/80"
                style={{
                  height: `${Math.max(8, (h.overall / maxScore) * 100)}%`,
                }}
              />
              <span className="text-[9px] text-zinc-600">
                {new Date(h.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Assessment log
          </p>
          <ul className="space-y-2">
            {[...history].reverse().map((h, i) => (
              <li
                key={`${h.date}-${i}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-zinc-200">
                    Score {h.overall}
                    {h.runwayDays != null && (
                      <span className="ml-2 text-xs font-normal text-zinc-500">
                        · {h.runwayDays}d runway
                      </span>
                    )}
                    {h.source === "cloud" && (
                      <span className="ml-2 text-[10px] text-zinc-600">cloud</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(h.date).toLocaleString()}
                    {h.monthlyIncome != null && h.monthlyIncome > 0 && (
                      <> · income ${h.monthlyIncome.toLocaleString()}</>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 text-[10px] text-zinc-500">
                  {h.money != null && <span>Money {h.money}</span>}
                  {h.food != null && <span>Food {h.food}</span>}
                  {h.digital != null && <span>Digital {h.digital}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-sm text-zinc-400">
          Complete Prepare and Actions, then retake. Rising score means less dependence when systems
          shift.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/assessment">Retake assessment</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/app/family">Family profiles</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
