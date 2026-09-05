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
            Tiltshield starts from your real income, maps what could break, and
            helps you prepare — buffers, kits, local resources, and clear{" "}
            <span className="text-zinc-200">what if</span> plans — before you
            even need them.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-w-[220px] shadow-lg shadow-emerald-900/40">
              <Link href="/assessment">Measure my exposure</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-500/30 hover:bg-emerald-500/10">
              <a href="#break-point">What is a break point?</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            The assessment reveals vulnerabilities. Once you see yours, you
            can't unsee it.
          </p>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-gradient-to-b from-emerald-500/[0.06] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Economic, medical, and social disruptions reveal themselves before
            they happen.
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
              className="aspect-[9/16] w-full bg-black object-cover object-top"
              controls
              playsInline
              preload="metadata"
              autoPlay
              muted
              loop
            >
              <source src="/media/tiltshield-demo.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400/90">
              Exposure
            </p>
            <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-zinc-50">
              67 <span className="text-xl font-medium text-zinc-500">/ 100</span>
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              You have 4 significant dependencies.
            </p>
            <div className="mt-5 border-t border-emerald-500/10 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400/90">
                Your weakest point
              </p>
              <p className="mt-1.5 text-lg font-semibold text-zinc-50">
                🔴 Financial · 31 days
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                Reserves cover ~31 days of essentials if primary income stops and
                spend stays the same.
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  Digital break point
                </p>
                <p className="mt-0.5 text-base font-bold text-red-400">0 days</p>
                <p className="text-xs text-zinc-500">No offline path to accounts</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  Payment break point
                </p>
                <p className="mt-0.5 text-base font-bold text-amber-400">24 hours</p>
                <p className="text-xs text-zinc-500">Single payment method</p>
              </div>
            </div>
            <Button asChild className="mt-5 w-full shadow-md shadow-emerald-900/30">
              <Link href="/assessment">Run the scenario →</Link>
            </Button>
          </div>
          <p className="mx-auto mt-5 max-w-lg text-center text-sm text-zinc-500">
            Once you see your break point you cannot pretend everything is fine —
            that's when preparation gets real.
          </p>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-emerald-500/[0.04]">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Break point is not a metaphor.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Your financial break point is the day cash hits zero if income
            disappears or policy locks you out. Digital is how long you operate
            without the phone. Payment is how long purchases survive if a rail
            fails. Most people never run the math.
          </p>
          <div className="mt-6 space-y-2.5">
            {[
              ["Financial", "Reserves → zero in N days if income stops."],
              ["Digital", "Hours until critical accounts are unreachable offline."],
              ["Payment", "How long food and fuel still buy if one method dies."],
              ["Food", "Days of meals you already eat — toward a full year."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="flex gap-3 rounded-xl border border-emerald-500/15 bg-zinc-950/70 px-4 py-3"
              >
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{t}</p>
                  <p className="text-sm text-zinc-500">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            You need a guy for everything.
          </h2>
          <p className="mt-1 text-base text-emerald-400/90">
            Real contacts and addresses when supply runs low.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Locally and across borders: if you don't have a guy for food,
            medicine, shelter, cash, and raw assets, you don't have control.
            City & nation map near you. Global places when borders matter. Built
            for a full year of access.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              "Organic food & markets",
              "Medicine & clinics",
              "Shelter paths",
              "Cash transactions",
              "Hardware & power",
              "Raw assets (gold)",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5 text-sm font-medium text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-gradient-to-b from-transparent via-emerald-500/[0.05] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Hope is not a strategy. Preparation is.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Daily intel and a one-year preparation stack are for people who refuse
            to stay vulnerable. They decide before the crowd. Desperate people
            attract predators because they failed to stack when the signal first
            arrived.
          </p>
        </div>
      </section>

      <section id="pricing" className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
            Pricing
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Measure first. Unlock the year stack when ready.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Free
              </p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">$0</p>
              <p className="mt-1 text-xs text-zinc-500">Exposure map · break points</p>
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
                Popular
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Lifetime
              </p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">
                $29{" "}
                <span className="text-sm font-medium text-zinc-500">one-time</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">Individual · full tools</p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                <li>Everything in Free</li>
                <li>Full What If scenarios</li>
                <li>Document vault + offline value</li>
                <li>Progress history</li>
                <li>Live intel for your gaps</li>
                <li>Year stock + global places</li>
              </ul>
              <Button asChild className="mt-5 w-full">
                <Link href="/assessment">Start free, unlock later</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.06] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400">
                Family
              </p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">
                $49{" "}
                <span className="text-sm font-medium text-zinc-500">one-time</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Household · up to 6 profiles
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-zinc-300">
                <li>Everything in Lifetime</li>
                <li>Up to 6 household profiles</li>
                <li>Shared emergency plan</li>
                <li>Family exposure scores</li>
                <li>One payment covers the house</li>
              </ul>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/assessment">Plan for the household</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-emerald-500/[0.04]">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">
            Measure first. Spend second.
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-red-500/20 bg-zinc-950 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400/80">
                Don't
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
                <li>Buy a year of gear before you know the gap</li>
                <li>Trust a single bank app as your plan</li>
                <li>Wait for the headline to count days</li>
                <li>Confuse a full fridge with a food break point</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Do
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-zinc-200">
                <li>Run the exposure map test</li>
                <li>Read your break points out loud</li>
                <li>Fix the shortest clock first</li>
                <li>Know one place for cash, meds, food, power</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-zinc-500">
            Don't pay to discover weakness in a crisis. Measure it this
            afternoon.
          </p>
        </div>
      </section>

      <section id="how" className="border-b border-emerald-500/10">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
            How it works
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold text-zinc-50">
            Three steps. That's it.
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ["01", "Map your exposure", "From take-home income to offline docs. The inputs that set your clocks."],
              ["02", "See the break points", "Financial. Digital. Payment. Food. The weak one shows first."],
              ["03", "Close the shortest clock", "Places, year stock, intel for your gaps. Fix what fails first."],
            ].map(([n, t, d]) => (
              <div
                key={n}
                className="rounded-xl border border-emerald-500/20 bg-zinc-900/40 p-5"
              >
                <p className="text-xs font-bold text-emerald-400">{n}</p>
                <p className="mt-2 text-base font-semibold text-zinc-50">{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="border-b border-emerald-500/10 bg-emerald-500/[0.04]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">
            What's inside
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
            Built for a full year of preparation — not a 72-hour go-bag fantasy.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Exposure profile", "One number and the dependencies — not a wellness badge."],
              ["Break points", "Financial, digital, payment, food — clocks you can move."],
              ["City & nation map", "Pharmacies, cash, markets, hardware when apps lag."],
              ["Global places", "Suppliers and brands when local is not enough."],
              ["Year stock", "Food, cash, meds, power, docs — ticked only when true."],
              ["Live intel strip", "World → your exposure → the action for your gaps."],
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
            “But I already know where the risks are.”
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Do you know how many days of essentials you hold? How many payment
            rails survive one outage? Whether the household can prove identity
            offline? Which city places stay open if delivery stops? Sensing risk
            is not measuring exposure.
          </p>
        </div>
      </section>

      <section className="border-b border-emerald-500/10 bg-gradient-to-b from-emerald-500/[0.08] to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Find out how exposed you are.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Test. A break point you will remember. A map of what to fix before the
            world tests it for you.
          </p>
          <Button asChild size="lg" className="mt-6 min-w-[220px] shadow-lg shadow-emerald-900/40">
            <Link href="/assessment">Measure my exposure</Link>
          </Button>
          <p className="mt-4 text-sm text-zinc-500">
            Free to start. No credit card. No soft speech.
          </p>
        </div>
      </section>

      <footer className="border-t border-emerald-500/10 bg-zinc-950 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-sm font-semibold text-zinc-100">Tiltshield</span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Measure exposure. Close the shortest clock. Prepare for a year.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500/70">
                Product
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-400">
                <li><Link href="/assessment" className="hover:text-emerald-300">Assessment</Link></li>
                <li><Link href="/app/overview" className="hover:text-emerald-300">App</Link></li>
                <li><a href="#pricing" className="hover:text-emerald-300">Pricing</a></li>
                <li><a href="#how" className="hover:text-emerald-300">How it works</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500/70">
                Account
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-400">
                <li><Link href="/login" className="hover:text-emerald-300">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-emerald-300">Sign up</Link></li>
                <li><Link href="/assessment" className="hover:text-emerald-300">Start free</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500/70">
                Legal
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-emerald-300">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-300">Terms</Link></li>
                <li><a href="mailto:hello@tiltshield.app" className="hover:text-emerald-300">Contact</a></li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t border-zinc-900 pt-5 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} Tiltshield. Measure exposure. Prepare for a year.
          </p>
        </div>
      </footer>
    </main>
  );
}
