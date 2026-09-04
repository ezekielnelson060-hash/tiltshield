import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-zinc-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/12 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-14 text-center sm:pt-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Personal Resilience Intelligence
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.1] lg:text-[3.15rem]">
            Protect yourself & family from economic, medical & social
            disruptions{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              before your neighbors
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Tiltshield starts from your real income, maps what could break, and
            helps you prepare — buffers, kits, local resources, and clear What
            If plans — before you need them.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-w-[200px] shadow-lg shadow-emerald-900/30">
              <Link href="/assessment">Get my readiness score</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how">See how it works</a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-zinc-500">
            Built on your income · Free assessment · Add to home screen
          </p>
        </div>
      </section>

      <section id="product" className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            The network around you
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Know a place for everything that keeps life steady
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-zinc-400">
            Not a panic list — a calm map of pharmacies, markets, cash access,
            hardware, and people you can still reach when apps go quiet.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Money & cash", "Buffers, second payment rails, and where cash still works when cards lag."],
              ["Food & water", "Meals you already eat, layered toward a year — plus places to restock locally."],
              ["Health & meds", "Kits, critical refills, and clinics you can name before a shortage story hits."],
              ["Power & home", "Light, charge, and hardware when the grid or delivery network slows."],
              ["Documents", "IDs and proofs offline — so systems arguing with each other is not your crisis."],
              ["People", "Paper contacts, household roles, and community spaces that still open doors."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-emerald-500/30"
              >
                <p className="text-base font-semibold text-zinc-50">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what-if" className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">What If?</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">
            Stress-test life before reality does
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-zinc-400">
            Income pause. Payment rails. Power. Food prices. Phone gone. Each scenario becomes a short list you can act on.
          </p>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {["Income stops", "Primary bank unavailable", "Phone lost", "Food prices jump", "Power outage", "Medical expense"].map((s) => (
              <div key={s} className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-medium text-zinc-200">{s}</div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg"><Link href="/assessment">Run your simulation →</Link></Button>
          </div>
        </div>
      </section>

      <section id="how" className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">How it works</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">Score · Map · Stock · Act</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              ["1. Assess", "Nine questions from take-home income to kits and vendors."],
              ["2. See exposure", "A clear resilience score and the one gap to fix first."],
              ["3. Find places", "Local map for pharmacies, food, cash, hardware, solar."],
              ["4. Build the year", "Layer stock and plans so a hard month is survivable."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
                <p className="text-sm font-semibold text-emerald-400">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Agency over anxiety</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
            Systems change. Households that already know their buffer, their pharmacy, and their second way to pay do not scramble.
            Tiltshield is the quiet advantage: preparation without theatrics — and a map of real places behind every checklist.
          </p>
        </div>
      </section>

      <section id="pricing" className="border-b border-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold text-zinc-50">Start free. Go deeper when ready.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Free</p>
              <p className="mt-3 text-4xl font-bold text-zinc-50">$0</p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-400">
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Income-based assessment</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Resilience score</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Biggest exposure</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Prepare + Finder basics</li>
              </ul>
              <Button asChild variant="outline" className="mt-10 w-full" size="lg"><Link href="/assessment">Start free</Link></Button>
            </div>
            <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-8 shadow-lg shadow-emerald-950/20">
              <p className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-950">Popular</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Lifetime</p>
              <p className="mt-3 text-4xl font-bold text-zinc-50">$29 <span className="text-base font-normal text-zinc-500">one-time</span></p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Everything in Free</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> All What If scenarios</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Vault + history</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Live intel + calculators</li>
              </ul>
              <Button asChild className="mt-10 w-full" size="lg"><Link href="/assessment">Get Lifetime · $29</Link></Button>
            </div>
            <div className="rounded-2xl border border-white/15 bg-zinc-950 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Household</p>
              <p className="mt-3 text-4xl font-bold text-zinc-50">$49 <span className="text-base font-normal text-zinc-500">one-time</span></p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Everything in Lifetime</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Up to 6 profiles</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Shared dependencies</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Household readiness</li>
              </ul>
              <Button asChild variant="outline" className="mt-10 w-full" size="lg"><Link href="/assessment">Get Household · $49</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            You cannot control every system.<br />
            <span className="text-zinc-400">You can prepare your household.</span>
          </h2>
          <p className="mt-6 text-base font-medium text-emerald-400">That is Tiltshield.</p>
          <div className="mt-10">
            <Button asChild size="lg" className="min-w-[260px] shadow-lg shadow-emerald-900/25">
              <Link href="/assessment">Get my readiness score</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-zinc-50">Tiltshield</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">Prepare for what might come next — without the noise.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li><a href="#product" className="hover:text-zinc-200">Overview</a></li>
                <li><a href="#what-if" className="hover:text-zinc-200">What If?</a></li>
                <li><a href="#how" className="hover:text-zinc-200">How it works</a></li>
                <li><a href="#pricing" className="hover:text-zinc-200">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Account</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/login" className="hover:text-zinc-200">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-zinc-200">Sign up</Link></li>
                <li><Link href="/assessment" className="hover:text-zinc-200">Assessment</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Note</p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">Not financial, medical, or legal advice. Practical household preparation.</p>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-zinc-900 pt-8 text-xs text-zinc-600 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Tiltshield. All rights reserved.</p>
            <p>Built for people who prefer agency over anxiety.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
