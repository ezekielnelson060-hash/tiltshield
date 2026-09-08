import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-emerald-500/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-12 text-center sm:pt-14">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400/90">
            Personal exposure intelligence
          </p>
          <h1 className="text-[2.1rem] font-bold leading-[1.12] tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.08]">
            How long could you survive if everything stopped working tomorrow?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            TiltShield measures your financial, digital, food, and payment
            vulnerabilities—then shows you exactly what to fix first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-w-[240px] shadow-lg shadow-emerald-900/40">
              <Link href="/assessment">Measure my exposure — Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-500/30 hover:bg-emerald-500/10">
              <a href="#pricing">See pricing</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            10 questions. No account required. Your score and #1 vulnerability free.
          </p>
        </div>
      </section>

      <section className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                q: "I thought I was fine until I saw 11 days.",
                a: "TiltShield user, 6 weeks later: 94 days of runway",
              },
              {
                q: "The What If? simulator made me realize my entire digital life was on one phone.",
                a: "TiltShield user, backed up 12 accounts offline",
              },
              {
                q: "Not a prepper app. A sanity app.",
                a: "TiltShield user, Lagos",
              },
            ].map((item) => (
              <blockquote
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left"
              >
                <p className="text-sm leading-relaxed text-zinc-200">
                  “{item.q}”
                </p>
                <footer className="mt-3 text-xs text-zinc-500">{item.a}</footer>
              </blockquote>
            ))}
          </div>
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
        </div>
      </section>

      <section id="product" className="border-b border-emerald-500/10 bg-emerald-500/[0.04]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">
            What you get
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
            Built for a full year of preparation—not a 72-hour go-bag fantasy.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Exposure score", "One number and the dependencies—not a wellness badge."],
              ["Break points", "Financial, digital, payment, food—clocks you can move."],
              ["What If? simulator", "Test scenarios before they happen—income stop, outage, payment failure."],
              ["Live intel", "Regional risk alerts matched to your gaps: bank outages, price spikes, supply disruptions."],
              ["12-month preparedness tracker", "Food, cash, meds, power, documents—ticked only when true."],
              ["Physical asset & cash inventory", "Know what you hold offline when accounts and apps go dark."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-xl border border-emerald-500/15 bg-zinc-950/60 p-4"
              >
                <p className="text-sm font-semibold text-emerald-300/90">{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-2xl font-semibold text-zinc-50">
            What is live intel?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            We monitor regional disruptions—bank outages, payment network
            failures, food price spikes, fuel shortages, policy changes—and
            match them to your specific gaps.
          </p>
          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
              Example
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              If a banking restriction is announced in your city and your What
              If? shows you have no alternative payment method, you get an alert
              and your break point recalculates automatically.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
            Pricing
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Measure free. Upgrade when you want the full plan.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Free</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">$0</p>
              <p className="mt-1 text-xs text-zinc-500">Know your number</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-400">
                <li>10-question resilience assessment</li>
                <li>Your overall exposure score (0–100)</li>
                <li>One break point revealed: Financial dependency</li>
                <li>See where you stand—no account required</li>
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
                $15 <span className="text-sm font-medium text-zinc-500">/ month</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">Close the gaps · cancel anytime</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                <li>Everything in Free</li>
                <li>All four break points unlocked (financial, digital, food, payment)</li>
                <li>What If? simulator — test 8 scenarios before they happen</li>
                <li>
                  Live intel — regional risk alerts matched to your
                  vulnerabilities (bank outages, price spikes, supply disruptions)
                </li>
                <li>Secure vault — encrypted document & asset backup</li>
                <li>12-month preparedness tracker with progress history</li>
                <li>Physical asset & cash inventory tools</li>
                <li><span className="text-emerald-300">Or $79/year</span></li>
              </ul>
              <Button asChild className="mt-5 w-full">
                <Link href="/assessment?plan=pro_monthly">Start Pro · $15/mo</Link>
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
                $29 <span className="text-sm font-medium text-zinc-500">/ month</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">Protect the household · up to 6 profiles</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                <li>Everything in Pro</li>
                <li>Up to 6 household profiles</li>
                <li>Shared emergency plan & contact tree</li>
                <li>Family-wide shortest-clock view</li>
                <li>Cancel anytime</li>
              </ul>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/assessment?plan=family_monthly">Start Family · $29/mo</Link>
              </Button>
              <p className="mt-2 text-center text-[11px] text-zinc-500">
                <Link href="/assessment?plan=family_annual" className="text-teal-300/90 hover:text-teal-200">
                  Prefer annual · $99/yr →
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400/90">
                  Founding Member · $149 one-time
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-200">Only 100 seats</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Lifetime Pro access. No renewals. No price increases. Full
                  feature stack forever—including everything we build next.
                </p>
              </div>
              <Link
                href="/assessment?plan=lifetime"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-500/25"
              >
                Claim founding access →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-zinc-900/40">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <h2 className="text-2xl font-semibold text-zinc-50">
            Your data never leaves your device.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            We don't sell it. We can't see it. We don't want it.
            TiltShield runs on your phone. Your savings, your location, your
            vulnerabilities—they're yours. We only store what you need to
            sync across devices, encrypted end-to-end.
          </p>
        </div>
      </section>

      <section className="border-b border-emerald-500/10">
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
            Find your break point in 90 seconds.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            10 questions. No account required. See your exposure score and your
            #1 vulnerability free.
          </p>
          <Button asChild size="lg" className="mt-6 min-w-[260px] shadow-lg shadow-emerald-900/40">
            <Link href="/assessment">Measure my exposure — Free</Link>
          </Button>
          <p className="mt-4 text-sm text-zinc-500">
            Then upgrade to Pro to unlock your full resilience plan.
          </p>
        </div>
      </section>

      <footer className="border-t border-emerald-500/10 bg-zinc-950 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="text-sm font-semibold text-zinc-100">TiltShield</span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Personal exposure intelligence & resilience planning.
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
          </div>
          <p className="mt-10 text-center text-[11px] text-zinc-600">
            © {new Date().getFullYear()} TiltShield. Personal exposure intelligence.
          </p>
        </div>
      </footer>
    </main>
  );
}
