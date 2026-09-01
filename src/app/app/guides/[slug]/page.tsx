"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getGuide } from "@/lib/guides";
import { Button } from "@/components/ui/button";

export default function GuideDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Guide not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/app/guides">All guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
      <Link href="/app/guides" className="text-xs text-zinc-500 hover:text-zinc-300">
        ← Guides
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">{guide.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">{guide.blurb}</p>
      </div>
      <ol className="list-decimal space-y-4 pl-5">
        {guide.body.map((step, i) => (
          <li key={i} className="text-sm leading-relaxed text-zinc-300">
            {step}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2 pt-4">
        <Button asChild size="sm">
          <Link href="/app/prepare">Open Prepare</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/app/actions">Today&apos;s actions</Link>
        </Button>
      </div>
    </div>
  );
}
