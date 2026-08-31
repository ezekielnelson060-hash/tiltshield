"use client";

import { useEffect } from "react";
import { initNativeShell } from "@/lib/native/capacitor";

export function NativeInit() {
  useEffect(() => {
    void initNativeShell();
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
