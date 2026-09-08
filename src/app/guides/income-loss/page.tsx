import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "What Happens If You Lose Your Income Tomorrow? | TiltShield",
  description:
    "How long could you keep your essential expenses covered if your income stopped tomorrow? Learn how to calculate your income-loss break point.",
};

export default function IncomeLossGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Guide · Income dependency
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What Happens If You Lose Your Income Tomorrow?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Losing your income changes the meaning of almost every financial number you look at.
          Your salary isn&apos;t just money. It supports housing, food, transportation, debt
          payments, insurance, subscriptions, family obligations, and future plans.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          So the important question isn&apos;t &ldquo;How much do I earn?&rdquo; It&apos;s: how
          long could my life continue if that income disappeared?
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Calculate your income-loss runway
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">Start with three numbers:</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base text-zinc-400">
          <li>
            <span className="text-zinc-200">Accessible emergency reserves</span> — money you could
            actually use if income stopped.
          </li>
          <li>
            <span className="text-zinc-200">Essential monthly expenses</span> — the minimum
            realistic cost of keeping the household functioning.
          </li>
          <li>
            <span className="text-zinc-200">Alternative income</span> — money you could reasonably
            generate if primary income disappeared.
          </li>
        </ol>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Simplest runway: emergency reserves ÷ essential monthly expenses. Then adjust for
          alternative income.
        </p>
        <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          Example: savings $9,000, essential expenses $3,000/month, alternative income $500/month.
          Shortfall = $2,500. Runway ≈ $9,000 ÷ $2,500 = 3.6 months.
        </p>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          The exact number will vary. The point is to understand the mechanism. Use the{" "}
          <Link
            href="/guides/emergency-fund-breakpoint"
            className="text-emerald-400 hover:text-emerald-300"
          >
            emergency fund calculator
          </Link>{" "}
          for a quick clock in days.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Income concentration matters</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Two people can earn the same amount and have very different resilience. Person A: one
          income source. Person B: primary salary plus freelance, investments, or another
          household income. Person B isn&apos;t automatically safer — but exposure to a single
          income failure may be lower. The more your essential life depends on one source, the
          more important that dependency becomes.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Don&apos;t confuse wealth with resilience
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Someone can have high income and a short{" "}
          <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
            break point
          </Link>
          : high expenses, high debt, low savings, concentrated income, inflexible obligations.
          Someone with lower income can have a longer runway if essential expenses are low and
          reserves are strong. Resilience is about relationships between variables, not one
          impressive number.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">What should you improve first?</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          If your income-loss runway is short, you don&apos;t need to solve everything at once.
          Find the largest lever: more reserves, lower essential burn, more income diversity, or
          lower fixed obligations. The right answer depends on your situation — which is why a
          generic checklist isn&apos;t enough. You need to know where exposure is concentrated.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Know your break point</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Your break point is not a prediction. It&apos;s a measurement. And measurements give
          you something you can improve. Find out what happens to your life when primary income
          disappears.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/assessment">Calculate your personal exposure →</Link>
        </Button>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Related
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/guides/emergency-fund-breakpoint" className="text-emerald-400 hover:text-emerald-300">
                Emergency fund break point
              </Link>
            </li>
            <li>
              <Link href="/guides/food-price-increase" className="text-emerald-400 hover:text-emerald-300">
                What happens when food prices rise?
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
