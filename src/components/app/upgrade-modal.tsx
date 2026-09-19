"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onUpgradeRequest, type UpgradePayload } from "@/lib/upgrade";
import { trackUpgradeClick } from "@/lib/analytics";

const DEFAULTS = {
  title: "You hit the free limit",
  body: "Pro unlocks every break point, full What If, full intel, and the document vault.",
};

export function UpgradeModal() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<UpgradePayload>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return onUpgradeRequest((p) => {
      setPayload(p);
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function startPro(product: "pro_monthly" | "pro_yearly" = "pro_monthly") {
    trackUpgradeClick(product, payload.feature || "upgrade_modal");
    setBusy(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      const s = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const sj = await s.json();
      if (sj.url) window.location.href = sj.url;
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const title = payload.title || DEFAULTS.title;
  const body = payload.body || DEFAULTS.body;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#0a1018] shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.06] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
            {payload.feature ? `Pro · ${payload.feature}` : "Free plan limit"}
          </p>
          <p className="mt-1.5 text-lg font-semibold text-zinc-50">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
        </div>

        <ul className="space-y-2 border-b border-white/[0.06] px-5 py-4 text-sm text-zinc-300">
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span> Every break point, not just financial
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span> Full What If board
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span> Full intel matched to your gaps
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-400">•</span> Encrypted document vault
          </li>
        </ul>

        <div className="space-y-2 px-5 py-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void startPro("pro_monthly")}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60"
          >
            {busy ? "Opening…" : "Unlock Pro · $15/mo"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void startPro("pro_yearly")}
            className="w-full rounded-xl border border-white/15 py-2.5 text-sm font-medium text-zinc-200 disabled:opacity-60"
          >
            Save with yearly · $79/yr
          </button>
          <div className="flex items-center justify-between pt-1">
            <Link href="/pricing" className="text-xs text-zinc-500 hover:text-zinc-300">
              Compare plans
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
