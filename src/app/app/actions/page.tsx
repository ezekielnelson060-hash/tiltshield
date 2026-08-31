"use client";

import { useEffect, useState } from "react";
import { loadSession, type TiltSession } from "@/lib/session";
import { pickTodaysMove, ACTION_LIBRARY } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
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
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Actions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {done.length === 0
            ? "1 active · start with highest impact"
            : `${done.length} completed · keep going`}
        </p>
      </div>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">Today</p>
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
          <Button size="sm" onClick={() => toggleDone(move.id)} disabled={done.includes(move.id)}>
            {done.includes(move.id) ? "Completed" : "Mark complete"}
          </Button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {["all", "money", "digital", "food", "home", "documents", "communication"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs capitalize transition",
              filter === f
                ? "border-emerald-500 text-emerald-400"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <section>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Upcoming</p>
        <div className="space-y-2">
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-200">{a.title}</p>
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
            <p className="text-sm text-zinc-500">No more actions in this filter.</p>
          )}
        </div>
      </section>

      {completed.length > 0 && (
        <section>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">Completed</p>
          <div className="space-y-2">
            {completed.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-zinc-900 px-4 py-3 text-sm text-zinc-500 line-through"
              >
                {a.title}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
