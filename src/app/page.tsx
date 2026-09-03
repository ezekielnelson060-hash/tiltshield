import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="absolute -inset-8 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative rounded-[2.4rem] border-[3px] border-zinc-600/80 bg-gradient-to-b from-zinc-800 to-zinc-950 p-2 shadow-2xl shadow-emerald-950/40">
        <div className="relative mx-auto mb-2 flex h-7 w-32 items-center justify-center rounded-full bg-black">
          <div className="absolute right-5 h-1.5 w-1.5 rounded-full bg-zinc-700" />
        </div>
        <div className="overflow-hidden rounded-[1.85rem] bg-zinc-950">{children}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-zinc-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Personal Resilience Intelligence
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem]">
              When systems change,{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                are you ready?
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              Tiltshield starts from your real income, maps what could break, and
              helps you prepare — buffers, kits, local resources, and clear What
              If plans — before you need them.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="min-w-[200px] shadow-lg shadow-emerald-900/30">
                <Link href="/assessment">Get my readiness score</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#product">See how it works</a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-zinc-500">
              Built on your income · Free assessment · Add to home screen
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneFrame>
              <div className="space-y-3 px-3.5 pb-5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wide text-zinc-300">
                    TILTSHIELD
                  </span>
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] tabular-nums text-emerald-400">
                    67 / 100
                  </span>
                </div>
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                    Biggest exposure
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-50">
                    Financial dependency
                  </p>
                  <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-zinc-50">
                    42{" "}
                    <span className="text-sm font-normal text-zinc-500">days</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">income-stop runway</p>
                  <div className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-center text-[11px] font-semibold text-white">
                    Fix this first →
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-500">
                    Today's move
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-100">
                    Create a 7-day emergency buffer
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">12 min · High impact</p>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Money", "Digital", "Food"] as const).map((c, i) => (
                    <div
                      key={c}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-1.5 py-2 text-center"
                    >
                      <p className="text-[8px] text-zinc-500">{c}</p>
                      <p className="text-[11px] font-semibold tabular-nums text-zinc-200">
                        {[67, 71, 62][i]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Systems can change overnight.
            <br />
            <span className="text-zinc-400">
              Your household doesn't have to scramble.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-500">
            Income. Food. Payments. Power. Phone. Neighbors you can still call.
            Tiltshield turns those into a practical readiness plan.
          </p>
          <div className="mx-auto mt-10 max-w-[320px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/40">
            <video
              className="aspect-[9/16] h-auto w-full max-h-[360px] object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/media/tiltshield-demo.mp4" type="video/mp4" />
            </video>
            <p className="border-t border-zinc-900 px-3 py-2 text-[11px] text-zinc-500">
              A quick look inside Today — score, priority, nearby, intel
            </p>
          </div>
        </div>
      </section>

      <section id="product" className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Inside Tiltshield
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">
            Score · Simulate · Stock · Act
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-zinc-400">
            From take-home income to home kits and local vendors — one place to prepare.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Assess", "Income, buffers, food, kits, vendors"],
              ["What If", "Income stop, payments, power, food prices"],
              ["Prepare", "Home stock, medical kit, city contacts"],
              ["Finder", "Off-grid, cash map, farms, community near you"],
            ].map(([t, d]) => (
              <div
                key={t}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-emerald-500/30 hover:bg-zinc-900/70"
              >
                <p className="text-base font-semibold text-zinc-50 group-hover:text-emerald-400">
                  {t}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what-if" className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            What If?
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">
            Stress-test before reality does
          </h2>
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-zinc-700/80 bg-zinc-950 p-8 shadow-xl shadow-black/40">
            <h3 className="text-xl font-medium text-zinc-100">
              What if your income stopped today?
            </h3>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-6xl font-bold tabular-nums tracking-tight text-zinc-50">42</p>
                <p className="mt-2 text-sm text-zinc-500">days current runway</p>
              </div>
              <div className="space-y-1 text-right text-xs text-zinc-500">
                <p>Built from your numbers</p>
                <p className="text-zinc-300">Income · expenses · savings</p>
              </div>
            </div>
            <div className="mt-8">
              <Button asChild className="w-full" size="lg">
                <Link href="/assessment">Run your own simulation →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold text-zinc-50">
            Eight readiness dimensions
          </h2>
          <p className="mt-3 text-center text-sm text-zinc-500">
            Tiltshield finds what to strengthen first.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {[
              ["Money", "Income, savings, offline value"],
              ["Digital", "Devices, accounts, recovery"],
              ["Food", "Pantry, stores, supply diversity"],
              ["Documents", "IDs, records, offline copies"],
              ["Communication", "Contacts beyond one phone"],
              ["Home", "Kits, utilities, local vendors"],
              ["Skills", "Backup income paths"],
              ["Emergency", "72-hour readiness"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4"
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500/80" />
                <div>
                  <p className="text-sm font-medium text-zinc-100">{title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold text-zinc-50">
            Start free. Go deeper when ready.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Free</p>
              <p className="mt-3 text-4xl font-bold text-zinc-50">$0</p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-400">
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Income-based assessment</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Readiness score</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Biggest exposure</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Limited What If</li>
                <li className="flex gap-2"><span className="text-emerald-500">✓</span> Prepare basics + Finder</li>
              </ul>
              <Button asChild variant="outline" className="mt-10 w-full" size="lg">
                <Link href="/assessment">Start free</Link>
              </Button>
            </div>
            <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-8 shadow-lg shadow-emerald-950/20">
              <p className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-950">Popular</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Lifetime</p>
              <p className="mt-3 text-4xl font-bold text-zinc-50">$29 <span className="text-base font-normal text-zinc-500">one-time</span></p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Everything in Free</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> All What If scenarios</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Vault + history</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Calculators + live intel</li>
              </ul>
              <Button asChild className="mt-10 w-full" size="lg">
                <Link href="/assessment">Get Lifetime · $29</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-white/15 bg-zinc-950 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Household</p>
              <p className="mt-3 text-4xl font-bold text-zinc-50">$49 <span className="text-base font-normal text-zinc-500">one-time</span></p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Everything in Lifetime</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Up to 6 profiles</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Shared dependency insights</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Household readiness score</li>
              </ul>
              <Button asChild variant="outline" className="mt-10 w-full" size="lg">
                <Link href="/assessment">Get Household · $49</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            You can't control every system.
            <br />
            <span className="text-zinc-400">You can prepare your household.</span>
          </h2>
          <p className="mt-6 text-base font-medium text-emerald-400">That's Tiltshield.</p>
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
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">Prepare for what might come next.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li><a href="#product" className="hover:text-zinc-200">How it works</a></li>
                <li><Link href="/assessment" className="hover:text-zinc-200">Assessment</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Account</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li><Link href="/login" className="hover:text-zinc-200">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-zinc-200">Sign up</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Legal</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li><span className="text-zinc-500">Not financial advice</span></li>
              </ul>
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
