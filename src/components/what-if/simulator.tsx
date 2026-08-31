"use client";

import { useState } from "react";
import type { AssessmentAnswers, WhatIfScenario, WhatIfResult } from "@/types";
import { runWhatIf } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCENARIOS: { id: WhatIfScenario; label: string; free?: boolean }[] = [
  { id: "income_stops", label: "My income stops", free: true },
  { id: "banking_down", label: "Banking unavailable 72h" },
  { id: "phone_lost", label: "My phone is lost" },
  { id: "food_prices_double", label: "Food prices double" },
];

const severityStyles = {
  critical: "border-red-500/50 bg-red-500/10 text-red-300",
  high: "border-orange-500/50 bg-orange-500/10 text-orange-300",
  medium: "border-amber-500/50 bg-amber-500/10 text-amber-300",
  low: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
};

interface Props {
  answers: AssessmentAnswers;
  isPremium: boolean;
  onUnlock: () => void;
}

export function WhatIfSimulator({ answers, isPremium, onUnlock }: Props) {
  const [active, setActive] = useState<WhatIfScenario>("income_stops");
  const [result, setResult] = useState<WhatIfResult | null>(() =>
    runWhatIf("income_stops", answers)
  );

  function select(id: WhatIfScenario, free?: boolean) {
    if (!free && !isPremium) {
      onUnlock();
      return;
    }
    setActive(id);
    setResult(runWhatIf(id, answers));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-50">What If?</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Tap a scenario. See what breaks — and what to fix.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => select(s.id, s.free)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition",
              active === s.id
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-700 text-zinc-300 hover:border-zinc-500",
              !s.free && !isPremium && "opacity-70"
            )}
          >
            {s.label}
            {!s.free && !isPremium && " 🔒"}
          </button>
        ))}
      </div>

      {result && (
        <div
          className={cn(
            "rounded-xl border p-5",
            severityStyles[result.severity]
          )}
        >
          <h3 className="text-lg font-semibold text-zinc-50">{result.title}</h3>
          <p className="mt-3 text-xl font-medium">{result.summary}</p>
          <p className="mt-2 text-sm opacity-90">{result.detail}</p>
          <div className="mt-4 rounded-lg bg-zinc-950/40 p-3 text-sm">
            <p className="font-medium text-emerald-400">Recommended move</p>
            <p className="mt-1 text-zinc-200">{result.recommendation}</p>
          </div>
        </div>
      )}

      {!isPremium && (
        <Button onClick={onUnlock} className="w-full" size="lg">
          Unlock all scenarios — $29 lifetime
        </Button>
      )}
    </div>
  );
}
