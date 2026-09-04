"use client";

import { useState } from "react";
import Link from "next/link";
import { GUIDES, type Guide } from "@/lib/guides";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

export default function GuidesPage() {
  const [active, setActive] = useState<Guide | null>(null);
  const [step, setStep] = useState(0);

  if (active) {
    const paragraphs = active.body || [];
    const last = step >= paragraphs.length - 1;
    const current = paragraphs[step] || paragraphs[0] || "";

    return (
      <article className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            setActive(null);
            setStep(0);
          }}
          className="text-xs font-medium text-emerald-400"
        >
          ← All guides
        </button>

        <header className="space-y-3 border-b border-white/[0.06] pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
            Field guide · {active.horizon} · {active.minutes} min read
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            {active.title}
          </h1>
          {active.reframe && (
            <p className="text-lg leading-relaxed text-zinc-400">{active.reframe}</p>
          )}
        </header>

        <div className="space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Part {step + 1} of {paragraphs.length}
          </p>
          <p className="text-[15px] leading-[1.8] text-zinc-300">{current}</p>
        </div>

        <div className="flex gap-2 border-t border-white/[0.06] pt-4">
          <Button
            variant="outline"
            className="flex-1"
            disabled={step === 0}
            onClick={() => setStep((x) => Math.max(0, x - 1))}
          >
            Previous
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (last) {
                setActive(null);
                setStep(0);
              } else {
                setStep((x) => x + 1);
              }
            }}
          >
            {last ? "Done" : "Continue reading"}
          </Button>
        </div>

        {last && (active.placeLinks?.length ?? 0) > 0 && (
          <div className="space-y-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400/90">
              Put it into action
            </p>
            {(active.placeLinks || []).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-sm font-medium text-zinc-100 underline-offset-4 hover:underline"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Guides"
        subtitle="Clear field notes — read like a post, act when you are ready."
        backHref="/app/more"
        showBack
      />

      <div className="space-y-4">
        {GUIDES.map((g) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => {
              setActive(g);
              setStep(0);
            }}
            className="w-full rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-5 text-left transition hover:border-emerald-500/30"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400/80">
              {g.horizon} · {g.minutes} min
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50">
              {g.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {g.reframe || g.blurb}
            </p>
            <p className="mt-4 text-xs font-semibold text-emerald-400">Read guide →</p>
          </button>
        ))}
      </div>
    </div>
  );
}
