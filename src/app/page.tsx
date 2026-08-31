import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-950" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-24 pt-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Personal Independence OS
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl">
          Know what could break.
          <br />
          <span className="text-emerald-400">Fix it before it does.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Answer 10 questions. See your top vulnerabilities. Get one clear move
          every day. No charts for the sake of charts — just what to do next.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/assessment">Start free assessment</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#how">How it works</Link>
          </Button>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Free to start · $29 lifetime founding price · No subscription required
        </p>

        <section id="how" className="mt-24 w-full text-left">
          <h2 className="text-center text-2xl font-semibold text-zinc-50">
            How Tiltshield works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Assess",
                body: "10 questions on money, food, digital, communication, documents, and more.",
              },
              {
                step: "02",
                title: "See the gaps",
                body: "Top 5 vulnerabilities ranked by impact. One free preview; full plan unlocks the rest.",
              },
              {
                step: "03",
                title: "Act daily",
                body: "One concrete move with time estimate and steps. Mark it done. Re-assess later.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="text-xs font-mono text-emerald-500">
                  {item.step}
                </div>
                <h3 className="mt-2 font-semibold text-zinc-50">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-left">
          <h2 className="text-xl font-semibold text-zinc-50">
            What if this stops working tomorrow?
          </h2>
          <p className="mt-3 text-zinc-400">
            Bank down for 72 hours. Phone lost. Income pauses. Food prices
            jump. Tiltshield runs the scenario against your real answers and
            shows the exposure — then the fix.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/assessment">Run my assessment</Link>
            </Button>
          </div>
        </section>

        <footer className="mt-20 text-center text-sm text-zinc-600">
          Tiltshield — readiness without the conspiracy pitch.
        </footer>
      </div>
    </main>
  );
}
