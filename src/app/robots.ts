import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/assessment",
          "/pricing",
          "/break-point",
          "/what-if",
          "/guides",
          "/about",
          "/privacy",
          "/terms",
        ],
        disallow: ["/app/", "/api/", "/results", "/dashboard"],
      },
    ],
    sitemap: "https://www.tiltshield.xyz/sitemap.xml",
    host: "https://www.tiltshield.xyz",
  };
}
