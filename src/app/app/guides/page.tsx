"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { PageHeader } from "@/components/app/page-header";
import { cn } from "@/lib/utils";

/** Reframe-deck style guide browser. */
export default function GuidesPage() {
  const [i, setI] = useState(0);
  const g = GUIDES[i];
  const n = GUIDES.length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Guides"
        subtitle="A deck for the version of you that needs the next clear step — not a lecture."
        backHref="/app/more"
        showBack
      />

      <div className="relative mx-auto max-w-sm">
        <div className="absolute inset-x-4 top-3 h-full rounded-[1.75rem] border border-white/[0.04] bg-white/[0.02]" />
        <div className="absolute inset-x-2 top-1.5 h-full rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03]" />

        <article className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-gradient-to-b from-[#152032] to-[#0a1018] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]">
          <div className="border-b border-white/[0.06] px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
              Reframe · {i + 1}/{n}
            </p>
          </div>
          <div className="space-y-4 px-5 py-6">
            <h2 className="text-xl font-semibold leading-snug text-zinc-50">
              {g.title}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300">{g.reframe}</p>
            <p className="text-xs text-zinc-500">{g.blurb}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {g.horizon}
              </span>
              <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] text-zinc-500">
                {g.minutes} min
              </span>
            </div>
            <Link
              href={`/app/guides/${g.slug}`}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Open this card →
            </Link>
          </div>
        </article>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={i === 0}
            onClick={() => setI((x) => Math.max(0, x - 1))}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 disabled:opacity-30"
          >
            ← Prev
          </button>
          <div className="flex gap-1.5">
            {GUIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Card ${idx + 1}`}
                onClick={() => setI(idx)}
                className={cn(
                  "h-1.5 rounded-full transition",
                  idx === i ? "w-4 bg-emerald-400" : "w-1.5 bg-zinc-600"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={i >= n - 1}
            onClick={() => setI((x) => Math.min(n - 1, x + 1))}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-600">
        Each card ends in places and tools — Finder, Vault, Prepare — not theory only.
      </p>
    </div>
  );
}
