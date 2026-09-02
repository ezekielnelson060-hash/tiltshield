"use client";

import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { AppTopBar } from "@/components/app/page-header";

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <AppTopBar title="Guides" backHref="/app/more" />
      <p className="-mt-2 text-sm text-zinc-500">
        Practical steps toward{" "}
        <span className="text-zinc-300">~1 year of household resilience</span> —
        layered, not panic. Do them; do not only scroll.
      </p>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-zinc-400">
        Pair with <span className="text-emerald-400">Prepare → 1-year stock</span>{" "}
        and your assessment numbers. Guides explain how; the checklist tracks what
        you locked in.
      </div>

      <ul className="space-y-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/app/guides/${g.slug}`}
              className="block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition hover:border-emerald-500/25"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-zinc-100">{g.title}</p>
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  {g.horizon}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{g.blurb}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-600">
                {g.minutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
