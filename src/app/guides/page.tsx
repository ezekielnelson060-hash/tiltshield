import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Guides — TiltShield",
  description:
    "Break points, bank outages, phone loss, income loss — practical guides that end in action.",
};

const GUIDES = [
  {
    href: "/guides/emergency-fund-breakpoint",
    title: "How much emergency savings do you actually need?",
    blurb: "Convert balance → days. Your financial break point.",
  },
  {
    href: "/guides/bank-outage",
    title: "What if your bank is unavailable for 72 hours?",
    blurb: "Cards, transfers, cash, 2FA — would you still function?",
  },
  {
    href: "/guides/phone-lost",
    title: "What happens if you lose your phone today?",
    blurb: "Your phone is an access key. Audit the single point of failure.",
  },
];

export default function GuidesIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Guides
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50">
          Measure the dependency. Then fix it.
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Not SEO filler. Each guide ends with a number or a checklist — then the full exposure
          assessment.
        </p>
        <ul className="mt-8 space-y-3">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-emerald-500/30"
              >
                <p className="text-sm font-semibold text-zinc-100">{g.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{g.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm">
          <Link href="/assessment" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Find your exposure →
          </Link>
        </p>
      </div>
    </main>
  );
}
