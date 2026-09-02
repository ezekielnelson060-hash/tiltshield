"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getGuide, GUIDES } from "@/lib/guides";
import { AppTopBar } from "@/components/app/page-header";
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
      <AppTopBar title="Guide" backHref="/app/guides" />
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
          {guide.horizon} horizon
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          {guide.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{guide.blurb}</p>
        <p className="mt-1 text-[11px] text-zinc-600">
          {guide.minutes} min · do in order
        </p>
      </header>

      <ol className="space-y-3">
        {guide.body.map((step, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-zinc-300">{step}</p>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href="/app/prepare">Open 1-year stock</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/app/guides">All guides</Link>
        </Button>
      </div>

      <section className="space-y-2 border-t border-white/[0.06] pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Continue
        </p>
        {GUIDES.filter((g) => g.slug !== guide.slug)
          .slice(0, 3)
          .map((g) => (
            <Link
              key={g.slug}
              href={`/app/guides/${g.slug}`}
              className="block rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-zinc-300 hover:border-emerald-500/25"
            >
              {g.title}
            </Link>
          ))}
      </section>
    </div>
  );
}
