import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-zinc-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-12 text-center sm:pt-16">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-400/90">
            Personal exposure intelligence
          </p>
          <h1 className="text-[2.1rem] font-bold leading-[1.12] tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.08]">
            The world is less stable than you think.
            <span className="mt-3 block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              How exposed are you?
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            You might have a salary, a bank app, and a full fridge. That does not
            tell you how many days you last when one of them fails.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Tiltshield measures the number you cannot unsee — your{" "}
            <span className="text-zinc-200">break point</span> — then maps what
            to fix first.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="min-w-[220px] shadow-lg shadow-emerald-900/30"
            >
              <Link href="/assessment">Measure my exposure</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#break-point">What is a break point?</a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-zinc-500">
            Free assessment · Nine questions · No motivational speech
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Balances don&apos;t RSVP.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base text-zinc-400">
            You can have money in an account, a credit score, and a grocery app —
            and still have no idea what happens if income pauses for 31 days.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-center text-base text-zinc-400">
            Attention is not the same thing as readiness.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                What you see
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>Salary in the account</li>
                <li>Bank balance</li>
                <li>Followers, likes, news</li>
                <li>A full fridge this week</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/90">
                What you need to know
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                <li>Days until cash hits zero</li>
                <li>How many payment rails you actually have</li>
                <li>Whether ID and accounts survive a dead phone</li>
                <li>How long food lasts if shelves thin</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500">
            Tiltshield measures the second column.
          </p>
        </div>
      </section>

      <section id="break-point" className="border-b border-zinc-900 bg-zinc-900/30">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Example profile · not live data
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50 sm:text-4xl">
            You think you are fine.
          </h2>
          <p className="mt-2 text-center text-lg text-zinc-400">
            Your break points might disagree.
          </p>

          <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400/90">
              Exposure
            </p>
            <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-zinc-50">
              67 <span className="text-2xl font-medium text-zinc-500">/ 100</span>
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              You have 4 significant dependencies.
            </p>
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400/90">
                Your weakest point
              </p>
              <p className="mt-2 text-xl font-semibold text-zinc-50">
                🔴 Financial · 31 days
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Your current reserves cover approximately 31 days of essential
                expenses if primary income stops and spend stays the same.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  Digital break point
                </p>
                <p className="mt-1 text-lg font-bold text-red-400">0 days</p>
                <p className="mt-1 text-xs text-zinc-500">
                  No offline path to critical accounts
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  Payment break point
                </p>
                <p className="mt-1 text-lg font-bold text-amber-400">24 hours</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Single payment method on file
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-zinc-500">What happens next?</p>
            <Button asChild className="mt-3 w-full sm:w-auto">
              <Link href="/assessment">Run the scenario →</Link>
            </Button>
          </div>

          <p className="mx-auto mt-8 max-w-lg text-center text-sm leading-relaxed text-zinc-500">
            That number is the point. Not a badge. Not a wellness score. A clock.
            Once you see 31 days, you cannot pretend the fridge and the salary
            are the same thing as a plan.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Break point is not a metaphor.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Your financial break point is the day cash reserves hit zero if
            primary income disappears and expenses stay unchanged. Your digital
            break point is how long you keep operating when the phone is gone.
            Your payment break point is how long everyday purchases survive if
            one rail fails.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Most people have never run the math. They feel busy, employed, and
            online — and confuse that with being hard to break.
          </p>
          <div className="mt-10 space-y-4">
            {[
              [
                "Financial break point",
                "If income stops and spend stays the same, reserves reach zero in N days.",
              ],
              [
                "Digital break point",
                "Hours or days until critical accounts are unreachable without the primary device.",
              ],
              [
                "Payment break point",
                "How long you can still buy food and fuel if one payment method dies.",
              ],
              [
                "Food break point",
                "Days of meals you already eat, not fantasy stockpiles you will never touch.",
              ],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 px-5 py-4"
              >
                <p className="text-sm font-semibold text-zinc-100">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold text-zinc-50">
            Measure first. Spend second.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400/80">
                Don&apos;t
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li>Buy a year of gear before you know your gap</li>
                <li>Trust a single bank app as your plan</li>
                <li>Wait for the headline to start counting days</li>
                <li>Confuse a full fridge with a food break point</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Do
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-200">
                <li>Run the nine-question exposure map</li>
                <li>Read your break points out loud</li>
                <li>Fix the shortest clock first</li>
                <li>Know one place for cash, meds, food, and power</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t pay to discover your weakness in a crisis. Use an afternoon
            to measure it now.
          </p>
        </div>
      </section>

      <section id="how" className="border-b border-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            How it works
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">
            Three steps. That&apos;s it.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              [
                "01",
                "Map your exposure",
                "Nine questions from take-home income to offline docs. No theatre. Just the inputs that set your clocks.",
              ],
              [
                "02",
                "See the break points",
                "Financial. Digital. Payment. Food. The shortest number is your first problem — not a score to brag about.",
              ],
              [
                "03",
                "Close the shortest clock",
                "Places near you, year stock, intel tied to your gaps. Fix what fails first. Then the next one.",
              ],
            ].map(([n, t, d]) => (
              <div
                key={n}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
              >
                <p className="text-xs font-bold text-emerald-400">{n}</p>
                <p className="mt-3 text-lg font-semibold text-zinc-50">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="border-b border-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold text-zinc-50">
            What you get after the number
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-400">
            Exposure without a map is just anxiety. Tiltshield turns the score
            into places, stock, and scenarios you can act on.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Exposure profile",
                "One number and the dependencies behind it — not a wellness badge.",
              ],
              [
                "Break points",
                "Financial, digital, payment, food — clocks you can actually move.",
              ],
              [
                "City & nation map",
                "Pharmacies, cash, markets, hardware — places that still work when apps lag.",
              ],
              [
                "Global places",
                "Suppliers and brands when local is not enough.",
              ],
              [
                "Year stock",
                "Food, cash, meds, power, docs — ticked only when true in real life.",
              ],
              [
                "Live intel strip",
                "World → your exposure → the action that matters for your gaps.",
              ],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
              >
                <p className="text-sm font-semibold text-zinc-50">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold text-zinc-50">
            “But I already know where the risks are.”
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Maybe. Do you know how many days of essentials you actually hold? How
            many payment rails survive a single outage? Whether your household
            can prove identity offline? Which city-scale places still open if
            delivery stops?
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            That is the difference between sensing risk and measuring exposure.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Find out how exposed you are.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
            Nine questions. A break point you will remember. A map of what to fix
            before the world tests it for you.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 min-w-[220px] shadow-lg shadow-emerald-900/30"
          >
            <Link href="/assessment">Measure my exposure</Link>
          </Button>
          <p className="mt-5 text-sm text-zinc-500">
            Free to start. No credit card. No soft speech.
          </p>
          <p className="mt-10 text-xs text-zinc-600">
            Tiltshield · Measure exposure. Close the shortest clock.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-xs text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Tiltshield</p>
          <div className="flex gap-4">
            <Link href="/app/overview" className="hover:text-zinc-400">
              App
            </Link>
            <Link href="/assessment" className="hover:text-zinc-400">
              Assessment
            </Link>
            <a href="#how" className="hover:text-zinc-400">
              How it works
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
