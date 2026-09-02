import { NextRequest, NextResponse } from "next/server";

/**
 * POST body: { email?, name?, product?: "lifetime" | "family" }
 * lifetime = $29 one-time (individual full access)
 * family = $49 one-time household (premium + multi-member profiles)
 * Override with FLUTTERWAVE_AMOUNT / FLUTTERWAVE_FAMILY_AMOUNT
 */
export async function POST(req: NextRequest) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Flutterwave is not configured. Set FLUTTERWAVE_SECRET_KEY and NEXT_PUBLIC_APP_URL on Vercel.",
      },
      { status: 503 }
    );
  }

  let email = "customer@tiltshield.app";
  let name = "Tiltshield User";
  let product: "lifetime" | "family" = "lifetime";
  try {
    const body = await req.json();
    if (body?.email) email = String(body.email);
    if (body?.name) name = String(body.name);
    if (body?.product === "family") product = "family";
  } catch {
    /* */
  }

  const amount =
    product === "family"
      ? Number(process.env.FLUTTERWAVE_FAMILY_AMOUNT || "49")
      : Number(process.env.FLUTTERWAVE_AMOUNT || "29");
  const currency = process.env.FLUTTERWAVE_CURRENCY || "USD";
  const txRef = `tiltshield_${product}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: `${appUrl}/results?payment=flutterwave&product=${product}`,
        customer: { email, name },
        customizations: {
          title:
            product === "family"
              ? "Tiltshield Family"
              : "Tiltshield Lifetime",
          description:
            product === "family"
              ? "Household plan — premium + up to 6 profiles ($49)"
              : "Individual lifetime — full tools ($29)",
          logo: `${appUrl}/icon-192.png`,
        },
        meta: { product: `tiltshield_${product}` },
      }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return NextResponse.json(
        { error: data?.message || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ link: data.data.link, tx_ref: txRef, product });
  } catch (err) {
    console.error("Flutterwave error", err);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
