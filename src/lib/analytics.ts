/**
 * Funnel events for growth measurement.
 * Works with window.gtag / dataLayer if present; always logs to a local ring buffer.
 */

export type FunnelEvent =
  | "page_view"
  | "assessment_start"
  | "assessment_complete"
  | "shock_view"
  | "upgrade_click"
  | "checkout_start"
  | "guide_calculator_use"
  | "cta_find_exposure";

type Props = Record<string, string | number | boolean | undefined>;

const BUFFER_KEY = "tiltshield_funnel_log";
const MAX = 40;

function pushLocal(name: FunnelEvent, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(BUFFER_KEY);
    const arr: unknown[] = raw ? JSON.parse(raw) : [];
    arr.push({ name, props, t: Date.now() });
    while (arr.length > MAX) arr.shift();
    localStorage.setItem(BUFFER_KEY, JSON.stringify(arr));
  } catch {
    /* */
  }
}

export function track(name: FunnelEvent, props?: Props) {
  if (typeof window === "undefined") return;
  pushLocal(name, props);

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", name, props || {});
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: name, ...props });
    }
  } catch {
    /* */
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info("[tilt]", name, props || {});
  }
}

export function trackAssessmentStart(source?: string) {
  track("assessment_start", { source: source || "direct" });
}

export function trackAssessmentComplete(score?: number) {
  track("assessment_complete", { score });
}

export function trackShockView(score?: number, days?: number) {
  track("shock_view", { score, days });
}

export function trackUpgradeClick(product: string, surface: string) {
  track("upgrade_click", { product, surface });
}

export function trackCtaFindExposure(surface: string) {
  track("cta_find_exposure", { surface });
}
