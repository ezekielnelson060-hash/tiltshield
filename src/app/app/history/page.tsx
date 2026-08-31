"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, loadHistory, type TiltSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [history, setHistory] = useState<{ date: string; overall: number }[]>([]);

  useEffect(() => {
    setSession(loadSession());
    setHistory(loadHistory());
  }, []);

  if (!session) return null;

  const current = session.scores.overall;
  const previous =
    history.length >= 2 ? history[history.length - 2].overall : null;
  const delta = previous != null ? current - previous : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">History</h1>
        <p className="mt-1 text-sm text-zinc-500">Your resilience over time</p>
      </div>

      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Current</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">{current}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Previous</p>
          <p className="mt-2 text-3xl font-bold text-zinc-400">{previous ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Change</p>
          <p
            className={`mt-2 text-3xl font-bold ${
              delta != null && delta > 0
                ? "text-emerald-400"
                : delta != null && delta < 0
                  ? "text-red-400"
                  : "text-zinc-400"
            }`}
          >
            {delta != null ? (delta > 0 ? `+${delta}` : delta) : "—"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Score timeline</p>
        <div className="mt-6 flex h-32 items-end gap-2">
          {(history.length > 0
            ? history
            : [{ date: new Date().toISOString(), overall: current }]
          ).map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-zinc-500">{h.overall}</span>
              <div
                className="w-full max-w-[40px] rounded-t bg-emerald-500/80"
                style={{ height: `${Math.max(8, h.overall)}%` }}
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

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-sm text-zinc-400">
          Retake the assessment after you complete actions to see your score move.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/assessment">Retake assessment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
