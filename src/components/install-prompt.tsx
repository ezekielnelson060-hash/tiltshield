"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "tiltshield_install_dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const t = window.setTimeout(() => {
      setVisible(true);
    }, 2200);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.clearTimeout(t);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:bottom-6 sm:left-1/2 sm:max-w-md sm:-translate-x-1/2">
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl shadow-black/50">
        <p className="text-sm font-semibold text-zinc-50">
          Add Tiltshield to your home screen
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
          Keep preparation one tap away — score, kits, vendors, and calculators when systems feel uncertain.
        </p>
        {isIOS && !deferred && (
          <p className="mt-2 text-xs text-zinc-500">
            On iPhone: tap <span className="text-zinc-300">Share</span>, then{" "}
            <span className="text-zinc-300">Add to Home Screen</span>.
          </p>
        )}
        <div className="mt-3 flex gap-2">
          {deferred && (
            <Button size="sm" className="flex-1" onClick={install}>
              Install app
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className={deferred ? "" : "flex-1"}
            onClick={dismiss}
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
