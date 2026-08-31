import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
          Tiltshield
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <a href="#product" className="hover:text-zinc-200">
            Product
          </a>
          <a href="#what-if" className="hover:text-zinc-200">
            What If?
          </a>
          <a href="#how" className="hover:text-zinc-200">
            How it works
          </a>
          <a href="#pricing" className="hover:text-zinc-200">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
              <a
                href="#product"
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Product
              </a>
              <a
                href="#what-if"
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                What If?
              </a>
              <a
                href="#how"
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Pricing
              </a>
              <Link
                href="/assessment"
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Log in
              </Link>
            </div>
          </details>
          <Link
            href="/assessment"
            className="hidden text-sm text-zinc-400 hover:text-zinc-200 sm:inline"
          >
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/assessment">Get my score</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
