import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — TiltShield",
  description: "Personal exposure intelligence. Know what could break before it does.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold text-zinc-50">TiltShield</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Personal exposure intelligence. We measure financial, digital, payment, and food
          dependencies — then show what fails first and what to fix.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          Built for people with income, dependents, and something to lose. Not a prepper costume.
          A continuous readiness system.
        </p>
        <Button asChild className="mt-8">
          <Link href="/assessment">Find your exposure →</Link>
        </Button>
      </article>
    </main>
  );
}
