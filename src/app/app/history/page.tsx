"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadSession,
  loadHistory,
  daysSinceLastAssessment,
  type HistoryEntry,
} from "@/lib/session";
import { loadHistoryFromCloud } from "@/lib/persist";
import { getActiveMemberId } from "@/lib/family";
import { AppTopBar } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    const mid = getActiveMemberId();
    const s = loadSession(mid);
    setOverall(s?.scores.overall ?? 0);
    setHistory(loadHistory(mid));
    setDaysSince(daysSinceLastAssessment(mid));
    void (async () => {
      await loadHistoryFromCloud();
      setHistory(loadHistory(mid));
    })();
  }, []);

  const latest = history[0]?.overall ?? overall;
  const prev = history[1]?.overall;
  const change = prev != null ? latest - prev : null;
  const maxScore = Math.max(100, ...history.map((h) => h.overall), 1);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <AppTopBar title="History" backHref="/app/more" />
      <p className="-mt-2 text-sm text-zinc-500">
        Your resilience score over time. Retake after real changes — cash, food,
        family, or work — to see the needle move.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Latest", value: String(latest) },
          {
            label: "Change",
            value:
              change == null ? "—" : change > 0 ? `+${change}` : String(change),
          },
          { label: "Checks", value: String(history.length || 1) },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-4 text-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {c.label}
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Score timeline
        </p>
        {history.length === 0 ? (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Complete an assessment to start your timeline.
          </p>
        ) : (
          <div className="mt-6 flex h-36 items-end gap-2">
            {[...history].reverse().slice(-8).map((h) => {
              const pct = Math.max(8, (h.overall / maxScore) * 100);
              const d = new Date(h.at);
              const label = d.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              });
              return (
                <div
                  key={h.at + h.overall}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-[10px] tabular-nums text-zinc-400">
                    {h.overall}
                  </span>
                  <div
                    className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[9px] text-zinc-600">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Assessment log
        </p>
        {history.map((h) => (
          <div
            key={h.at + String(h.overall)}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">Score {h.overall}</p>
              <p className="text-xs text-zinc-500">
                {new Date(h.at).toLocaleString()}
              </p>
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                h.overall >= 60 ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {h.overall >= 60 ? "Stronger" : "Build up"}
            </span>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-sm text-zinc-500">No log entries yet.</p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/assessment">Retake assessment</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/app/overview">Back to Today</Link>
        </Button>
      </div>

      {daysSince != null && (
        <p className="text-center text-xs text-zinc-600">
          Last assessed {daysSince === 0 ? "today" : `${daysSince} day(s) ago`}
        </p>
      )}
    </div>
  );
}
