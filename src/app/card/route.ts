import { NextResponse } from "next/server";

/** Redirect to ImageResponse card at route.tsx sibling — keep /card URL stable */
export async function GET(request: Request) {
  const url = new URL("/card.png", request.url);
  return NextResponse.redirect(url, 302);
}
