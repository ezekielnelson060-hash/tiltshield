"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/overview");
  }, [router]);
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
      Opening your plan…
    </main>
  );
}
