import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-emerald-500/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-10 text-center sm:pt-12">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400/90">
            Personal exposure intelligence
          </p>
          <h1 className="text-[2.1rem] font-bold leading-[1.12] tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.08]">
            The world is less stable than you think.
            <span className="mt-2 block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              How exposed are you?
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Built for people with income, dependents, and something to lose.
            Tiltshield maps what breaks first — financial, digital, payment,
            food — then keeps the clocks live while you close the shortest one.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-w-[220px] shadow-lg shadow-emerald-900/40">
              <Link href="/assessment">Measure my exposure</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-500/30 hover:bg-emerald-500/10">
              <a href="#pricing">See pricing</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            Free to measure. Pro from $9/mo when you want the year stack on.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <a href="#pricing" className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 hover:border-emerald-500/30 hover:text-zinc-200">
              Free · $0
            </a>
            <a href="#pricing" className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300 hover:bg-emerald-500/15">
              Pro · $9/mo
            </a>
            <a href="#pricing" className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-teal-300 hover:bg-teal-500/15">
              Family · $19/mo
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-gradient-to-b from-emerald-500/[0.06] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Economic, medical, and social disruptions reveal themselves before they happen.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:text-base">
            You can have money in an account, a credit score, and a grocery app —
            and still be unable to use them because of an outage or a policy. If
            you get cut off overnight, how long can you survive?
          </p>
        </div>
      </section>

      <section id="break-point" className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
            Inside the app
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            You think you are fine.
          </h2>
          <p className="mt-1 text-center text-base text-zinc-400">
            Your break point might disagree.
          </p>
          <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-[1.75rem] border border-emerald-500/25 bg-black shadow-2xl shadow-emerald-950/50 ring-1 ring-emerald-500/20">
            <video
              className="aspect-[9/16] w-full scale-105 bg-black object-cover object-[center_80%]"
              controls
              playsInline
              preload="metadata"
              autoPlay
              muted
              loop
            >
              <source src="/VID_20260905074244.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="mx-auto mt-5 max-w-lg text-center text-sm text-zinc-500">
            Once you see your break point you cannot pretend everything is fine —
            that's when preparation gets real.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg" className="min-w-[220px] shadow-lg shadow-emerald-900/40">
              <Link href="/assessment">Run the scenario →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
            Pricing
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Measure free. Stay covered on a subscription.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
            Exposure changes. Intel changes. A one-time download cannot keep
            your shortest clock honest. Recurring is how the product stays on.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Free</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">$0</p>
              <p className="mt-1 text-xs text-zinc-500">See the number once</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-400">
                <li>Nine-question assessment</li>
                <li>All four break points</li>
                <li>City / nation map</li>
                <li>Core 1-year plan outline</li>
              </ul>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/assessment">Measure my exposure</Link>
              </Button>
            </div>

            <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.08] p-5 shadow-lg shadow-emerald-900/25">
              <p className="absolute -top-2.5 right-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">
                Recommended
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Pro</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">
                $9 <span className="text-sm font-medium text-zinc-500">/ month</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">Live clocks · cancel anytime</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                <li>Everything in Free</li>
                <li>Live intel matched to your gaps</li>
                <li>Full What If + vault</li>
                <li>Progress, journal, year stock</li>
                <li>Offline value tracking</li>
                <li><span className="text-emerald-300">Or $79/year</span> (save ~27%)</li>
              </ul>
              <Button asChild className="mt-5 w-full">
                <Link href="/assessment?plan=pro_monthly">Start Pro · $9/mo</Link>
              </Button>
              <p className="mt-2 text-center text-[11px] text-zinc-500">
                <Link href="/assessment?plan=pro_annual" className="text-emerald-400/90 hover:text-emerald-300">
                  Prefer annual · $79/yr →
                </Link>
              </p>
            </div>

            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.06] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400">Family</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">
                $19 <span className="text-sm font-medium text-zinc-500">/ month</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">Household · up to 6 profiles</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                <li>Everything in Pro</li>
                <li>Up to 6 household profiles</li>
                <li>Shared emergency plan</li>
                <li>Family shortest-clock view</li>
                <li>Cancel anytime</li>
              </ul>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/assessment?plan=family_monthly">Start Family · $19/mo</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400/90">
                  Limited founding · one-time
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  Prefer a single payment while we are early? Founding locks
                  individual or household access without a renewal — limited seats.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Link
                  href="/assessment?plan=lifetime"
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/15"
                >
                  Individual · $29 once
                </Link>
                <Link
                  href="/assessment?plan=family"
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/15"
                >
                  Household · $49 once
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-emerald-500/[0.04]">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">
            Why subscription — not only lifetime
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-zinc-950 p-4">
              <p className="text-sm font-semibold text-emerald-300">Live product</p>
              <p className="mt-2 text-sm text-zinc-400">
                Intel feeds, maps, and break-point math change with the world.
                Recurring funds the feed that keeps your clocks honest.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-zinc-950 p-4">
              <p className="text-sm font-semibold text-emerald-300">Aligned incentives</p>
              <p className="mt-2 text-sm text-zinc-400">
                If we stop being useful, you cancel. That pressure is a feature
                — for you and for the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-gradient-to-b from-emerald-500/[0.08] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Find out how exposed you are.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Free assessment. Then Pro from $9/mo if you want the stack kept live.
          </p>
          <Button asChild size="lg" className="mt-6 min-w-[220px] shadow-lg shadow-emerald-900/40">
            <Link href="/assessment">Measure my exposure</Link>
          </Button>
          <p className="mt-4 text-sm text-zinc-500">
            Free · $0 · Pro $9/mo · Family $19/mo · Founding from $29
          </p>
        </div>
      </section>

      <footer className="border-t border-emerald-500/10 bg-zinc-950 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">Tiltshield</span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Measure exposure. Close the shortest clock. Keep it live.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500/70">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/assessment" className="hover:text-emerald-300">Assessment</Link></li>
                <li><a href="#pricing" className="hover:text-emerald-300">Pricing</a></li>
                <li><Link href="/app/overview" className="hover:text-emerald-300">Open app</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500/70">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-emerald-300">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-300">Terms</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500/70">Pricing</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>Free · $0</li>
                <li>Pro · $9/mo or $79/yr</li>
                <li>Family · $19/mo</li>
                <li>Founding lifetime · $29 / $49</li>
              </ul>
            </div>
          </div>
          <p className="mt-10 text-center text-[11px] text-zinc-600">
            © {new Date().getFullYear()} Tiltshield. Personal exposure intelligence.
          </p>
        </div>
      </footer>
    </main>
  );
}
