import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Bank Outage 72 Hours — TiltShield",
  description:
    "What happens if your bank is unavailable for 72 hours? Cards, transfers, cash, 2FA.",
};

const CHECKS = [
  "Physical cards that still work offline at POS",
  "Cash for 3–7 days of essentials",
  "A second bank or payment rail already funded",
  "Direct deposit routing you can change without branch visit",
  "2FA that is not only SMS to one phone on one SIM",
];

export default function BankOutageGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Banking · What If?
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What happens if your bank is unavailable for 72 hours?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Cards fail. Transfers queue. Apps time out. Direct deposits sit. Authentication becomes
          the bottleneck. The question is not whether outages happen — it is whether you still
          function.
        </p>

        <p className="mt-8 text-sm font-semibold text-zinc-200">Could you still operate?</p>
        <ul className="mt-3 space-y-2">
          {CHECKS.map((c) => (
            <li
              key={c}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-300"
            >
              {c}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-zinc-400">
          If more than two items are uncertain, your payment break point may be measured in hours —
          not days.
        </p>

        <Button asChild size="lg" className="mt-6">
          <Link href="/assessment">Test yourself →</Link>
        </Button>
      </article>
    </main>
  );
}
