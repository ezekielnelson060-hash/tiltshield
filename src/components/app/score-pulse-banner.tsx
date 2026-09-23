"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readScorePulse,
  clearScorePulse,
  type ScorePulse,
} from "@/lib/update-situation";

/**
 * Shows after stock / journal / situation updates the score.
 * Listens live so Prepare and Situation feel consequential without leaving the page.
 */
export function ScorePulseBanner({
  onSessionRefresh,
}: {
  onSessionRefresh?: () => void;
}) {
  const [pulse, setPulse] = useState<ScorePulse | null>(null);

  const show = useCallback(
    (p: ScorePulse | null) => {
      if (!p) {
        setPulse(null);
        return;
      }
      const age = Date.now() - new Date(p.at).getTime();
      if (age >= 1000 * 60 * 60) {
        clearScorePulse();
        setPulse(null);
        return;
      }
      setPulse(p);
      try {
        onSessionRefresh?.();
      } catch {
        /* */
      }
    },
    [onSessionRefresh]
  );

  useEffect(() => {
    show(readScorePulse());

    const onPulse = () => show(readScorePulse());
    const onSession = () => show(readScorePulse());

    window.addEventListener("tiltshield:score-pulse", onPulse);
    window.addEventListener("tiltshield:session-update", onSession);
    return () => {
      window.removeEventListener("tiltshield:score-pulse", onPulse);
      window.removeEventListener("tiltshield:session-update", onSession);
    };
  }, [show]);

  useEffect(() => {
    if (!pulse) return;
    const t = setTimeout(() => {
      setPulse(null);
      clearScorePulse();
    }, 12000);
    return () => clearTimeout(t);
  }, [pulse]);

  if (!pulse) return null;

  const improved = pulse.overallTo > pulse.overallFrom;
  const same = pulse.overallTo === pulse.overallFrom;
  const sourceLabel =
    pulse.source === "stock"
      ? "from stock"
      : pulse.source === "journal"
        ? "from journal"
        : "from situation";

  return (
    <div
      className="rounded-2xl border border-emerald-500/35 bg-emerald-500/[0.1] px-4 py-3 shadow-[0_0_0_1px_rgba(16,185,129,0.08)_inset]"
      role="status"
      aria-live="polite"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
        {same
          ? "Logged — buffers updated"
          : improved
            ? "Exposure improved"
            : "Exposure changed"}
        <span className="ml-1.5 font-medium normal-case tracking-normal text-emerald-500/80">
          {sourceLabel}
        </span>
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-50">
        Score{" "}
        <span className="tabular-nums text-zinc-400">{pulse.overallFrom}</span>
        <span className="mx-1.5 text-emerald-400">→</span>
        <span className="tabular-nums">{pulse.overallTo}</span>
        <span className="text-xs font-medium text-zinc-500"> / 100</span>
      </p>
      {pulse.deltas.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {pulse.deltas.slice(0, 4).map((d) => (
            <li key={d.label} className="text-xs text-zinc-400">
              {d.label}:{" "}
              <span className="tabular-nums text-zinc-200">
                {d.from} → {d.to}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[11px] text-zinc-500">
        Break points and Today reflect this change.
      </p>
    </div>
  );
}
