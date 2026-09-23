"use client";

import { useEffect } from "react";
import { applyThemeClass, readThemeMode, resolveTheme, type ThemeMode } from "@/lib/theme";

/**
 * Applies saved light/dark/system preference on the document root.
 * Landing can stay dark; app respects Settings.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mode = readThemeMode();
    applyThemeClass(mode);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (readThemeMode() === "system") applyThemeClass("system");
    };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  return <>{children}</>;
}

export function useThemeMode(): {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  resolved: "light" | "dark";
} {
  if (typeof window === "undefined") {
    return { mode: "dark", setMode: () => {}, resolved: "dark" };
  }
  const mode = readThemeMode();
  return {
    mode,
    setMode: (m: ThemeMode) => applyThemeClass(m),
    resolved: resolveTheme(mode),
  };
}
