"use client";

/**
 * X-style top intel banner: slides in when new items land in any category.
 * Tracks seen IDs in localStorage so the same alert doesn't spam.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type LiveItem = {
  id: string;
  title: string;
  summary?: string;
  category?: string;
  impact?: string;
};

const SEEN_KEY = "tiltshield_intel_seen_ids";
const LAST_POLL = "tiltshield_intel_last_poll";
const POLL_MS = 90_000;
const MAX_SEEN = 80;

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSeen(set: Set<string>) {
  try {
    const arr = Array.from(set).slice(-MAX_SEEN);
    localStorage.setItem(SEEN_KEY, JSON.stringify(arr));
  } catch {
    /* */
  }
}

function cleanTitle(s: string): string {
  return String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export function IntelTopBanner() {
  const router = useRouter();
  const [queue, setQueue] = useState<LiveItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<LiveItem | null>(null);

  const showNext = useCallback((items: LiveItem[]) => {
    if (!items.length) return;
    setQueue((q) => {
      const ids = new Set(q.map((x) => x.id));
      const merged = [...q];
      for (const it of items) {
        if (!ids.has(it.id)) {
          merged.push(it);
          ids.add(it.id);
        }
      }
      return merged.slice(0, 5);
    });
  }, []);

  useEffect(() => {
    if (current || !queue.length) return;
    const [head, ...rest] = queue;
    setCurrent(head);
    setQueue(rest);
    requestAnimationFrame(() => setVisible(true));
  }, [queue, current]);

  const dismiss = useCallback(() => {
    setVisible(false);
    const id = current?.id;
    if (id) {
      const seen = loadSeen();
      seen.add(id);
      saveSeen(seen);
    }
    setTimeout(() => setCurrent(null), 280);
  }, [current]);

  const openIntel = useCallback(() => {
    dismiss();
    router.push("/app/intel");
  }, [dismiss, router]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function poll(isFirst: boolean) {
      try {
        const res = await fetch("/api/intel/live", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const raw = (data.items || data.headlines || []) as Array<{
          id?: string;
          title?: string;
          summary?: string;
          category?: string;
          impact?: string;
        }>;
        if (!raw.length) return;

        const seen = loadSeen();
        const fresh: LiveItem[] = [];

        for (const h of raw.slice(0, 12)) {
          const id = String(h.id || h.title || "").slice(0, 120);
          if (!id || seen.has(id)) continue;
          const title = cleanTitle(String(h.title || ""));
          if (!title || title.length < 8) continue;
          fresh.push({
            id,
            title,
            summary: cleanTitle(String(h.summary || "")).slice(0, 160),
            category: String(h.category || "Watch"),
            impact: String(h.impact || "medium"),
          });
        }

        // First visit: seed seen so the whole feed doesn't dump as banners
        if (isFirst && fresh.length) {
          for (const f of fresh) seen.add(f.id);
          saveSeen(seen);
          try {
            localStorage.setItem(LAST_POLL, String(Date.now()));
          } catch {
            /* */
          }
          return;
        }

        if (fresh.length) {
          showNext(fresh.slice(0, 3).reverse());
        }
        try {
          localStorage.setItem(LAST_POLL, String(Date.now()));
        } catch {
          /* */
        }
      } catch {
        /* network */
      }
    }

    void poll(true);
    timer = setInterval(() => void poll(false), POLL_MS);

    function onVis() {
      if (document.visibilityState === "visible") void poll(false);
    }
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [showNext]);

  useEffect(() => {
    if (!current || !visible) return;
    const t = setTimeout(dismiss, 8000);
    return () => clearTimeout(t);
  }, [current, visible, dismiss]);

  if (!current) return null;

  const impactColor =
    current.impact === "high"
      ? "text-red-400"
      : current.impact === "low"
        ? "text-zinc-400"
        : "text-amber-400";

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
        "transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={openIntel}
        className={cn(
          "pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-emerald-500/30",
          "bg-[#0c121c]/95 px-3.5 py-3 text-left shadow-2xl shadow-black/50 backdrop-blur-xl",
          "ring-1 ring-white/5 active:scale-[0.99]"
        )}
      >
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
              New intel
            </span>
            <span className={cn("text-[10px] font-medium uppercase tracking-wide", impactColor)}>
              {current.category}
            </span>
          </span>
          <span className="mt-0.5 block text-sm font-semibold leading-snug text-zinc-50">
            {current.title}
          </span>
          {current.summary ? (
            <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-zinc-400">
              {current.summary}
            </span>
          ) : null}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              dismiss();
            }
          }}
          className="pointer-events-auto -mr-1 -mt-1 rounded-full p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      </button>
    </div>
  );
}
