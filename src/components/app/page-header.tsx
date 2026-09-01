"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  showBack?: boolean;
};

export function PageHeader({
  title,
  subtitle,
  backHref,
  showBack = true,
}: Props) {
  const router = useRouter();

  function onBack() {
    if (backHref) {
      router.push(backHref);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/app/overview");
  }

  return (
    <div className="mb-6">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-emerald-400"
          aria-label="Go back"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
  );
}

export function AppTopBar({
  title,
  backHref = "/app/more",
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <Link
        href={backHref}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
        aria-label="Back"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>
      <h1 className="text-lg font-semibold text-zinc-50">{title}</h1>
    </div>
  );
}
