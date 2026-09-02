"use client";

import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  showBack?: boolean;
};

/** Premium header — circular back (Guides style) + title inline. */
export function PageHeader({
  title,
  subtitle,
  backHref = "/app/overview",
  showBack = true,
}: Props) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link
            href={backHref}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-zinc-300 transition hover:border-emerald-500/35 hover:bg-emerald-500/10 hover:text-emerald-400"
            aria-label="Go back"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.25}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        )}
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{subtitle}</p>
      )}
    </div>
  );
}

/** Same circular back chrome */
export function AppTopBar({
  title,
  backHref = "/app/more",
}: {
  title: string;
  backHref?: string;
}) {
  return <PageHeader title={title} backHref={backHref} showBack />;
}
