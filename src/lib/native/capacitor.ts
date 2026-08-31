/** Safe Capacitor helpers — no-ops on web */

export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor?.isNativePlatform?.();
}

export async function initNativeShell() {
  if (!isNativeApp()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#09090b" });
  } catch {
    /* plugin not available */
  }
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    /* */
  }
}
