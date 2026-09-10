import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,rgba(16,185,129,0.16),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-14 text-center sm:pt-16">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400/90">
            Personal exposure intelligence
          </p>
          <h1 className="text-[2.15rem] font-bold leading-[1.1] tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.08]">
            The world is less stable than you think.
            <span className="mt-2 block text-emerald-400/95">How exposed are you?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            You might have a salary, a bank app, and a full fridge. That does not
            tell you how many days you last when one of them fails. TiltShield
            measures the number you cannot unsee — your break point — then maps
            what to fix first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-w-[240px] shadow-lg shadow-emerald-900/40">
              <Link href="/assessment">Measure my exposure</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/15">
              <a href="#break-point">What is a break point?</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            Free assessment · Nine questions · No motivational speech
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-center text-sm leading-relaxed text-zinc-400 sm:text-base">
            Balances don't RSVP. You can have money in an account, a credit
            score, and a grocery app — and still have no idea what happens if
            income pauses for 31 days. Attention is not the same thing as readiness.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">What you see</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                <li className="flex gap-2"><span className="text-zinc-600">·</span> Salary in the account</li>
                <li className="flex gap-2"><span className="text-zinc-600">·</span> Bank balance</li>
                <li className="flex gap-2"><span className="text-zinc-600">·</span> Followers, likes, news</li>
                <li className="flex gap-2"><span className="text-zinc-600">·</span> A full fridge this week</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/90">What you need to know</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-200">
                <li className="flex gap-2"><span className="text-emerald-500">·</span> Days until cash hits zero</li>
                <li className="flex gap-2"><span className="text-emerald-500">·</span> How many payment rails you actually have</li>
                <li className="flex gap-2"><span className="text-emerald-500">·</span> Whether ID and accounts survive a dead phone</li>
                <li className="flex gap-2"><span className="text-emerald-500">·</span> How long food lasts if shelves thin</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-center text-sm font-medium text-zinc-300">TiltShield measures the second column.</p>
        </div>
      </section>

      <section id="break-point" className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">Inside the app</p>
          <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            You think you are fine.
            <span className="block text-zinc-400">Your break points might disagree.</span>
          </h2>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-10">
            <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-[1.75rem] border border-emerald-500/25 bg-black shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/20 lg:mx-0">
              <video className="aspect-[9/16] w-full scale-105 bg-black object-cover object-[center_80%]" controls playsInline preload="metadata" autoPlay muted loop>
                <source src="/VID_20260905074244.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="space-y-4">
              <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-[#080d16] ring-1 ring-white/5 lg:block">
                <div className="flex items-center gap-2 border-b border-white/10 bg-[#0c1220] px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <div className="ml-2 flex-1 rounded-md bg-white/5 px-3 py-1 text-[11px] text-zinc-500">www.tiltshield.xyz/app</div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-400/90">Exposure</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-50">67 <span className="text-sm text-zinc-600">/ 100</span></p>
                    <p className="mt-1 text-[11px] text-zinc-500">4 significant dependencies</p>
                  </div>
                  <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-red-400">Weakest · Financial</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-50">31 days</p>
                    <p className="mt-1 text-[11px] text-zinc-500">Reserves if income stops</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] uppercase text-zinc-600">Digital</p>
                    <p className="mt-1 text-lg font-bold text-zinc-100">0 days</p>
                    <p className="text-[11px] text-zinc-500">No offline path to critical accounts</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] uppercase text-zinc-600">Payment</p>
                    <p className="mt-1 text-lg font-bold text-zinc-100">24 hours</p>
                    <p className="text-[11px] text-zinc-500">Single payment method on file</p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080d16] ring-1 ring-white/5 lg:hidden">
                <div className="flex items-center gap-2 border-b border-white/10 bg-[#0c1220] px-3 py-2">
                  <span className="text-[10px] font-semibold tracking-wide text-zinc-400">Today · Exposure board</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 p-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-400/90">Exposure</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-50">
                      67 <span className="text-sm text-zinc-600">/ 100</span>
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">4 significant dependencies</p>
                  </div>
                  <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-red-400">Weakest</p>
                    <p className="mt-1 text-2xl font-bold text-zinc-50">31 days</p>
                    <p className="mt-1 text-[11px] text-zinc-500">Financial break point</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] uppercase text-zinc-600">Digital</p>
                    <p className="mt-1 text-lg font-bold text-zinc-100">0 days</p>
                    <p className="text-[11px] text-zinc-500">No offline path</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] uppercase text-zinc-600">Payment</p>
                    <p className="mt-1 text-lg font-bold text-zinc-100">24 hrs</p>
                    <p className="text-[11px] text-zinc-500">Single rail on file</p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                That number is the point. Not a badge. Not a wellness score. A clock.
                Once you see 31 days, you cannot pretend the fridge and the salary
                are the same thing as a plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Break point is not a metaphor.</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Your <strong className="font-medium text-zinc-200">financial break point</strong> is
            the day cash reserves hit zero if primary income disappears or an enforced
            policy locks you out and expenses stay unchanged. Your{" "}
            <strong className="font-medium text-zinc-200">digital break point</strong> is how
            long you keep operating without your phone and access to the internet. Your{" "}
            <strong className="font-medium text-zinc-200">payment break point</strong> is how
            long everyday purchases survive if one or more rails fail.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Most people have never run the math. They feel busy, employed, and online —
            and confuse that with being hard to break.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Financial", "If income stops and spend stays the same, reserves reach zero in N days."],
              ["Digital", "Hours or days until critical accounts are unreachable without the primary device."],
              ["Payment", "How long you can still buy food and fuel if one payment method dies."],
              ["Food", "Days of meals you already eat — not fantasy stockpiles you will never touch."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4">
                <p className="text-sm font-semibold text-emerald-300/90">{t} break point</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">You need a guy for everything.</h2>
          <p className="mt-2 text-lg text-zinc-400">Real contacts and addresses when supply runs low.</p>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Locally and across borders — if you don't have a guy for everything,
            you don't have control over your life. You can get disappointed, stuck,
            and hopeless when one or more sources of livelihood shut down and still be
            unable to get yourself what you need.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            A guy for organic food, medicine, shelter, cash transactions, raw assets —
            at your beck and call — is how you move from just making money as a random
            citizen to elite-level consciousness and control. You become harder to
            break, kill, or control because you already stepped up and took control.
          </p>
          <p className="mt-5 text-sm text-zinc-500">
            TiltShield maps city and nation places near you — and global suppliers when
            local is not enough — so those contacts are not theory.
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-emerald-500/[0.04]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Hope is not a strategy. Preparation is.</h2>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Daily timeless intel and preparation stack kits are for top strategists —
            elite-level conscious individuals. They own access to the update that
            matters and see and make decisions before anyone else. Desperate people
            always attract predators because they are vulnerable.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Because they failed to plan, own, control, and stack when they first got
            the signal: <em className="text-zinc-300">it will rain.</em>
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Measure first. Spend second.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400/90">Don't</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                <li>Buy a year of gear before you know your gap</li>
                <li>Trust a single bank app as your plan</li>
                <li>Wait for the headline to start counting days</li>
                <li>Confuse a full fridge with a food break point</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/90">Do</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-200">
                <li>Run the nine-question exposure map</li>
                <li>Read your break points out loud</li>
                <li>Fix the shortest clock first</li>
                <li>Know one place for cash, meds, food, and power</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't pay to discover your weakness in a crisis. Use an afternoon to measure it now.
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">How it works</h2>
          <p className="mt-1 text-center text-sm text-zinc-500">Three steps. That's it.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Map your exposure", "Test from take-home income to offline docs. No theatre. Just the inputs that set your clocks."],
              ["02", "See the break points", "Financial. Digital. Payment. Food. The vulnerable one reveals itself. Then you build the safety net."],
              ["03", "Close the shortest clock", "Places near you, year stock, intel tied to your gaps. Fix what fails first. Then the next one."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <p className="text-xs font-bold tabular-nums text-emerald-400">{n}</p>
                <p className="mt-2 text-sm font-semibold text-zinc-50">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="border-b border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">What's inside</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Exposure profile", "One number and the dependencies behind it — not a wellness badge."],
              ["Break points", "Financial, digital, payment, food — clocks you can actually move."],
              ["City & nation map", "Pharmacies, cash, markets, hardware — places that still work when apps lag."],
              ["Global places", "Suppliers and brands when local is not enough."],
              ["Year stock", "Food, cash, meds, power, docs — ticked only when true in real life."],
              ["Live intel strip", "World → your exposure → the action that matters for your gaps."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4">
                <p className="text-sm font-semibold text-emerald-300/90">{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="text-xl font-semibold text-zinc-50 sm:text-2xl">
            &ldquo;But I already know where the risks are.&rdquo;
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Maybe. Do you know how many days of essentials you actually hold? How many
            payment rails survive a single outage or policy enforcement? Whether your
            household can prove identity offline? Which city-scale places are still open
            if delivery stops?
          </p>
          <p className="mt-4 text-sm font-medium text-zinc-300">
            That is the difference between sensing risk and measuring exposure.
          </p>
        </div>
      </section>

      <section id="pricing" className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">Pricing</p>
          <h2 className="mt-2 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Measure free. Upgrade when you want the full plan.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Free</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">$0</p>
              <ul className="mt-4 list-disc space-y-1.5 pl-4 text-sm text-zinc-400">
                <li>Assessment and overall exposure score</li>
                <li>One break point: Financial</li>
                <li>No account required</li>
              </ul>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/assessment">Measure my exposure</Link>
              </Button>
            </div>
            <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.08] p-5">
              <p className="absolute -top-2.5 right-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-zinc-950">Recommended</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Pro</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">$15 <span className="text-sm font-medium text-zinc-500">/ month</span></p>
              <p className="mt-1 text-xs text-zinc-400">Or $79/year · cancel anytime</p>
              <ul className="mt-4 list-disc space-y-1.5 pl-4 text-sm text-zinc-300">
                <li>All four break points</li>
                <li>What If? simulator</li>
                <li>Live intel matched to your gaps</li>
                <li>Vault, year stock, places</li>
              </ul>
              <Button asChild className="mt-5 w-full">
                <Link href="/assessment?plan=pro_monthly">Start Pro · $15/mo</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.05] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400">Family</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">$29 <span className="text-sm font-medium text-zinc-500">/ month</span></p>
              <p className="mt-1 text-xs text-zinc-400">Or $99/year · up to 6 profiles</p>
              <ul className="mt-4 list-disc space-y-1.5 pl-4 text-sm text-zinc-300">
                <li>Everything in Pro</li>
                <li>Household profiles</li>
                <li>Shared plan & shortest clock</li>
              </ul>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/assessment?plan=family_monthly">Start Family · $29/mo</Link>
              </Button>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/[0.05] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400/90">Founding · $149 once</p>
                <p className="mt-1 text-sm text-zinc-400">Lifetime Pro. No renewals. Limited seats.</p>
              </div>
              <Link href="/assessment?plan=lifetime" className="inline-flex shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/15 px-5 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-500/25">
                Claim founding access →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-emerald-500/[0.07] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Find out how exposed you are.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Test. A break point you will remember. A map of what to fix before the world tests it for you.
          </p>
          <Button asChild size="lg" className="mt-7 min-w-[260px] shadow-lg shadow-emerald-900/40">
            <Link href="/assessment">Measure my exposure</Link>
          </Button>
          <p className="mt-4 text-sm text-zinc-500">Free to start. No credit card. No soft speech.</p>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] bg-zinc-950 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">TiltShield</span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Personal exposure intelligence. Measure break points. Close the shortest clock first.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/assessment" className="hover:text-emerald-300">Assessment</Link></li>
                <li><a href="#pricing" className="hover:text-emerald-300">Pricing</a></li>
                <li><a href="#product" className="hover:text-emerald-300">What's inside</a></li>
                <li><Link href="/app/overview" className="hover:text-emerald-300">Open app</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/login" className="hover:text-emerald-300">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-emerald-300">Sign up</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-emerald-300">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-300">Terms</Link></li>
                <li><Link href="/guides" className="hover:text-emerald-300">Guides</Link></li>
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
