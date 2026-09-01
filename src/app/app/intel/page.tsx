"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { personalizeIntel, type IntelScope } from "@/lib/intel";
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
    if (tab === "watchlist") {
      return personalized.filter((i) => i.impact === "high");
    }
    return personalized.filter((i) => i.scope === tab);
  }, [tab, overall, topCat, altPay, incomeSources]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Intel</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Information that may affect your resilience.
        </p>
      </div>

      <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-medium transition",
              tab === t.id
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition hover:border-white/12"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {item.category}
              </span>
              <span className="text-[10px] text-zinc-600">{item.hoursAgo}h ago</span>
              <span
                className={cn(
                  "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                  item.impact === "high"
                    ? "bg-red-500/15 text-red-300"
                    : item.impact === "medium"
                      ? "bg-amber-500/15 text-amber-300"
                      : "bg-zinc-500/15 text-zinc-400"
                )}
              >
                {item.impact}
              </span>
            </div>
            <h2 className="mt-3 text-sm font-semibold leading-snug text-zinc-50">
              {item.title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{item.summary}</p>
            {item.actionHint && (
              <p className="mt-3 text-xs text-emerald-400/90">{item.actionHint}</p>
            )}
            <div className="mt-3 flex gap-2">
              <Link
                href="/app/what-if"
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                Run What If →
              </Link>
              <Link
                href="/app/prepare"
                className="text-xs font-medium text-zinc-500 hover:text-zinc-300"
              >
                Prepare
              </Link>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">No items in this view yet.</p>
        )}
      </div>
    </div>
  );
}
