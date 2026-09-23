/** Appearance preference for the in-app experience. */

export type ThemeMode = "light" | "dark" | "system";

export const THEME_KEY = "tiltshield_theme";

export function readThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* */
  }
  return "dark";
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyThemeClass(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(mode);
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* */
  }
  try {
    window.dispatchEvent(
      new CustomEvent("tiltshield:theme", { detail: { mode, resolved } })
    );
  } catch {
    /* */
  }
}

export function saveThemeMode(mode: ThemeMode) {
  applyThemeClass(mode);
}
