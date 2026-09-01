import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div className="rounded-[2.2rem] border-[3px] border-zinc-700 bg-zinc-900 p-1.5 shadow-2xl shadow-black/40">
        <div className="relative mx-auto mb-1.5 flex h-6 w-28 items-center justify-center rounded-full bg-black">
          <div className="absolute right-4 h-1.5 w-1.5 rounded-full bg-zinc-800" />
        </div>
        <div className="overflow-hidden rounded-[1.75rem] bg-zinc-950">{children}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="border-b border-zinc-900">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-emerald-500">
              Personal Resilience Intelligence
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.1]">
              Know what could affect you.{" "}
              <span className="text-emerald-400">Know how exposed you are.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Stress-test your life against real disruptions — income, payments,
              power, food, digital access. Get a clear score, a priority action,
              and resources near you. Same product worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/assessment">Get my resilience score</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#product">See how it works</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Free assessment · Today · Intel · What If · Nearby · Family
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneFrame>
              <div className="space-y-4 px-3.5 pb-5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-zinc-300">Tiltshield</span>
                  <span className="text-[10px] tabular-nums text-zinc-500">67 / 100</span>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">Resilience</p>
                  <p className="mt-2 text-[9px] uppercase tracking-wider text-zinc-500">Biggest exposure</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-50">Financial dependency</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
                    42 <span className="text-xs font-normal text-zinc-500">days</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">income-stop runway</p>
                  <div className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-center text-[10px] font-medium text-white">
                    Fix this first
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-500">Today's priority</p>
                  <p className="mt-1 text-xs font-medium text-zinc-200">Create a 7-day emergency buffer</p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">12 min · High impact</p>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Systems can change.
            <br />
            <span className="text-zinc-400">Your plan doesn't have to be guesswork.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-500">
            Know your exposure. Simulate disruption. Act on the highest leverage fix.
            Find resources near you — same interface in every country.
          </p>
        </div>
      </section>

      <section id="product" className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Six systems
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Today · Prepare · Intel · What If · Nearby · Family
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Today", "Score, biggest exposure, and one priority action"],
              ["Prepare", "Buffer plans, kits, and practical checklists"],
              ["Intel", "Developments that may affect your resilience"],
              ["What If", "Stress-test income, payments, power, food, digital"],
              ["Nearby", "Food, pharmacy, banking, fuel — by your location"],
              ["Family", "Household profiles and shared dependencies"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-sm font-semibold text-zinc-50">{title}</p>
                <p className="mt-2 text-xs text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what-if" className="border-b border-zinc-900 bg-zinc-900/20">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">What If?</p>
          <h2 className="mt-3 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Stress-test before reality does
          </h2>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-zinc-200">What if your income stopped today?</h3>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-bold tabular-nums text-zinc-50">42</p>
                <p className="mt-1 text-sm text-zinc-500">days estimated runway</p>
              </div>
              <div className="space-y-1 text-right text-xs text-zinc-500">
                <p>Built from your numbers</p>
                <p className="text-zinc-300">Income · expenses · savings</p>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild className="w-full" size="lg">
                <Link href="/assessment">Run your own simulation →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">Start free. Go deeper when ready.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Free</p>
              <p className="mt-2 text-3xl font-bold text-zinc-50">$0</p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                <li>Resilience assessment</li>
                <li>Score + biggest exposure</li>
                <li>One What If scenario</li>
                <li>Prepare + Nearby basics</li>
              </ul>
              <Button asChild variant="outline" className="mt-8 w-full">
                <Link href="/assessment">Start free</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">Founding</p>
              <p className="mt-2 text-3xl font-bold text-zinc-50">
                $29 <span className="text-base font-normal text-zinc-500">lifetime</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                <li>All What If scenarios</li>
                <li>Full Prepare + history</li>
                <li>Family profiles</li>
                <li>Vault + deeper Intel</li>
              </ul>
              <Button asChild className="mt-8 w-full">
                <Link href="/assessment">Become a founding member</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">FAQ</h2>
          <div className="mt-10 space-y-6">
            {[
              [
                "What is Tiltshield?",
                "Personal Resilience Intelligence — know what could affect you, how exposed you are, and what to do next.",
              ],
              [
                "Does it predict crises?",
                "No. It measures your dependencies and helps you prepare if systems change.",
              ],
              [
                "Is this financial advice?",
                "No. Practical household readiness — not regulated advice.",
              ],
              [
                "Does it work outside one country?",
                "Yes. The product is global; currency, distance, and map results follow your location.",
              ],
            ].map(([q, a]) => (
              <div key={q}>
                <h3 className="text-sm font-medium text-zinc-100">{q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Curiosity → clarity → agency.
          </h2>
          <p className="mt-5 text-sm font-medium text-emerald-400">That's the Tiltshield loop.</p>
          <div className="mt-8">
            <Button asChild size="lg" className="min-w-[240px]">
              <Link href="/assessment">Get my resilience score</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-zinc-50">Tiltshield</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
                Personal Resilience Intelligence
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><a href="#product" className="hover:text-zinc-200">How it works</a></li>
                <li><Link href="/assessment" className="hover:text-zinc-200">Assessment</Link></li>
                <li><a href="#pricing" className="hover:text-zinc-200">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">App</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-600">Today</span></li>
                <li><span className="text-zinc-600">Intel · Nearby</span></li>
                <li><span className="text-zinc-600">What If · Family</span></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-600">Privacy</span></li>
                <li><span className="text-zinc-600">Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-zinc-900 pt-8 text-xs text-zinc-600 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Tiltshield. All rights reserved.</p>
            <p>Agency over anxiety.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
