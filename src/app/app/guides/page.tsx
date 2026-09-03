"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDES, type Guide } from "@/lib/guides";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";

export default function GuidesPage() {
  const [active, setActive] = useState<Guide | null>(null);
  const [section, setSection] = useState(0);

  if (active) {
    const s = active.sections[section];
    const last = section >= active.sections.length - 1;
    return (
      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            setActive(null);
            setSection(0);
          }}
          className="text-xs font-medium text-emerald-400"
        >
          ← All guides
        </button>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Course · {section + 1} of {active.sections.length} · {active.minutes} min
        </p>
        <h1 className="text-2xl font-semibold text-zinc-50">{active.title}</h1>
        <p className="text-sm text-emerald-300/90">{active.reframe}</p>

        <GlassCard>
          <h2 className="text-lg font-semibold text-zinc-50">{s.heading}</h2>
          <div className="mt-3 space-y-3">
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-zinc-300">
                {p}
              </p>
            ))}
          </div>
        </GlassCard>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={section === 0}
            onClick={() => setSection((x) => Math.max(0, x - 1))}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (last) {
                setActive(null);
                setSection(0);
              } else {
                setSection((x) => x + 1);
              }
            }}
          >
            {last ? "Finish" : "Next"}
          </Button>
        </div>

        {last && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Put it into action</p>
            {active.placeLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-xl border border-white/10 px-4 py-3 text-sm text-emerald-400"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <PageHeader
        title="Guides"
        subtitle="Short courses. Read a section, do the week actions, then open the map or checklist."
        backHref="/app/more"
        showBack
      />
      <p className="text-xs text-zinc-500">
        What you should do: pick one guide, finish every section, then use the
        action links at the end.
      </p>
      <div className="space-y-2">
        {GUIDES.map((g) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => {
              setActive(g);
              setSection(0);
            }}
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-left transition hover:border-emerald-500/25"
          >
            <p className="text-sm font-medium text-zinc-100">{g.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{g.blurb}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-zinc-600">
              {g.horizon} · {g.minutes} min · {g.sections.length} sections
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
