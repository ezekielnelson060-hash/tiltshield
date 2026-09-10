import { NextResponse } from "next/server";

/** Share thumbnail = real desktop landing photo */
export function GET(request: Request) {
  return NextResponse.redirect(
    new URL("/IMG_20260911_001958.jpg", request.url),
    302
  );
}
