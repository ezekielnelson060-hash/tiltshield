"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { personalizeIntel, type IntelItem } from "@/lib/intel";
import { meaningForIntel } from "@/lib/intel-meaning";
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

/** Strip tags and junk so RSS never leaks raw HTML or href strings. */
function cleanText(s: string): string {
  if (!s) return "";
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const m = raw.match(/https?:\/\/[^\s"'<>]+/i);
  if (m && m[0].startsWith("http")) return m[0];
  if (raw.startsWith("http")) return raw.split(/\s/)[0];
  return undefined;
}

export default function IntelPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [topCat, setTopCat] = useState<string | undefined>();
  const [overall, setOverall] = useState(50);
  const [incomeSources, setIncomeSources] = useState(1);
  const [altPay, setAltPay] = useState(true);
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [scores, setScores] = useState<CategoryScores | null>(null);
  const [live, setLive] = useState<(IntelItem & { url?: string })[]>([]);
  const [liveAt, setLiveAt] = useState<string | null>(null);
  const [liveErr, setLiveErr] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (s) {
      setOverall(s.scores.overall);
      setTopCat(s.vulnerabilities?.[0]?.category);
      setIncomeSources(s.answers.income_sources || 1);
      setAltPay(!!s.answers.alt_payment_method);
      setAnswers(s.answers);
      setScores(s.scores);
    }

    void (async () => {
      try {
        const res = await fetch("/api/intel/live");
        const data = await res.json();
        const headlines = (data.headlines || []) as Array<{
          title?: string;
          summary?: string;
          category?: string;
          impact?: string;
          hoursAgo?: number;
          url?: string;
          link?: string;
        }>;
        setLive(
          headlines.map((h, i) => ({
            id: `live-${i}`,
            title: cleanText(h.title || "Update"),
            summary: cleanText(h.summary || "").slice(0, 220),
            category: (h.category || "world") as IntelItem["category"],
            impact: (h.impact || "medium") as IntelItem["impact"],
            hoursAgo: h.hoursAgo ?? 0,
            url: extractUrl(h.url || h.link),
          }))
        );
        setLiveAt(data.fetchedAt || new Date().toISOString());
      } catch {
        setLiveErr(true);
      }
    })();
  }, []);

  const baseline = personalizeIntel({
    overall,
    topCategory: topCat,
    hasAltPayment: altPay,
    incomeSources,
  });

  const merged = [...live, ...baseline];
  const filtered =
    tab === "all"
      ? merged
      : merged.filter((i) => i.category.toLowerCase().includes(tab));

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <PageHeader
        title="Intel"
        subtitle="World signals ranked against your readiness. Read what it means for you, then act."
        backHref="/app/overview"
        showBack
      />

      <p className="text-xs text-zinc-500">
        What you should do here: open one story, read "what this means for you",
        then run What If or open Prepare.
      </p>

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

      {liveErr && (
        <p className="text-xs text-amber-400/90">
          Live feed is slow. Baseline signals still show below.
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((item) => {
          const url = (item as { url?: string }).url;
          const meaning =
            answers && scores
              ? meaningForIntel(item, answers, scores)
              : null;
          return (
            <GlassCard key={item.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  {item.category}
                </span>
                {item.id.startsWith("live-") && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    LIVE
                  </span>
                )}
                <span className="text-[10px] text-zinc-600">
                  {item.hoursAgo}h ago
                </span>
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
              {item.summary && (
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                  {item.summary}
                </p>
              )}
              {url && (
                <a
                  href={url}
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
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
