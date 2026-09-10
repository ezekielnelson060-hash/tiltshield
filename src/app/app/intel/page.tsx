"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium } from "@/lib/session";
import { meaningForYou } from "@/lib/intel-meaning";
import type { AssessmentAnswers, CategoryScores } from "@/types";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";
import { UpgradeGate } from "@/components/app/upgrade-gate";

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
  t = t
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/"/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#\d+;/g, " ");
  t = t.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  t = t.replace(/<script[\s\S]*?<\/script>/gi, " ");
  t = t.replace(/<style[\s\S]*?<\/style>/gi, " ");
  t = t.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ");
  t = t.replace(/<\/?[a-zA-Z][^>]*>/g, " ");
  t = t.replace(/<[^>]*/g, " ");
  t = t.replace(
    /\b(href|target|rel|class|style|color|font|src|id|onclick)\s*=\s*("[^"]*"|'[^']*'|\S*)/gi,
    " "
  );
  t = t.replace(/\/(a|font|span|div|p|b|i|em|strong|br)\b/gi, " ");
  t = t.replace(/https?:\/\/\S+/gi, " ");
  t = t.replace(/[<>"`]/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  if (!t || t.length < 12) return "";
  if (/\b(href|font|target|class)\s*=/i.test(t)) return "";
  if (/\/(a|font)\b/i.test(t)) return "";
  return t;
}

function gapRank(item: Card, scores: CategoryScores | null): number {
  if (!scores) return 50;
  const blob = ((item.category || "") + " " + (item.title || "")).toLowerCase();
  let score = 50;
  if (/financial|bank|payment|cash|currency|money/.test(blob))
    score = scores.money ?? 50;
  else if (/food|grocery|essential|supply|price/.test(blob))
    score = scores.food ?? 50;
  else if (/health|pharma|medicine|medical/.test(blob))
    score = scores.skills ?? 50;
  else if (/digital|phone|cyber|outage|internet|auth/.test(blob))
    score = scores.digital ?? 50;
  else if (/energy|grid|power|blackout/.test(blob)) score = scores.home ?? 50;
  const impactBoost =
    item.impact === "high" ? -8 : item.impact === "medium" ? -3 : 0;
  return score + impactBoost;
}

export default function IntelPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [scores, setScores] = useState<CategoryScores | null>(null);
  const [premium, setPremium] = useState(false);
  const [cards, setCards] = useState<Card[]>(FALLBACK);
  const [liveAt, setLiveAt] = useState<string | null>(null);
  const [liveOk, setLiveOk] = useState(false);

  useEffect(() => {
    try {
      const s = loadSession();
      setPremium(isPremium());
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
        const mapped: Card[] = raw.slice(0, 20).map((h, i) => {
          const title =
            cleanText(String(h.title || "")) ||
            String(h.title || "Update")
              .replace(/<[^>]*>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 140) ||
            "Update";
          const summary = cleanText(String(h.summary || ""));
          const url =
            (h.url && h.url.startsWith("http") && h.url) ||
            (h.link && h.link.startsWith("http") && h.link) ||
            undefined;
          return {
            id: h.id || `live-${i}`,
            title: title.slice(0, 140),
            summary,
            category: String(h.category || "Watch"),
            impact: String(h.impact || "medium"),
            hoursAgo: 3 + i,
            url,
          };
        });
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
          const blob = c.category.toLowerCase() + c.title.toLowerCase();
          if (tab === "money") return /financ|bank|payment|money/.test(blob);
          if (tab === "food") return /essential|food|grocery/.test(blob);
          if (tab === "health") return /health|pharma|medic/.test(blob);
          if (tab === "digital") return /digital|cyber|tech|phone/.test(blob);
          if (tab === "energy") return /energy|grid|power|outage/.test(blob);
          return true;
        });

  const ranked = [...(filtered.length ? filtered : cards)].sort(
    (a, b) => gapRank(a, scores) - gapRank(b, scores)
  );
  const show = premium ? ranked : ranked.slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:max-w-none lg:px-8 lg:py-8">
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

      <p className="text-[11px] text-zinc-500">
        {premium
          ? "Sorted by your weakest areas first."
          : "Top 3 items matched to your gaps. Full board is Pro."}
      </p>
      <p className="text-xs text-zinc-600">
        {liveOk
          ? `Live feed · updated ${liveAt ? new Date(liveAt).toLocaleString() : "recently"}`
          : "Baseline watch list · live feed connects when available"}
      </p>

      <div className="space-y-3">
        {show.map((item) => {
          let meaning: string | null = null;
          try {
            meaning = meaningForYou(
              {
                category: item.category,
                title: item.title,
                impact: item.impact,
              },
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

              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-sm font-semibold leading-snug text-zinc-50 hover:text-emerald-300"
                >
                  {item.title}
                </a>
              ) : (
                <p className="mt-3 text-sm font-semibold leading-snug text-zinc-50">
                  {item.title}
                </p>
              )}

              {item.summary ? (
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {item.summary}
                </p>
              ) : null}

              {meaning ? (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-400/90">
                    What this means for you
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                    {meaning}
                  </p>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-emerald-400">
                <Link href="/app/what-if">Run What If →</Link>
                <Link href="/app/prepare">Prepare</Link>
                <Link href="/app/nearby">Nearby</Link>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {!premium && (
        <UpgradeGate
          title="See every category and the full intel board"
          body="Free shows the top 3 matched to your gaps. Pro unlocks Money, Food, Health, Digital, Energy — full board."
        />
      )}
    </div>
  );
}
