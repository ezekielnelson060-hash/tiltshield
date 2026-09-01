"use client";

import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { AppTopBar } from "@/components/app/page-header";

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <AppTopBar title="Guides" backHref="/app/more" />
        <p className="mt-1 text-sm text-zinc-500">
          Practical preparation — written for you to do, not to scroll past.
        </p>
      </div>
      <ul className="space-y-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/app/guides/${g.slug}`}
              className="block rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition hover:border-emerald-500/25"
            >
              <p className="text-sm font-medium text-zinc-100">{g.title}</p>
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
