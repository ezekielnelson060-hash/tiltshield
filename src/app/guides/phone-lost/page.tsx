import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Lose Your Phone — Digital Break Point | TiltShield",
  description:
    "What happens if you lose your phone today? Banking, 2FA, email, passwords, travel.",
};

const CHECKS = [
  "Banking apps — second device or branch fallback",
  "2FA — authenticator backup codes printed offline",
  "Email — password known without the phone",
  "Password manager — recovery without the device",
  "Travel tickets / boarding passes offline",
  "Emergency contacts written somewhere non-digital",
  "Identity / government apps with alternate access",
];

export default function PhoneLostGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Digital · Single point of failure
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          What happens if you lose your phone today?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Your phone isn&apos;t just a phone anymore. It&apos;s an access key to your life. One
          device. One battery. One thief. One drop into water.
        </p>

        <p className="mt-8 text-sm font-semibold text-zinc-200">Checklist</p>
        <ul className="mt-3 space-y-2">
          {CHECKS.map((c) => (
            <li
              key={c}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-zinc-300"
            >
              {c}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-zinc-400">
          If recovery depends on the same phone, your digital break point is zero days.
        </p>

        <Button asChild size="lg" className="mt-6">
          <Link href="/assessment">Run the scenario →</Link>
        </Button>
      </article>
    </main>
  );
}
