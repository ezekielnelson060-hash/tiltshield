"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { trackUpgradeClick } from "@/lib/analytics";

type Props = {
  title?: string;
  body?: string;
  className?: string;
  variant?: "card" | "inline" | "lock";
};

export function UpgradeGate({
  title = "Pro unlocks the rest",
  body = "All four break points, What If?, live intel, vault, and the 12-month tracker.",
  className,
  variant = "card",
}: Props) {
  const [busy, setBusy] = useState(false);

  async function startPro() {
    trackUpgradeClick("pro_monthly", "upgrade_gate");
    setBusy(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "pro_monthly" }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      const s = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "pro_monthly" }),
      });
      const sj = await s.json();
      if (sj.url) window.location.href = sj.url;
    } finally {
      setBusy(false);
    }
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2.5",
          className
        )}
      >
        <p className="text-xs text-zinc-300">{title}</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void startPro()}
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 disabled:opacity-60"
        >
          {busy ? "Opening…" : "Unlock Pro · $15/mo"}
        </button>
      </div>
    );
  }

  if (variant === "lock") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3",
          className
        )}
      >
        <div className="select-none blur-[3px]">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500">Locked</p>
          <p className="mt-0.5 text-lg font-bold text-zinc-100">••</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50">
          <button
            type="button"
            disabled={busy}
            onClick={() => void startPro()}
            className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-300"
          >
            Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
        Free plan limit
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-50">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void startPro()}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
        >
          {busy ? "Opening…" : "Unlock Pro · $15/mo"}
        </button>
        <Link
          href="/pricing"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-zinc-300"
        >
          See plans
        </Link>
      </div>
    </div>
  );
}
