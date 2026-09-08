import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "What Happens If You Lose Your Phone? Your Digital Life Backup Plan | TiltShield",
  description:
    "Your phone may be the key to your bank, email, identity and communication. Here's how to reduce your digital dependency before your phone disappears.",
};

export default function PhoneLostGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Guide · Digital exposure
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What Happens If You Lose Your Phone?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Losing your phone used to mean losing a phone. Now it can mean losing access to a
          significant part of your digital life.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Your phone might be connected to banking, email, authentication, password managers,
          messaging, social accounts, work, cloud storage, photos, digital documents, and travel
          bookings. The hardware is replaceable. The access chain is what matters.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Find your critical dependencies
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Ask yourself: if I couldn't use my phone for the next 24 hours, what would I
          immediately lose access to? Make a list. Then identify services that are genuinely
          important.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="font-semibold text-zinc-100">Financial</span> — primary bank, payment
            apps, investment accounts
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="font-semibold text-zinc-100">Identity</span> — email, password manager,
            authentication apps
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="font-semibold text-zinc-100">Communication</span> — family, work,
            important contacts
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="font-semibold text-zinc-100">Information</span> — documents, travel
            information, critical records
          </li>
        </ul>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          You may discover that one device sits in the middle of dozens of important systems.
          That's a single point of failure.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Your phone isn't the vulnerability
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          The vulnerability is dependency concentration. If every important account can be
          recovered through another secure method, losing the phone becomes an inconvenience. If
          losing the phone also means losing authentication, recovery codes, contacts and account
          access, the same event becomes much more disruptive. The difference is preparation.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Build a recovery path</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          For critical accounts, understand how recovery works, what backup authentication
          methods exist, where recovery codes are stored, which accounts depend on your phone
          number, which services require your primary device, and how you would contact important
          people without your normal phone. The objective isn't a complicated backup system.
          It's ensuring one lost object doesn't become a chain reaction — including into{" "}
          <Link href="/guides/bank-outage" className="text-emerald-400 hover:text-emerald-300">
            banking access
          </Link>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Test your digital life</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Put your phone aside and ask: could I still access my money, contact someone important,
          recover my primary email, authenticate into critical accounts, retrieve important
          documents, prove my identity where necessary? You don't have to lock yourself out.
          You're testing the architecture of your digital life.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Your digital break point</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Every dependency has a failure cost. For some people, losing a phone is annoying. For
          others it could disrupt banking → work → communication → identity → payments. TiltShield
          helps identify where those chains exist so you can address the highest-impact weaknesses
          first. Your phone should be a tool — not the single key to your entire life.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/assessment">Check your digital exposure →</Link>
        </Button>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Related
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/guides/bank-outage" className="text-emerald-400 hover:text-emerald-300">
                Bank outage for 72 hours
              </Link>
            </li>
            <li>
              <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
                What is a break point?
              </Link>
            </li>
            <li>
              <Link href="/what-if" className="text-emerald-400 hover:text-emerald-300">
                What If? scenarios
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
