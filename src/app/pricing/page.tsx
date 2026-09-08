import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Pricing — TiltShield",
  description:
    "Free to measure. Pro from $15/mo for all four break points, What If?, live intel, and the 12-month tracker.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
          Pricing
        </p>
        <h1 className="mt-2 text-center text-3xl font-semibold text-zinc-50 sm:text-4xl">
          Measure free. Upgrade when you want the full plan.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
          Find your exposure first. Pro keeps the clocks live.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Free</p>
            <p className="mt-1 text-3xl font-bold">$0</p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-400">
              <li>10-question assessment</li>
              <li>Exposure score</li>
              <li>Financial break point</li>
              <li>No account required</li>
            </ul>
            <Button asChild className="mt-5 w-full" variant="outline">
              <Link href="/assessment">Find your exposure →</Link>
            </Button>
          </div>

          <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.08] p-5">
            <p className="absolute -top-2.5 right-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-zinc-950">
              Recommended
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Pro</p>
            <p className="mt-1 text-3xl font-bold">
              $15 <span className="text-sm font-medium text-zinc-500">/mo</span>
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
              <li>All four break points</li>
              <li>What If? simulator</li>
              <li>Live intel matched to gaps</li>
              <li>Vault + 12-month tracker</li>
              <li>Or $79/year</li>
            </ul>
            <Button asChild className="mt-5 w-full">
              <Link href="/assessment?plan=pro_monthly">Start Pro · $15/mo</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.06] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400">Family</p>
            <p className="mt-1 text-3xl font-bold">
              $29 <span className="text-sm font-medium text-zinc-500">/mo</span>
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
              <li>Everything in Pro</li>
              <li>Up to 6 profiles</li>
              <li>Shared emergency plan</li>
              <li>Or $99/year</li>
            </ul>
            <Button asChild className="mt-5 w-full" variant="outline">
              <Link href="/assessment?plan=family_monthly">Start Family</Link>
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/assessment?plan=lifetime" className="text-amber-300 hover:text-amber-200">
            Founding Member · $149 one-time →
          </Link>
        </p>
      </div>
    </main>
  );
}
