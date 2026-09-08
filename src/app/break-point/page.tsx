import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Break Point — TiltShield",
  description:
    "Your savings aren't a balance. They're a number of days. Find your financial, digital, payment, and food break points.",
};

export default function BreakPointPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Break point
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Your savings aren&apos;t $20,000.
          <span className="mt-2 block text-emerald-300">They&apos;re a number of days.</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          A break point is how long you can function if a dependency fails and nothing else changes.
          Income stops. Phone is gone. Bank is offline. Food shelves thin out.
        </p>

        <div className="mt-8 space-y-3">
          {[
            ["Financial", "Days of essential spend if primary income stops."],
            ["Digital", "How long critical accounts stay reachable offline or via backup."],
            ["Payment", "Hours or days if your primary payment rail fails."],
            ["Food", "Days of food you already eat, without a supply run."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-sm font-semibold text-zinc-100">{t}</p>
              <p className="mt-1 text-sm text-zinc-500">{d}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-zinc-400">
          Most people have never measured any of these. They have assumptions. Assumptions are not
          a plan.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/assessment">Find your exposure →</Link>
        </Button>
      </article>
    </main>
  );
}
