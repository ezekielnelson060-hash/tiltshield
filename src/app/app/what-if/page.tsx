"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, setPremium, type TiltSession } from "@/lib/session";
import { runWhatIf } from "@/lib/scoring";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCENARIOS: {
  id: WhatIfScenario;
  icon: string;
  label: string;
  free?: boolean;
}[] = [
  { id: "income_stops", icon: "\ud83d\udcbc", label: "Income stops", free: true },
  { id: "banking_down", icon: "\ud83c\udfe6", label: "Banking unavailable" },
  { id: "phone_lost", icon: "\ud83d\udcf1", label: "Phone lost" },
  { id: "food_prices_double", icon: "\ud83d\uded2", label: "Food costs double" },
];

export default function WhatIfPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [active, setActive] = useState<WhatIfScenario | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
  }, []);

  function run(id: WhatIfScenario, free?: boolean) {
    if (!session) return;
    if (!free && !premium) {
      if (window.confirm("This scenario is part of the full plan. Unlock for demo?")) {
        setPremium(true);
        setPrem(true);
      } else return;
    }
    setActive(id);
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runWhatIf(id, session.answers));
      setRunning(false);
    }, 600);
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">What If?</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Test your resilience before reality does.
        </p>
      </div>

      {!active && (
        <div className="grid gap-3 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => run(s.id, s.free)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left transition hover:border-zinc-600"
            >
              <span className="text-lg">{s.icon}</span>
              <p className="mt-2 font-medium text-zinc-100">
                {s.label}
                {!s.free && !premium && (
                  <span className="ml-2 text-xs text-zinc-600">Full plan</span>
                )}
              </p>
              <p className="mt-1 text-xs text-zinc-500">Run simulation →</p>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => {
              setActive(null);
              setResult(null);
            }}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            ← All scenarios
          </button>

          {running && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
              <p className="text-sm text-zinc-400">Running simulation…</p>
              <div className="mx-auto mt-4 h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500" />
              </div>
            </div>
          )}

          {result && !running && (
            <div
              className={cn(
                "rounded-2xl border p-6",
                result.severity === "critical" && "border-red-500/30 bg-red-500/5",
                result.severity === "high" && "border-orange-500/30 bg-orange-500/5",
                result.severity === "medium" && "border-amber-500/30 bg-amber-500/5",
                result.severity === "low" && "border-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <h2 className="text-lg font-semibold text-zinc-50">{result.title}</h2>
              <p className="mt-4 text-2xl font-medium text-zinc-100">{result.summary}</p>
              <p className="mt-3 text-sm text-zinc-400">{result.detail}</p>
              <div className="mt-6 rounded-xl bg-zinc-950/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  Your next move
                </p>
                <p className="mt-2 text-sm text-zinc-200">{result.recommendation}</p>
                <div className="mt-4">
                  <Button asChild size="sm">
                    <Link href="/app/actions">Fix this →</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
