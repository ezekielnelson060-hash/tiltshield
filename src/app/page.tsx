import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
            Tiltshield
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/assessment"
              className="hidden text-sm text-zinc-400 transition hover:text-zinc-200 sm:inline"
            >
              Assessment
            </Link>
            <Button asChild size="sm">
              <Link href="/assessment">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-500">
            Personal resilience system
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl md:text-[3.15rem] md:leading-[1.12]">
            What happens if your life
            <br />
            <span className="text-emerald-400">stops working</span> tomorrow?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Your bank. Your income. Your phone. Your documents.
            <br className="hidden sm:block" />
            Tiltshield shows where you&apos;re most exposed — and what to fix
            first.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="min-w-[220px]">
              <Link href="/assessment">Find my vulnerabilities</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            2 minutes · Free · No credit card
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            Most people don&apos;t know what they would lose until they lose it.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            What you&apos;ll see after 10 questions
          </p>
          <div className="mx-auto w-full max-w-[280px] sm:max-w-[300px]">
            <div className="rounded-[2.4rem] border-[3px] border-zinc-700 bg-zinc-900 p-2 shadow-2xl shadow-black/50">
              <div className="relative mx-auto mb-2 flex h-7 w-[7.5rem] items-center justify-center rounded-full bg-black">
                <div className="absolute right-5 h-2 w-2 rounded-full bg-zinc-800" />
              </div>
              <div className="overflow-hidden rounded-[1.9rem] bg-zinc-950">
                <div className="px-4 pb-6 pt-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Your Tiltshield score
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight text-zinc-50">61</span>
                    <span className="text-xs text-zinc-600">/ 100</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-zinc-400">
                    You&apos;re prepared for some disruptions. You&apos;re exposed to others.
                  </p>
                  <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/[0.07] p-3.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-red-400">
                      Your biggest vulnerability
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-zinc-50">Financial dependency</p>
                    <p className="mt-1.5 text-[11px] leading-snug text-zinc-400">
                      If your primary income disappeared today, your reserves would cover about 23 days.
                    </p>
                    <div className="mt-3 rounded-lg bg-zinc-950/70 p-2.5">
                      <p className="text-[10px] font-medium text-emerald-400">What to do</p>
                      <p className="mt-0.5 text-[11px] text-zinc-200">Build a 30-day essential-expense buffer.</p>
                      <p className="mt-1.5 text-[9px] text-zinc-500">15 min to start · Very high impact</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-emerald-500">One move</p>
                    <p className="mt-1.5 text-sm font-medium text-zinc-50">Create a backup payment method</p>
                    <p className="mt-1 text-[10px] text-zinc-500">8 minutes · High impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-lg px-4 py-14 sm:py-16">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="text-lg font-medium text-zinc-200">
              What if your income stopped tomorrow?
            </h2>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-5xl font-bold tracking-tight text-zinc-50">23</p>
                <p className="mt-1 text-sm text-zinc-400">days you could currently operate</p>
              </div>
              <div className="flex-1 space-y-3 sm:max-w-[220px]">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-zinc-500">
                    <span>Emergency fund</span>
                    <span>23 days</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: "25%" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
                    <p className="text-zinc-500">Primary income</p>
                    <p className="mt-0.5 font-medium text-zinc-200">1 source</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5">
                    <p className="text-zinc-500">Alternative</p>
                    <p className="mt-0.5 font-medium text-red-400">None</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-7 border-t border-zinc-800 pt-6">
              <p className="text-sm leading-relaxed text-zinc-300">
                Your biggest vulnerability isn&apos;t your savings.
                <br />
                <span className="font-medium text-zinc-50">It&apos;s having only one income source.</span>
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/assessment">See yours →</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            The world doesn&apos;t have to collapse.
            <br />
            <span className="text-zinc-400">One thing just has to stop working.</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Your bank","Your phone","Your income","Your internet","Your payment method","Your documents"].map((item) => (
              <span key={item} className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-400">{item}</span>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-zinc-400">
            You don&apos;t need to predict which one.
            <br />
            You just need to know what happens if it does.
          </p>
          <p className="mt-4 text-sm font-medium text-emerald-400">That&apos;s Tiltshield.</p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-lg px-4 py-14 sm:py-16">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">What if…</h2>
          <p className="mt-2 text-center text-sm text-zinc-500">Uncomfortable questions. Clear answers.</p>
          <div className="mt-8 divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
            {[
              { q: "My bank goes down for 72 hours", a: "Can you still pay for what you need?" },
              { q: "I lose my phone", a: "Can you still access your accounts?" },
              { q: "My income stops", a: "How long can you operate?" },
              { q: "Food prices double", a: "What happens to your monthly survival cost?" },
              { q: "The internet goes down", a: "What information do you suddenly lose?" },
            ].map((item) => (
              <div key={item.q} className="bg-zinc-900/40 px-5 py-4">
                <p className="font-medium text-zinc-100">{item.q}?</p>
                <p className="mt-1 text-sm text-zinc-500">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm leading-relaxed text-zinc-400">
            Tiltshield doesn&apos;t predict the future.
            <br />
            <span className="text-zinc-200">It shows you how exposed you are to it.</span>
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-lg px-4 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-semibold text-zinc-50">
            10 questions.
            <br />
            <span className="text-zinc-400">One clear picture of you.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Answer honestly. Tiltshield measures your resilience across money, digital, food,
            communication, documents, home, skills, and emergency — then ranks what to fix first.
          </p>
          <div className="mx-auto mt-8 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Question 4 of 10</span>
              <span>40%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-2/5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-4 text-sm text-zinc-200">
              If your phone was lost today, could you recover critical accounts?
            </p>
            <p className="mt-2 text-xs text-emerald-500">This one matters more than you think.</p>
          </div>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/assessment">Start my assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-lg px-4 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Don&apos;t prepare for everything.
            <br />
            <span className="text-emerald-400">Prepare for your weakest point.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
            Not a long checklist. One high-impact move for this week.
          </p>
          <div className="mx-auto mt-8 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">Your next move</p>
            <h3 className="mt-2 font-semibold text-zinc-50">Create a backup payment method</h3>
            <p className="mt-1 text-xs text-zinc-500">8 minutes · High impact</p>
            <p className="mt-3 text-sm text-zinc-400">
              Right now your finances may depend on a single payment channel.
            </p>
            <div className="mt-4">
              <Button asChild size="sm">
                <Link href="/assessment">Start →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            You can&apos;t control what happens next.
            <br />
            <span className="text-zinc-400">You can control how dependent you are when it does.</span>
          </h2>
          <p className="mt-5 text-sm font-medium text-emerald-400">That&apos;s Tiltshield.</p>
          <div className="mt-8">
            <Button asChild size="lg" className="min-w-[240px]">
              <Link href="/assessment">Find my vulnerabilities</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-zinc-500">
            Free assessment · Full plan · <span className="text-zinc-300">$29 lifetime</span>
          </p>
        </div>
      </section>

      <footer className="bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-sm font-semibold text-zinc-50">Tiltshield</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
                Your personal resilience system. Know what could break. Fix it before it does.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/assessment" className="hover:text-zinc-200">Assessment</Link></li>
                <li><Link href="/assessment" className="hover:text-zinc-200">What If? simulator</Link></li>
                <li><span className="text-zinc-600">Pricing — $29 lifetime</span></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Coming soon</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>Tiltshield Family</li>
                <li>Tiltshield Business</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-600">Privacy</span></li>
                <li><span className="text-zinc-600">Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-zinc-900 pt-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Tiltshield. All rights reserved.</p>
            <p>Built for people who prefer agency over anxiety.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
