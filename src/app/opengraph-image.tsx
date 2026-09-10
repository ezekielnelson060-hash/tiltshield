export const runtime = "edge";
export const contentType = "image/jpeg";
export const size = { width: 1200, height: 630 };
export const alt = "TiltShield — Know what could break before it does";

/** Serve the real desktop landing screenshot as the OG image */
export default async function Image() {
  const res = await fetch(
    "https://www.tiltshield.xyz/IMG_20260911_001958.jpg",
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    return new Response("Image unavailable", { status: 404 });
  }
  const buf = await res.arrayBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
