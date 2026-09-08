import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "What Happens If Your Bank Goes Down for 72 Hours? | TiltShield",
  description:
    "A bank outage doesn't have to mean your money disappears. Here's how to think about access, payments and financial resilience when your primary bank becomes unavailable.",
};

export default function BankOutageGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Guide · Financial exposure
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What Happens If Your Bank Goes Down for 72 Hours?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Your money can still exist while becoming temporarily difficult to use. That's an
          important distinction.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Modern financial life depends heavily on systems you rarely think about: banking apps,
          payment networks, cards, internet access, authentication systems, mobile phones, ATMs,
          identity verification. Most of the time these work so well that we stop noticing them.
          That's exactly what makes the dependency easy to overlook.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Imagine your primary bank becomes unavailable
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Not necessarily because the bank has failed. Something simpler: you open the app. It
          doesn't work. You try again. Still nothing. Your card payment fails. You can't
          transfer money. You can't access the account normally. Maybe it resolves in an
          hour. Maybe longer.
        </p>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          The question isn't whether this scenario is likely. The useful question is: what
          would you do if it happened?
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          The three layers of financial resilience
        </h2>
        <ol className="mt-4 space-y-3">
          {[
            ["Money", "How much accessible money do you have?"],
            ["Access", "How many independent ways can you access it?"],
            ["Alternatives", "What can you use if your primary method fails?"],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-sm font-semibold text-zinc-100">
                {i + 1}. {t}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          This creates a much better picture than simply looking at your account balance.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Your single point of failure</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          A financial dependency becomes more important when one system performs too many jobs.
          For example: one bank → one card → one phone → one authentication method. If the phone
          is lost, access to the bank may become harder. If the bank is unavailable, your primary
          payment method may disappear with it. This is a dependency chain.
        </p>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          The goal isn't to eliminate every dependency. That's impossible. The goal is
          to understand the dependencies that would cause the biggest disruption if they failed.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Build an access backup</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Depending on your circumstances, resilience can involve maintaining more than one
          legitimate payment method, keeping important account information accessible securely,
          knowing how to contact your institution without relying entirely on one device,
          maintaining appropriate emergency liquidity, and understanding recovery and
          authentication procedures. Don't create unnecessary complexity. Create options
          where failure would matter most.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">The real question</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          You don't need to predict whether a bank outage will happen. You need to know: if
          my primary financial access disappeared tomorrow, what would break first? That's
          the kind of question TiltShield is designed to answer.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/assessment">Run your exposure assessment →</Link>
        </Button>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Related
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/guides/emergency-fund-breakpoint" className="text-emerald-400 hover:text-emerald-300">
                How long could your emergency fund actually last?
              </Link>
            </li>
            <li>
              <Link href="/guides/phone-lost" className="text-emerald-400 hover:text-emerald-300">
                What happens if you lose your phone?
              </Link>
            </li>
            <li>
              <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
                What is a break point?
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
