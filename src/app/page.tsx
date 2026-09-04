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
          <div className="mb-6 flex justify-center">
            <img src="/icon-192.png" alt="Tiltshield" className="h-14 w-14 rounded-2xl shadow-lg shadow-emerald-900/40" />
          </div>
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
            Tiltshield starts from your real income, maps what could break, and helps you prepare — buffers, kits, local resources, and clear{" "}
            <span className="text-zinc-200">what if</span> plans — before you even need them.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-w-[220px] shadow-lg shadow-emerald-900/30">
              <Link href="/assessment">Measure my exposure</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#break-point">What is a break point?</a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-zinc-500">
            The assessment reveals vulnerabilities. Once you see yours, you can't unsee it.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/40">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Economic, medical, and social disruptions reveal themselves before they happen.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-zinc-400">
            If you watch the news, films, and podcasts from people you trust, you already know: you can have money in an account, a credit score, and a grocery app — and still be unable to use them because of an outage or a policy.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base font-medium text-zinc-200">
            If you get cut off from one or all of these overnight, how long can you survive?
          </p>
        </div>
      </section>

      <section id="break-point" className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Example profile · not live data</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50 sm:text-4xl">You think you are fine.</h2>
          <p className="mt-2 text-center text-lg text-zinc-400">Your break point might disagree.</p>

          <div className="mx-auto mt-10 max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40">
            <video className="aspect-video w-full bg-black object-cover" controls playsInline preload="metadata" poster="/icon-512.png">
              <source src="/media/tiltshield-demo.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400/90">Exposure</p>
            <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-zinc-50">
              67 <span className="text-2xl font-medium text-zinc-500">/ 100</span>
            </p>
            <p className="mt-3 text-sm text-zinc-400">You have 4 significant dependencies.</p>
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400/90">Your weakest point</p>
              <p className="mt-2 text-xl font-semibold text-zinc-50">🔴 Financial · 31 days</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Your current reserves cover approximately 31 days of essential expenses if primary income stops and spend stays the same.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">Digital break point</p>
                <p className="mt-1 text-lg font-bold text-red-400">0 days</p>
                <p className="mt-1 text-xs text-zinc-500">No offline path to critical accounts</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">Payment break point</p>
                <p className="mt-1 text-lg font-bold text-amber-400">24 hours</p>
                <p className="mt-1 text-xs text-zinc-500">Single payment method on file</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-zinc-500">What happens next?</p>
            <Button asChild className="mt-3 w-full sm:w-auto">
              <Link href="/assessment">Run the scenario →</Link>
            </Button>
          </div>

          <p className="mx-auto mt-8 max-w-lg text-center text-sm leading-relaxed text-zinc-500">
            Once you see your break point you cannot pretend everything is fine — that's when preparation gets real.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Break point is not a metaphor.</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Your financial break point is the day cash reserves hit zero if primary income disappears or an enforced policy locks you out and expenses stay unchanged. Your digital break point is how long you keep operating without your phone and access to the internet. Your payment break point is how long everyday purchases survive if one or more rails fail.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Most people have never run the math. They feel busy, employed, and online — and confuse that with being hard to break.
          </p>
          <div className="mt-10 space-y-4">
            {[
              ["Financial break point", "If income stops or access is locked and spend stays the same, reserves reach zero in N days."],
              ["Digital break point", "Hours or days until critical accounts are unreachable without the phone and the open internet."],
              ["Payment break point", "How long you can still buy food and fuel if one or more payment methods die."],
              ["Food break point", "Days of meals you already eat toward a full year — not fantasy stockpiles you will never touch."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-4">
                <p className="text-sm font-semibold text-zinc-100">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">You need a guy for everything.</h2>
          <p className="mt-2 text-lg text-zinc-400">Real contacts and addresses when supply runs low.</p>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Locally and across borders: if you don't have a guy for everything, you don't have control over your life. You can get disappointed, stuck, and hopeless when one or more sources of livelihood shut down — and still be unable to get what you need.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            A guy for organic food, medicine, shelter, cash transactions, raw assets — at your beck and call — is how you move from random citizen to harder to break, kill, or control. You already stepped up and took control.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {["Organic food & markets", "Medicine & clinics", "Shelter paths", "Cash transactions", "Hardware & power", "Raw assets (gold)"].map((item) => (
              <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm font-medium text-zinc-200">{item}</div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            City & nation map for near you. Global places when borders matter. Built for a full year of access, not a weekend kit.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/30">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Hope is not a strategy. Preparation is.</h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Daily timeless intel and a one-year preparation stack are for people who refuse to stay vulnerable. They own access to the update that matters and decide before the crowd.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Desperate people attract predators because they are exposed. They failed to plan, own, control, and stack when they first got the signal that it would rain.
          </p>
        </div>
      </section>

      <section id="pricing" className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Pricing</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">Measure first. Unlock the full year stack when you are ready.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Free</p>
              <p className="mt-2 text-3xl font-bold text-zinc-50">$0</p>
              <p className="mt-1 text-sm text-zinc-500">Exposure map · break points</p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-400">
                <li>Nine-question exposure assessment</li>
                <li>Financial, digital, payment, food break points</li>
                <li>City / nation nearby map</li>
                <li>Core 1-year plan outline</li>
              </ul>
              <Button asChild className="mt-8 w-full" variant="outline">
                <Link href="/assessment">Measure my exposure</Link>
              </Button>
            </div>
            <div className="relative rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-7 shadow-lg shadow-emerald-900/20">
              <p className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950">Full access</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Lifetime</p>
              <p className="mt-2 text-3xl font-bold text-zinc-50">$29 <span className="text-base font-medium text-zinc-500">one-time</span></p>
              <p className="mt-1 text-sm text-zinc-400">Individual · full tools for a year and beyond</p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                <li>Everything in Free</li>
                <li>Full What If scenarios</li>
                <li>Document vault + offline value</li>
                <li>Progress history & re-assessment</li>
                <li>Live intel tied to your gaps</li>
                <li>Year stock + global places</li>
              </ul>
              <Button asChild className="mt-8 w-full">
                <Link href="/assessment">Start free, unlock later</Link>
              </Button>
              <p className="mt-4 text-center text-xs text-zinc-500">Household · up to 6 profiles · $49 lifetime</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold text-zinc-50">Measure first. Spend second.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400/80">Don't</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li>Buy a year of gear before you know your vulnerabilities</li>
                <li>Trust a single bank app as your plan</li>
                <li>Wait for the headline to start counting days</li>
                <li>Confuse a full fridge with a food break point</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Do</p>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-200">
                <li>Run the exposure map test</li>
                <li>Read your break points out loud</li>
                <li>Fix the shortest clock first</li>
                <li>Know one place for cash, meds, food, power and more</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500">Don't pay to discover your weakness in a crisis. Use an afternoon to measure it now.</p>
        </div>
      </section>

      <section id="how" className="border-b border-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">How it works</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-zinc-50">Three steps. That's it.</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Map your exposure", "Test from take-home income to offline docs. No theatre. Just the inputs that set your clocks."],
              ["02", "See the break points", "Financial. Digital. Payment. Food. The vulnerable one reveals itself. Then you build the safety net."],
              ["03", "Close the shortest clock", "Places near you, one-year stock, intel tied to your vulnerabilities. Fix what fails first. Then the next one."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
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
          <h2 className="text-center text-3xl font-semibold text-zinc-50">What's inside</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-400">Built for a full year of preparation — not a 72-hour go-bag fantasy.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Exposure profile", "One number and the dependencies behind it — not a wellness badge."],
              ["Break points", "Financial, digital, payment, food — clocks you can actually move."],
              ["City & nation map", "Pharmacies, cash, markets, hardware — places that still work when apps lag."],
              ["Global places", "Suppliers and brands when local is not enough."],
              ["Year stock", "Food, cash, meds, power, docs — ticked only when true in real life."],
              ["Live intel strip", "World → your exposure → the action that matters for your gaps."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-sm font-semibold text-zinc-50">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-900/25">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-semibold text-zinc-50">“But I already know where the risks are.”</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Maybe. Do you know how many days of essentials you actually hold? How many payment rails survive a single outage or policy enforcement? Whether your household can prove identity offline? Which city-scale places are still open if delivery stops?
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">That is the difference between sensing risk and measuring exposure.</p>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <img src="/icon-192.png" alt="" className="mx-auto mb-6 h-12 w-12 rounded-xl" />
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Find out how exposed you are.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
            Test. A break point you will remember. A map of what to fix before the world tests it for you.
          </p>
          <Button asChild size="lg" className="mt-8 min-w-[220px] shadow-lg shadow-emerald-900/30">
            <Link href="/assessment">Measure my exposure</Link>
          </Button>
          <p className="mt-5 text-sm text-zinc-500">Free to start. No credit card. No soft speech.</p>
        </div>
      </section>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <img src="/icon-192.png" alt="" className="h-8 w-8 rounded-lg" />
                <span className="text-sm font-semibold text-zinc-100">Tiltshield</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">Measure exposure. Close the shortest clock. Prepare for a year.</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/assessment" className="hover:text-zinc-200">Assessment</Link></li>
                <li><Link href="/app/overview" className="hover:text-zinc-200">App</Link></li>
                <li><a href="#pricing" className="hover:text-zinc-200">Pricing</a></li>
                <li><a href="#how" className="hover:text-zinc-200">How it works</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/login" className="hover:text-zinc-200">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-zinc-200">Sign up</Link></li>
                <li><Link href="/assessment" className="hover:text-zinc-200">Start free</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-zinc-200">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-zinc-200">Terms</Link></li>
                <li><a href="mailto:hello@tiltshield.app" className="hover:text-zinc-200">Contact</a></li>
              </ul>
            </div>
          </div>
          <p className="mt-10 border-t border-zinc-900 pt-6 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} Tiltshield. Measure exposure. Prepare for a year.
          </p>
        </div>
      </footer>
    </main>
  );
}
