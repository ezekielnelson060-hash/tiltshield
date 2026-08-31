"use client";

import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function sync() {
      setOffline(!navigator.onLine);
    }
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[70] bg-amber-500 px-3 py-1.5 text-center text-xs font-medium text-zinc-950">
      You&apos;re offline — core checklists and last scores still work from this device.
    </div>
  );
}
