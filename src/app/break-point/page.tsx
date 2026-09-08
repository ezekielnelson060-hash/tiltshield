import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Break Point — Know How Long You Can Function | TiltShield",
  description:
    "A break point is the amount of time, access, or flexibility you have before a disruption materially changes your ability to function.",
};

export default function BreakPointPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Core concept
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What is a break point?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">
          A break point is the amount of time, access, or flexibility you have before a disruption
          materially changes your ability to function.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Your savings aren&apos;t $20,000. They&apos;re a number of days. Your phone isn&apos;t
          just a device — it can be the single key to banking, identity, and communication. Your
          bank balance isn&apos;t the same as usable access when the app is down.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Four clocks that matter</h2>
        <div className="mt-4 space-y-3">
          {[
            ["Financial", "Days of essential spend if primary income stops.", "/guides/emergency-fund-breakpoint"],
            ["Digital", "How long critical accounts stay reachable without your primary device.", "/guides/phone-lost"],
            ["Payment", "Hours or days if your primary bank or rail fails.", "/guides/bank-outage"],
            ["Food / household", "Room in the budget when prices or supply shift.", "/guides/food-price-increase"],
          ].map(([t, d, href]) => (
            <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-sm font-semibold text-zinc-100">{t}</p>
              <p className="mt-1 text-sm text-zinc-500">{d}</p>
              <Link href={href} className="mt-2 inline-block text-xs font-medium text-emerald-400">
                Read the guide →
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-base leading-relaxed text-zinc-400">
          Don&apos;t scare people. Don&apos;t reassure people. Measure the dependency. Then fix
          the shortest clock first.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/assessment">Find your exposure →</Link>
        </Button>
      </article>
    </main>
  );
}
