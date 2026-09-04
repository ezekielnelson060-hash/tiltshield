"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { meaningForYou } from "@/lib/intel-meaning";
import type { AssessmentAnswers, CategoryScores } from "@/types";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All" },
  { id: "money", label: "Money" },
  { id: "food", label: "Food" },
  { id: "health", label: "Health" },
  { id: "digital", label: "Digital" },
  { id: "energy", label: "Energy" },
] as const;

type Card = {
  id: string;
  title: string;
  summary: string;
  category: string;
  impact: string;
  hoursAgo: number;
  url?: string;
};

const FALLBACK: Card[] = [
  {
    id: "fb-1",
    title: "Payment rails and cash access stay a core watch item",
    summary:
      "When digital payments stall, households with tested cash and local vendors absorb less shock.",
    category: "Financial",
    impact: "high",
    hoursAgo: 6,
  },
  {
    id: "fb-2",
    title: "Food price pressure keeps home buffers relevant",
    summary:
      "A simple multi-week food stock reduces exposure when shelves or prices move fast.",
    category: "Essentials",
    impact: "medium",
    hoursAgo: 12,
  },
  {
    id: "fb-3",
    title: "Grid and outage stories still drive backup-power checks",
    summary:
      "Phone charge, cold storage, and lighting plans matter more than headline panic.",
    category: "Energy",
    impact: "medium",
    hoursAgo: 18,
  },
];

function cleanText(s: string): string {
  if (!s) return "";
  let t = String(s);
  t = t.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, " ");
  t = t.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ");
  t = t.replace(/<a\b[^>]*/gi, " ");
  t = t.replace(/<\/?[a-zA-Z][^>]*>/g, " ");
  t = t.replace(/<[^>]*/g, " ");
  t = t.replace(/&nbsp;/gi, " ");
  t = t.replace(/&amp;/g, "&");
  t = t.replace(/&lt;/g, "<");
  t = t.replace(/&gt;/g, ">");
  t = t.replace(/&quot;/g, '"');
  t = t.replace(/&#39;/g, "'");
  t = t.replace(/&#\d+;/g, " ");
  t = t.replace(/https?:\/\/\S+/gi, " ");
  t = t.replace(/\bhref\s*=\s*["'][^"']*/gi, " ");
  t = t.replace(/\bhref\s*=/gi, " ");
  t = t.replace(/["']?\s*>/g, " ");
  t = t.replace(/[<>"']/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  if (!t || t.length < 12) return "";
  if (/href|javascript:|<\/?[a-z]/i.test(t)) return "";
  if (/^[=/\s]*$/.test(t)) return "";
  return t;
}

export default function IntelPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [scores, setScores] = useState<CategoryScores | null>(null);
  const [cards, setCards] = useState<Card[]>(FALLBACK);
  const [liveAt, setLiveAt] = useState<string | null>(null);
  const [liveOk, setLiveOk] = useState(false);

  useEffect(() => {
    try {
      const s = loadSession();
      if (s) {
        setAnswers(s.answers);
        setScores(s.scores);
      }
    } catch {
      /* */
    }

    void (async () => {
      try {
        const res = await fetch("/api/intel/live");
        if (!res.ok) return;
        const data = await res.json();
        const raw = (data.items || data.headlines || []) as Array<{
          id?: string;
          title?: string;
          summary?: string;
          category?: string;
          impact?: string;
          url?: string;
          link?: string;
        }>;
        if (!raw.length) return;
        const mapped: Card[] = raw.slice(0, 20).map((h, i) => ({
          id: h.id || `live-${i}`,
          title: cleanText(String(h.title || "Update")).slice(0, 140),
          summary: cleanText(String(h.summary || "")).slice(0, 220),
          category: String(h.category || "Watch"),
          impact: String(h.impact || "medium"),
          hoursAgo: 3 + i,
          url:
            (h.url && h.url.startsWith("http") && h.url) ||
            (h.link && h.link.startsWith("http") && h.link) ||
            undefined,
        }));
        setCards(mapped);
        setLiveOk(true);
        setLiveAt(data.fetchedAt || new Date().toISOString());
      } catch {
        /* keep fallback */
      }
    })();
  }, []);

  const filtered =
    tab === "all"
      ? cards
      : cards.filter((c) => {
          const cat = c.category.toLowerCase();
          if (tab === "money") return /financ|bank|payment|money/.test(cat + c.title.toLowerCase());
          if (tab === "food") return /essential|food|grocery/.test(cat + c.title.toLowerCase());
          if (tab === "health") return /health|pharma|medic/.test(cat + c.title.toLowerCase());
          if (tab === "digital") return /digital|cyber|tech/.test(cat + c.title.toLowerCase());
          if (tab === "energy") return /energy|grid|power|outage/.test(cat + c.title.toLowerCase());
          return true;
        });

  const show = filtered.length ? filtered : cards;

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <PageHeader
        title="Intel"
        subtitle="World signals translated into what it means for your plan."
        backHref="/app/overview"
        showBack
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              tab === t.id
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/10 bg-white/[0.04] text-zinc-400"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-zinc-600">
        {liveOk
          ? `Live feed · updated ${liveAt ? new Date(liveAt).toLocaleString() : "recently"}`
          : "Baseline watch list · live feed connects when available"}
      </p>

      <div className="space-y-3">
        {show.map((item) => {
          let meaning: string | null = null;
          try {
            meaning = meaningForYou(
              { category: item.category, title: item.title, impact: item.impact },
              answers,
              scores
            );
          } catch {
            meaning = null;
          }

          return (
            <GlassCard key={item.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  {item.category}
                </span>
                {item.id.startsWith("live-") && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    LIVE
                  </span>
                )}
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                    item.impact === "high"
                      ? "bg-red-500/15 text-red-400"
                      : item.impact === "medium"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-white/5 text-zinc-500"
                  )}
                >
                  {item.impact}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-snug text-zinc-50">
                {item.title}
              </p>
              {item.summary &&
                item.summary.length > 12 &&
                !/href|<|>/i.test(item.summary) && (
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {item.summary}
                </p>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-200"
                >
                  Read the full story
                  <span className="text-emerald-400">↗</span>
                </a>
              )}
              {meaning && (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-400/90">
                    What this means for you
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                    {meaning}
                  </p>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-emerald-400">
                <Link href="/app/what-if">Run What If →</Link>
                <Link href="/app/prepare">Prepare</Link>
                <Link href="/app/nearby">Nearby</Link>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
