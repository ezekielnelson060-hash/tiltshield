import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Guides — Personal Exposure & Break Points | TiltShield",
  description:
    "Authoritative guides on emergency funds, bank outages, income loss, phone loss, and food prices — measured as exposure and break points.",
};

const GUIDES = [
  {
    href: "/guides/emergency-fund-breakpoint",
    title: "How long could your emergency fund actually last?",
    blurb: "Break point — savings measured in time, not dollars.",
    concept: "Break Point",
  },
  {
    href: "/guides/bank-outage",
    title: "What happens if your bank goes down for 72 hours?",
    blurb: "Financial exposure — money vs access vs alternatives.",
    concept: "Financial exposure",
  },
  {
    href: "/guides/income-loss",
    title: "What happens if you lose your income tomorrow?",
    blurb: "Income dependency — runway when the salary stops.",
    concept: "Income concentration",
  },
  {
    href: "/guides/phone-lost",
    title: "What happens if you lose your phone?",
    blurb: "Digital exposure — one device as a single point of failure.",
    concept: "Digital dependency",
  },
  {
    href: "/guides/food-price-increase",
    title: "What happens when food prices rise?",
    blurb: "Household exposure — flexibility when costs move against you.",
    concept: "Household exposure",
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
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Don&apos;t scare people. Don&apos;t reassure people. Measure the dependency. Each guide
          ends in a number or a checklist — then the full{" "}
          <Link href="/assessment" className="text-emerald-400 hover:text-emerald-300">
            exposure assessment
          </Link>
          .
        </p>
        <ul className="mt-8 space-y-3">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-emerald-500/30"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-500/80">
                  {g.concept}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{g.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{g.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-zinc-500">
          Flagship concept:{" "}
          <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
            What is a break point?
          </Link>
        </p>
      </div>
    </main>
  );
}
