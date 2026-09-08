import type { MetadataRoute } from "next";

const BASE = "https://www.tiltshield.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/assessment",
    "/pricing",
    "/break-point",
    "/what-if",
    "/guides",
    "/guides/emergency-fund-breakpoint",
    "/guides/bank-outage",
    "/guides/income-loss",
    "/guides/phone-lost",
    "/guides/food-price-increase",
    "/about",
    "/privacy",
    "/terms",
  ];
  return staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/assessment" || path.startsWith("/guides")
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/assessment" || path === "/break-point"
          ? 0.95
          : path.startsWith("/guides")
            ? 0.85
            : 0.7,
  }));
}
