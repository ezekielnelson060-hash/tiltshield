"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import {
  personalizeIntel,
  type IntelScope,
  type IntelItem,
} from "@/lib/intel";
import { cn } from "@/lib/utils";
import { IconBolt } from "@/components/app/icons";
import { PageHeader } from "@/components/app/page-header";

const TABS: { id: IntelScope | "all"; label: string }[] = [
  { id: "all", label: "For you" },
  { id: "local", label: "Local" },
  { id: "global", label: "Global" },
  { id: "watchlist", label: "Watchlist" },
];

export default function IntelPage() {
  const [tab, setTab] = useState<IntelScope | "all">("all");
  const [ready, setReady] = useState(false);
  const [ctx, setCtx] = useState({
    overall: 50,
    topCategory: undefined as string | undefined,
    hasAltPayment: false,
    incomeSources: 1,
  });
  const [live, setLive] = useState<IntelItem[]>([]);
  const [liveAt, setLiveAt] = useState<string | null>(null);
  const [liveErr, setLiveErr] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (s) {
      setCtx({
        overall: s.scores.overall,
        topCategory: s.vulnerabilities[0]?.category,
        hasAltPayment: !!s.answers.alt_payment_method,
        incomeSources: s.answers.income_sources || 1,
      });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/intel/live");
        const json = await res.json();
        if (cancelled || !json?.items) return;
        const mapped: IntelItem[] = json.items.map(
          (h: {
            id: string;
            title: string;
            summary: string;
            category: string;
            impact: "low" | "medium" | "high";
            relevanceKeys?: string[];
            publishedAt?: string | null;
          }) => ({
            id: h.id,
            scope: "global" as const,
            title: h.title,
            summary: h.summary,
            impact: h.impact,
            category: h.category,
            hoursAgo: h.publishedAt
              ? Math.max(
                  0,
                  Math.round(
                    (Date.now() - new Date(h.publishedAt).getTime()) / 3600000
                  )
                )
              : 1,
            relevanceKeys: h.relevanceKeys,
            actionHint: "Open What If or Prepare for this exposure.",
          })
        );
        setLive(mapped);
        setLiveAt(json.fetchedAt || null);
      } catch {
        if (!cancelled) setLiveErr(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    if (!ready) return [];
    const curated = personalizeIntel({
      overall: ctx.overall,
      topCategory: ctx.topCategory,
      hasAltPayment: ctx.hasAltPayment,
      incomeSources: ctx.incomeSources,
    });
    const merged = [...live, ...curated];
    const seen = new Set<string>();
    const unique = merged.filter((i) => {
      const k = i.title.toLowerCase().slice(0, 48);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (tab === "all") return unique;
    if (tab === "watchlist") return unique.filter((i) => i.impact === "high");
    if (tab === "global")
      return unique.filter(
        (i) => i.scope === "global" || i.id.startsWith("live-")
      );
    return unique.filter((i) => i.scope === tab);
  }, [ready, ctx, tab, live]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Intel"
        subtitle="Live world signals plus curated resilience intel — for you, local, and global."
        backHref="/app/overview"
        showBack
      />

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

      <p className="text-[11px] text-zinc-500">
        {liveAt
          ? `Live world feed · updated ${new Date(liveAt).toLocaleTimeString()}`
          : liveErr
            ? "Live feed offline — showing curated intel"
            : "Loading live world signals…"}
      </p>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition hover:border-white/12"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <IconBolt className="h-3 w-3 text-amber-400/80" />
                {item.category}
                {item.id.startsWith("live-") && (
                  <span className="ml-1 text-emerald-500">LIVE</span>
                )}
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
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              {item.summary}
            </p>
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
          <p className="py-12 text-center text-sm text-zinc-500">
            No items in this view yet.
          </p>
        )}
      </div>
    </div>
  );
}
