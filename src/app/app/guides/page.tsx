"use client";

import Link from "next/link";
import { GUIDES } from "@/lib/guides";

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Guides</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Practical preparation — written for you to do, not to scroll past.
        </p>
      </div>
      <ul className="space-y-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/app/guides/${g.slug}`}
              className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 transition hover:border-zinc-600"
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
