"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { personalizeIntel, type IntelScope, type IntelItem } from "@/lib/intel";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";

const TABS: { id: IntelScope | "all"; label: string }[] = [
  { id: "all", label: "For you" },
  { id: "local", label: "Local" },
  { id: "global", label: "Global" },
  { id: "watchlist", label: "Watchlist" },
];

function cleanText(s: string): string {
  return (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export default function IntelPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [topCat, setTopCat] = useState<string | undefined>();
  const [overall, setOverall] = useState(50);
  const [incomeSources, setIncomeSources] = useState(1);
  const [altPay, setAltPay] = useState(true);
  const [live, setLive] = useState<(IntelItem & { url?: string })[]>([]);
  const [liveAt, setLiveAt] = useState<string | null>(null);
  const [liveErr, setLiveErr] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (s) {
      setOverall(s.scores.overall);
      setTopCat(s.vulnerabilities[0]?.category);
      setIncomeSources(s.answers.income_sources || 1);
      setAltPay(!!s.answers.alt_payment_method);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/intel/live");
        const json = await res.json();
        if (cancelled || !json?.items) return;
        const mapped = json.items.map(
          (h: {
            id: string;
            title: string;
            summary: string;
            category: string;
            impact: "low" | "medium" | "high";
            relevanceKeys?: string[];
            publishedAt?: string | null;
            url?: string;
          }) => ({
            id: h.id,
            scope: "global" as const,
            title: cleanText(h.title),
            summary: cleanText(h.summary).slice(0, 220),
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
            actionHint: "See how this touches your plan — then act.",
            url: h.url && h.url.startsWith("http") ? h.url : undefined,
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
    const personalized = personalizeIntel({
      overall,
      topCategory: topCat,
      hasAltPayment: altPay,
      incomeSources,
    });
    const merged = [...live, ...personalized];
    const seen = new Set<string>();
    const unique = merged.filter((i) => {
      const k = i.title.toLowerCase().slice(0, 48);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (tab === "all") return unique;
    if (tab === "watchlist") {
      return unique.filter((i) => i.impact === "high");
    }
    return unique.filter(
      (i) => i.scope === tab || (tab === "global" && i.id.startsWith("live-"))
    );
  }, [tab, overall, topCat, altPay, incomeSources, live]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Intel"
        subtitle="Signals from the world, ranked against your readiness — not noise."
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
          ? `Live feed · updated ${new Date(liveAt).toLocaleTimeString()}`
          : liveErr
            ? "Live feed offline — showing curated intel"
            : "Loading live signals…"}
      </p>

      <div className="space-y-3">
        {items.map((item) => {
          const url = (item as { url?: string }).url;
          return (
            <article
              key={item.id}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {item.category}
                </span>
                {item.id.startsWith("live-") && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                    Live
                  </span>
                )}
                <span className="text-[10px] text-zinc-600">
                  {item.hoursAgo}h ago
                </span>
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
              {item.summary && (
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  {item.summary}
                </p>
              )}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-emerald-500/30 hover:text-emerald-300"
                >
                  <span>Read the full story</span>
                  <span className="text-emerald-400">↗</span>
                </a>
              )}
              {item.actionHint && (
                <p className="mt-3 text-xs text-emerald-400/90">{item.actionHint}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/app/what-if"
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Run What If →
                </Link>
                <Link
                  href="/app/prepare"
                  className="text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Prepare
                </Link>
              </div>
            </article>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-zinc-500">No items in this filter yet.</p>
        )}
      </div>
    </div>
  );
}
