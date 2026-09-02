"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

export default function GuideDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-zinc-400">Guide not found.</p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/app/guides">All guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title={guide.title}
        subtitle={`${guide.horizon} · ${guide.minutes} min`}
        backHref="/app/guides"
        showBack
      />

      <div className="rounded-[1.75rem] border border-white/[0.1] bg-gradient-to-b from-[#152032] to-[#0a1018] px-5 py-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
          Reframe
        </p>
        <p className="mt-3 text-base font-medium leading-relaxed text-zinc-100">
          {guide.reframe}
        </p>
      </div>

      <p className="text-sm text-zinc-500">{guide.blurb}</p>

      <ol className="space-y-3">
        {guide.body.map((step, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-4"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
              {i + 1}
            </span>
            <p className="text-sm text-zinc-300">{step}</p>
          </li>
        ))}
      </ol>

      {guide.placeLinks && guide.placeLinks.length > 0 && (
        <section className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Know a place · take action
          </p>
          <div className="flex flex-wrap gap-2">
            {guide.placeLinks.map((l) => (
              <Button key={l.href} asChild size="sm" variant="outline">
                <Link href={l.href}>{l.label}</Link>
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
