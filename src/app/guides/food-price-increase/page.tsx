import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "What Happens When Food Prices Rise? How to Build Household Resilience | TiltShield",
  description:
    "Food prices can change your household budget faster than your income changes. Learn how to measure food-cost exposure and build more flexibility into your household.",
};

export default function FoodPriceGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Guide · Household exposure
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What Happens When Food Prices Rise?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          You don&apos;t need a dramatic crisis for household resilience to matter. Sometimes the
          pressure is simpler: your normal shopping trip costs more. Then it costs more again.
          Your income may stay exactly the same while one of your largest recurring expenses
          increases. That&apos;s a form of exposure.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Measure your food dependency
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Start with your normal monthly food spending. Then ask: what would happen to my budget
          if food costs increased significantly?
        </p>
        <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          Example: $600/month on food. A 20% increase → $720/month. That&apos;s +$120/month, or
          $1,440 over a year. The percentage sounds abstract. The annual impact isn&apos;t.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          The important variable is flexibility
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Households don&apos;t all respond the same way. One may have flexible food spending,
          multiple stores nearby, ability to substitute products, some savings, and room in the
          budget. Another may already operate close to its limit. For the second household, the
          same price increase creates much greater pressure. Resilience isn&apos;t about
          predicting prices — it&apos;s about how much room you have when prices move against you.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Reduce concentration</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Think about household resilience as options: several places to buy essentials, comparing
          recurring costs, a reasonable buffer, knowing which purchases can be substituted,
          reducing unnecessary recurring expenses, planning around foods your household actually
          uses. The objective isn&apos;t hoarding. It&apos;s flexibility.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Your household has a break point too
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Financial resilience isn&apos;t only about losing your job. Your household has multiple
          pressure points: food prices, utilities, transport, insurance, unexpected expenses.
          Individually each may be manageable. The problem occurs when several pressures arrive
          while the budget has little room left. See also{" "}
          <Link href="/guides/income-loss" className="text-emerald-400 hover:text-emerald-300">
            income loss
          </Link>{" "}
          and the{" "}
          <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
            break point
          </Link>{" "}
          model.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Don&apos;t prepare for everything</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          You can&apos;t predict every price movement. You don&apos;t need to. Identify expenses
          where your household has high importance + high exposure + low flexibility. Those
          deserve attention first. That&apos;s the principle behind TiltShield: you don&apos;t
          need to predict the future. You need to know where it would hurt you most.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/assessment">Find your biggest exposure →</Link>
        </Button>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Related
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/guides/income-loss" className="text-emerald-400 hover:text-emerald-300">
                What happens if you lose your income?
              </Link>
            </li>
            <li>
              <Link href="/guides/emergency-fund-breakpoint" className="text-emerald-400 hover:text-emerald-300">
                Emergency fund break point
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
