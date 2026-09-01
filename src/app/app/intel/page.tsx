"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { INTEL_LIBRARY, personalizeIntel, type IntelScope } from "@/lib/intel";
import { cn } from "@/lib/utils";

const TABS: { id: IntelScope | "all"; label: string }[] = [
  { id: "all", label: "For you" },
  { id: "local", label: "Local" },
  { id: "global", label: "Global" },
  { id: "watchlist", label: "Watchlist" },
];

export default function IntelPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [topCat, setTopCat] = useState<string | undefined>();
  const [overall, setOverall] = useState(50);
  const [incomeSources, setIncomeSources] = useState(1);
  const [altPay, setAltPay] = useState(true);

  useEffect(() => {
    const s = loadSession();
    if (s) {
      setOverall(s.scores.overall);
      setTopCat(s.vulnerabilities[0]?.category);
      setIncomeSources(s.answers.income_sources || 1);
      setAltPay(!!s.answers.alt_payment_method);
    }
  }, []);

  const items = useMemo(() => {
    const personalized = personalizeIntel({
      overall,
      topCategory: topCat,
      hasAltPayment: altPay,
      incomeSources,
    });
    if (tab === "all") return personalized;
    if (tab === "watchlist")
      return personalized.filter((i) => i.impact === "high");
    return INTEL_LIBRARY.filter((i) => i.scope === tab);
  }, [tab, overall, topCat, altPay, incomeSources]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Intel</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Developments that may affect your resilience — not a generic news feed.
          World → exposure → action.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              tab === t.id
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={i.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  {i.category} · {i.hoursAgo}h ago
                </p>
                <h2 className="mt-1 text-sm font-medium text-zinc-100">{i.title}</h2>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] capitalize",
                  i.impact === "high" && "bg-red-500/15 text-red-400",
                  i.impact === "medium" && "bg-amber-500/15 text-amber-400",
                  i.impact === "low" && "bg-zinc-800 text-zinc-400"
                )}
              >
                {i.impact}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">{i.summary}</p>
            {i.actionHint && (
              <p className="mt-3 text-xs text-emerald-400/90">Next: {i.actionHint}</p>
            )}
            <div className="mt-3 flex gap-3 text-xs">
              <Link href="/app/what-if" className="text-zinc-500 hover:text-zinc-300">
                Stress-test →
              </Link>
              <Link href="/app/prepare" className="text-zinc-500 hover:text-zinc-300">
                Prepare →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
