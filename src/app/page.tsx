import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-zinc-950" />

      <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-16 sm:pt-24">
        <header className="mb-16 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-zinc-50">
            Tiltshield
          </span>
          <Link
            href="/assessment"
            className="text-sm text-zinc-400 transition hover:text-zinc-200"
          >
            Start assessment
          </Link>
        </header>

        <section className="text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/90">
            Personal resilience system
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl md:text-[3.25rem] md:leading-[1.1]">
            What happens if your life
            <br />
            <span className="text-emerald-400">stops working</span> tomorrow?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Your bank. Your income. Your phone. Your access to important
            information.
            <br className="hidden sm:block" />
            Tiltshield finds where you&apos;re most exposed — then tells you
            exactly what to fix first.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="min-w-[220px]">
              <Link href="/assessment">Find my vulnerabilities</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            2 minutes · Free assessment · No credit card
          </p>
          <p className="mt-8 text-sm italic text-zinc-500">
            Most people don&apos;t know what they would lose until they lose it.
          </p>
        </section>

        <section className="mt-24">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
            Example
          </p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
            <h2 className="text-lg font-medium text-zinc-300">
              What if your income stopped tomorrow?
            </h2>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
                  23
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  days you could currently operate
                </p>
              </div>
              <div className="flex-1 space-y-3 sm:max-w-xs">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-zinc-500">
                    <span>Emergency fund</span>
                    <span>23 days</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: "25%" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2">
                    <p className="text-zinc-500">Primary income</p>
                    <p className="mt-0.5 font-medium text-zinc-200">1 source</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2">
                    <p className="text-zinc-500">Alternative income</p>
                    <p className="mt-0.5 font-medium text-red-400">None</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-zinc-800 pt-6">
              <p className="text-sm leading-relaxed text-zinc-300">
                Your biggest vulnerability isn&apos;t your savings.
                <br />
                <span className="font-medium text-zinc-50">
                  It&apos;s having only one income source.
                </span>
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/assessment">Find mine →</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 space-y-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            The world doesn&apos;t have to collapse.
            <br />
            <span className="text-zinc-400">
              One thing just has to stop working.
            </span>
          </h2>
          <ul className="mx-auto flex max-w-md flex-wrap justify-center gap-2 text-sm text-zinc-400">
            {[
              "Your bank",
              "Your phone",
              "Your income",
              "Your internet",
              "Your payment method",
              "Your documents",
            ].map((item) => (
              <li
                key={item}
                className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mx-auto max-w-lg text-zinc-400">
            You don&apos;t need to predict which one.
            <br />
            You just need to know what happens if it does.
          </p>
          <p className="text-sm font-medium text-emerald-400">That&apos;s Tiltshield.</p>
        </section>

        <section className="mt-24">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">
            What if…
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Uncomfortable questions. Clear answers.
          </p>
          <div className="mt-10 space-y-3">
            {[
              {
                q: "My bank goes down for 72 hours",
                a: "Can I still pay for what I need?",
              },
              {
                q: "I lose my phone",
                a: "Can I still access my accounts?",
              },
              {
                q: "My income stops",
                a: "How long can I operate?",
              },
              {
                q: "Food prices double",
                a: "What happens to my monthly survival cost?",
              },
              {
                q: "The internet goes down",
                a: "What information do I suddenly lose access to?",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4"
              >
                <p className="font-medium text-zinc-100">{item.q}?</p>
                <p className="mt-1 text-sm text-zinc-500">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm leading-relaxed text-zinc-400">
            Tiltshield doesn&apos;t predict the future.
            <br />
            <span className="text-zinc-200">
              It shows you how exposed you are to it.
            </span>
          </p>
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-2xl font-semibold text-zinc-50">
            10 questions.
            <br />
            <span className="text-zinc-400">One uncomfortable truth.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
            Answer honestly. Tiltshield calculates your resilience across money,
            digital, food, communication, documents, home, skills, and emergency.
          </p>
          <p className="mt-6 text-xs uppercase tracking-wider text-zinc-600">
            Checking the structural integrity of your life
          </p>
          <div className="mx-auto mt-6 max-w-xs rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Question 04 / 10</span>
              <span>40%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-2/5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-4 text-sm text-zinc-300">
              If your phone was lost today, could you recover critical accounts?
            </p>
            <p className="mt-2 text-xs text-emerald-500/80">
              This one matters more than you think.
            </p>
          </div>
        </section>

        <section className="mt-24">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Your Tiltshield score
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-5xl font-bold text-zinc-50">61</span>
              <span className="text-sm text-zinc-500">/ 100</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              You&apos;re prepared for some disruptions. You&apos;re exposed to
              others.
            </p>
            <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-red-400">
                Your biggest vulnerability
              </p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-50">
                Financial dependency
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                If your primary income disappeared today, your current reserves
                would cover approximately 23 days.
              </p>
              <div className="mt-4 rounded-lg bg-zinc-950/50 p-3 text-sm">
                <p className="font-medium text-emerald-400">What to do</p>
                <p className="mt-1 text-zinc-200">
                  Build a 30-day essential-expense buffer.
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Time: 15 minutes to start · Impact: Very high
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Don&apos;t prepare for everything.
            <br />
            <span className="text-emerald-400">
              Prepare for your weakest point.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
            Not 400 things to buy. One thing to fix this week.
          </p>
          <div className="mx-auto mt-10 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
              Your next move
            </p>
            <h3 className="mt-2 font-semibold text-zinc-50">
              Create a backup payment method
            </h3>
            <p className="mt-1 text-xs text-zinc-500">8 minutes · High impact</p>
            <p className="mt-3 text-sm text-zinc-400">
              Your current financial setup depends entirely on one payment
              channel.
            </p>
            <div className="mt-4">
              <Button asChild size="sm">
                <Link href="/assessment">Start →</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-28 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            You can&apos;t control what happens next.
            <br />
            <span className="text-zinc-400">
              You can control how dependent you are when it does.
            </span>
          </h2>
          <p className="mt-6 text-sm font-medium text-emerald-400">
            That&apos;s Tiltshield.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="min-w-[240px]">
              <Link href="/assessment">Find my vulnerabilities</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Free assessment · Full resilience plan ·{" "}
            <span className="text-zinc-300">$29 founding lifetime</span>
          </p>
        </section>

        <section className="mt-20 border-t border-zinc-900 pt-12 text-center">
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Built for more than one person
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-zinc-500">
            <span>
              <span className="text-zinc-300">Personal</span> — your life
            </span>
            <span className="text-zinc-700">·</span>
            <span>
              <span className="text-zinc-400">Family</span> — household
            </span>
            <span className="text-zinc-700">·</span>
            <span>
              <span className="text-zinc-400">Business</span> — operations
            </span>
          </div>
        </section>

        <footer className="mt-16 text-center text-xs text-zinc-600">
          Tiltshield — know what could break. Fix it before it does.
        </footer>
      </div>
    </main>
  );
}
