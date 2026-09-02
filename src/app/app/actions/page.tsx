"use client";

import { useEffect, useState } from "react";
import { loadSession, type TiltSession } from "@/lib/session";
import { pickTodaysMove, ACTION_LIBRARY } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";

export default function ActionsPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setSession(loadSession());
    try {
      setDone(JSON.parse(localStorage.getItem("tiltshield_done_actions") || "[]"));
    } catch {
      /* */
    }
  }, []);

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("tiltshield_done_actions", JSON.stringify(next));
      return next;
    });
  }

  if (!session) return null;

  const move = pickTodaysMove(session.vulnerabilities, done);
  const upcoming = ACTION_LIBRARY.filter(
    (a) =>
      a.id !== move.id &&
      !done.includes(a.id) &&
      (filter === "all" || a.category === filter)
  );
  const completed = ACTION_LIBRARY.filter((a) => done.includes(a.id));

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Actions"
        subtitle={
          done.length === 0
            ? "1 active · start with highest impact"
            : `${done.length} completed · keep going`
        }
        backHref="/app/prepare"
        showBack
      />

      <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/12 to-[#0a1018] p-6 shadow-[0_0_40px_-12px_rgba(16,185,129,0.25)]">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
          Today
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-50">{move.title}</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {move.time_estimate} · {move.difficulty}
        </p>
        <p className="mt-3 text-sm text-zinc-400">{move.why}</p>
        <ul className="mt-4 space-y-2">
          {move.steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-zinc-300">
              <span className="text-emerald-500">□</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <Button size="sm" onClick={() => toggleDone(move.id)}>
            Mark done
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Up next
        </p>
        {upcoming.slice(0, 8).map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100">{a.title}</p>
              <p className="text-xs text-zinc-500">
                {a.time_estimate} · {a.category}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => toggleDone(a.id)}>
              Done
            </Button>
          </div>
        ))}
        {upcoming.length === 0 && (
          <p className="text-sm text-zinc-500">All caught up for now.</p>
        )}
      </section>

      {completed.length > 0 && (
        <section className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Completed
          </p>
          {completed.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 opacity-70"
            >
              <p className="text-sm text-zinc-400 line-through">{a.title}</p>
              <button
                type="button"
                className="text-xs text-zinc-500 hover:text-zinc-300"
                onClick={() => toggleDone(a.id)}
              >
                Undo
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
