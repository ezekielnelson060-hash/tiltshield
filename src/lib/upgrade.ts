export type UpgradePayload = {
  title?: string;
  body?: string;
  /** short label for analytics / UI chip */
  feature?: string;
};

const EVENT = "tiltshield:upgrade";

export function openUpgrade(payload: UpgradePayload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: payload }));
}

export function onUpgradeRequest(
  handler: (p: UpgradePayload) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const fn = (e: Event) => {
    const ce = e as CustomEvent<UpgradePayload>;
    handler(ce.detail || {});
  };
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
