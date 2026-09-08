import type { MetadataRoute } from "next";

const BASE = "https://tiltshield.xyz";

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
    "/guides/phone-lost",
    "/about",
    "/privacy",
    "/terms",
  ];
  return staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/assessment" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/assessment" ? 0.95 : 0.7,
  }));
}
