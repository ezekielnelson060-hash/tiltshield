import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
            Tiltshield
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#product" className="hover:text-zinc-200">Product</a>
            <a href="#what-if" className="hover:text-zinc-200">What If?</a>
            <a href="#how" className="hover:text-zinc-200">How it works</a>
            <a href="#pricing" className="hover:text-zinc-200">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/assessment" className="hidden text-sm text-zinc-400 hover:text-zinc-200 sm:inline">
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/assessment">Get my score</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-900">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-emerald-500">
              Personal resilience system
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl sm:leading-[1.1]">
              What happens if your life{" "}
              <span className="text-emerald-400">stops working</span> tomorrow?
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Your life has dependencies. Tiltshield shows you which ones matter most — then tells you exactly what to fix first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/assessment">Find my vulnerabilities</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#product">See the product</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-zinc-500">2 minutes · Free assessment · No credit card</p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneFrame>
              <div className="space-y-4 px-3.5 pb-5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-zinc-300">Tiltshield</span>
                  <span className="text-[10px] tabular-nums text-zinc-500">67 / 100</span>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">Overview</p>
                  <p className="mt-2 text-[9px] uppercase tracking-wider text-zinc-500">Your biggest exposure</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-50">Financial dependency</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
                    23 <span className="text-xs font-normal text-zinc-500">days</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">essential-expense runway</p>
                  <div className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-center text-[10px] font-medium text-white">
                    Fix this first
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-500">Today&apos;s move</p>
                  <p className="mt-1 text-xs font-medium text-zinc-200">Create a backup payment method</p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">8 min · High impact</p>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Know what could break.
            <br />
            <span className="text-zinc-400">Fix it before it does.</span>
          </h2>
        </div>
      </section>

      <section id="product" className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Inside Tiltshield</p>
          <h2 className="mt-3 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">A clearer picture of your life</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-zinc-400">One system. One picture. One next move.</p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <PhoneFrame>
                <div className="space-y-3 px-3 pb-4 pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">Overview</p>
                  <p className="text-2xl font-bold text-zinc-50">67 <span className="text-xs text-zinc-600">/ 100</span></p>
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2.5">
                    <p className="text-[8px] uppercase text-red-400">Biggest vulnerability</p>
                    <p className="mt-0.5 text-xs font-medium text-zinc-100">Financial dependency</p>
                    <p className="mt-1 text-[10px] text-zinc-400">23 days runway</p>
                  </div>
                  <div className="rounded-lg bg-emerald-600/90 py-1.5 text-center text-[9px] font-medium text-white">Fix this first</div>
                </div>
              </PhoneFrame>
              <p className="text-center text-xs text-zinc-500">Overview</p>
            </div>

            <div className="space-y-3">
              <PhoneFrame>
                <div className="space-y-2 px-3 pb-4 pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">What If?</p>
                  {[["Income stops", "23 days"], ["Banking down", "72 hours"], ["Phone lost", "Recover?"]].map(([a, b]) => (
                    <div key={a} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-2">
                      <p className="text-[11px] font-medium text-zinc-200">{a}</p>
                      <p className="text-[10px] text-zinc-500">{b}</p>
                    </div>
                  ))}
                </div>
              </PhoneFrame>
              <p className="text-center text-xs text-zinc-500">What If?</p>
            </div>

            <div className="space-y-3">
              <PhoneFrame>
                <div className="space-y-1.5 px-3 pb-4 pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">My Risk</p>
                  {[["Money", "42", "text-red-400"], ["Digital", "61", "text-amber-400"], ["Food", "84", "text-emerald-400"], ["Documents", "58", "text-amber-400"], ["Communication", "78", "text-emerald-400"]].map(([name, score, color]) => (
                    <div key={name} className="flex items-center justify-between border-b border-zinc-900 py-1.5 last:border-0">
                      <span className="text-[11px] text-zinc-300">{name}</span>
                      <span className={`text-[11px] tabular-nums font-medium ${color}`}>{score}</span>
                    </div>
                  ))}
                </div>
              </PhoneFrame>
              <p className="text-center text-xs text-zinc-500">My Risk</p>
            </div>

            <div className="space-y-3">
              <PhoneFrame>
                <div className="space-y-3 px-3 pb-4 pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-500">Today&apos;s move</p>
                  <p className="text-xs font-semibold text-zinc-50">Create a backup payment method</p>
                  <p className="text-[10px] text-zinc-500">8 minutes · High impact</p>
                  <ul className="space-y-1 text-[10px] text-zinc-400">
                    <li>□ Withdraw a modest cash reserve</li>
                    <li>□ Activate a secondary card</li>
                    <li>□ Test that you can use it</li>
                  </ul>
                  <div className="rounded-lg bg-emerald-600 py-1.5 text-center text-[9px] font-medium text-white">Start</div>
                </div>
              </PhoneFrame>
              <p className="text-center text-xs text-zinc-500">Actions</p>
            </div>
          </div>
        </div>
      </section>

      <section id="what-if" className="border-b border-zinc-900 bg-zinc-900/20">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">What If?</p>
          <h2 className="mt-3 text-center text-2xl font-semibold text-zinc-50 sm:text-3xl">Stress-test your life</h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-zinc-400">
            Don&apos;t wait for something to fail to discover you depend on it.
          </p>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h3 className="text-lg font-medium text-zinc-200">What if your income stopped today?</h3>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-bold tabular-nums text-zinc-50">23</p>
                <p className="mt-1 text-sm text-zinc-500">days current runway</p>
              </div>
              <div className="space-y-1 text-right text-xs text-zinc-500">
                <p>Essential spend · monthly</p>
                <p className="text-zinc-300">Your number</p>
                <p>Other income · none</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-red-400">Exposure · High</p>
              <p className="mt-2 text-sm text-zinc-300">
                Your biggest vulnerability isn&apos;t only your savings — it&apos;s dependence on one income source.
              </p>
            </div>
            <div className="mt-6">
              <Button asChild className="w-full" size="lg">
                <Link href="/assessment">Run your own simulation →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">How Tiltshield thinks</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-50">Priorities, not checklists</h2>
          <div className="mt-10 flex flex-col items-center gap-2 text-sm text-zinc-400">
            {["Your life", "10 questions", "Resilience engine", "8 categories", "Your vulnerabilities", "What If?", "One high-impact action"].map((step, i, arr) => (
              <div key={step} className="flex flex-col items-center">
                <span className={i === 0 || i === arr.length - 1 ? "font-medium text-zinc-100" : ""}>{step}</span>
                {i < arr.length - 1 && <span className="my-1 text-zinc-700">↓</span>}
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm font-medium text-emerald-400">Assess → Discover → Simulate → Fix</p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">Your resilience isn&apos;t one thing</h2>
          <p className="mt-2 text-center text-sm text-zinc-500">Tiltshield finds the weakest link.</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              ["Money", "Income, savings, payment access"],
              ["Digital", "Devices, accounts, data"],
              ["Food", "Supply, price exposure"],
              ["Documents", "Identity, records, backups"],
              ["Communication", "Contacts, alternatives"],
              ["Home", "Utilities, essential systems"],
              ["Skills", "Practical independence"],
              ["Emergency", "Immediate readiness"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                <p className="text-sm font-medium text-zinc-100">{title}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-zinc-50">Your vulnerabilities are yours</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Assessment data personalizes your experience — not a profile to sell. In this version, answers stay on your device. You control what you share.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-zinc-500">
            {["On-device by default", "You control your data", "No spam, no scare tactics"].map((t) => (
              <span key={t} className="rounded-full border border-zinc-800 px-3 py-1.5">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">Start free. Go deeper when you&apos;re ready.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Free</p>
              <p className="mt-2 text-3xl font-bold text-zinc-50">$0</p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                <li>Resilience assessment</li>
                <li>Overall score</li>
                <li>Biggest vulnerability</li>
                <li>One What If? simulation</li>
                <li>First recommended action</li>
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
                <li>Everything in Free</li>
                <li>Full vulnerability analysis</li>
                <li>All What If? scenarios</li>
                <li>Complete action system</li>
                <li>Resilience history</li>
                <li>Future core features</li>
              </ul>
              <Button asChild className="mt-8 w-full">
                <Link href="/assessment">Become a founding member</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-zinc-500">One payment. No monthly bill.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">FAQ</h2>
          <div className="mt-10 space-y-6">
            {[
              ["What exactly is Tiltshield?", "A personal resilience system. It measures how exposed you are across money, digital life, food, documents, and more — then ranks what to fix first."],
              ["How is my resilience score calculated?", "From your answers across eight categories. Each gap is weighted by impact so the highest-risk dependencies surface first."],
              ["Is this financial advice?", "No. Tiltshield helps you see dependencies and plan practical next steps. It is not regulated financial, legal, or medical advice."],
              ["Does Tiltshield predict disasters?", "No. It does not forecast events. It shows what would break for you if something stopped working — bank, income, phone, and so on."],
              ["What happens to my data?", "In this version, assessment answers stay on your device. We do not sell personal profiles."],
              ["Can I use it without sharing sensitive details?", "Yes. Questions are high-level (e.g. months of savings, not account numbers). You choose how precise to be."],
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
        </div>
      </section>

      <footer className="bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-zinc-50">Tiltshield</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">Know what could break. Fix it before it does.</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><a href="#product" className="hover:text-zinc-200">Overview</a></li>
                <li><Link href="/assessment" className="hover:text-zinc-200">Assessment</Link></li>
                <li><a href="#what-if" className="hover:text-zinc-200">What If?</a></li>
                <li><a href="#pricing" className="hover:text-zinc-200">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Resources</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><a href="#how" className="hover:text-zinc-200">How it works</a></li>
                <li><span className="text-zinc-600">Security</span></li>
                <li><span className="text-zinc-600">FAQ</span></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-600">About</span></li>
                <li><span className="text-zinc-600">Contact</span></li>
                <li><span className="text-zinc-600">Privacy</span></li>
                <li><span className="text-zinc-600">Terms</span></li>
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
