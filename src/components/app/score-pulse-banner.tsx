"use client";

import { useEffect, useState } from "react";
import {
  readScorePulse,
  clearScorePulse,
  type ScorePulse,
} from "@/lib/update-situation";

/** Shows after stock / journal / situation updates the score. */
export function ScorePulseBanner() {
  const [pulse, setPulse] = useState<ScorePulse | null>(null);

  useEffect(() => {
    const p = readScorePulse();
    if (!p) return;
    const age = Date.now() - new Date(p.at).getTime();
    if (age >= 1000 * 60 * 60) {
      clearScorePulse();
      return;
    }
    setPulse(p);
    const t = setTimeout(() => {
      setPulse(null);
      clearScorePulse();
    }, 10000);
    return () => clearTimeout(t);
  }, []);

  if (!pulse) return null;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
        Something moved
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-50">
        Score {pulse.overallFrom} → {pulse.overallTo}
      </p>
      <ul className="mt-2 space-y-0.5">
        {pulse.deltas.slice(0, 4).map((d) => (
          <li key={d.label} className="text-xs text-zinc-400">
            {d.label}:{" "}
            <span className="text-zinc-200">
              {d.from} → {d.to}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
