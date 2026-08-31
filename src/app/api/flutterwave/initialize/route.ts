import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const amount = Number(process.env.FLUTTERWAVE_AMOUNT || "29");
  const currency = process.env.FLUTTERWAVE_CURRENCY || "USD";

  if (!secret) {
    return NextResponse.json(
      { error: "Flutterwave is not configured. Set FLUTTERWAVE_SECRET_KEY in .env.local", demo: true },
      { status: 503 }
    );
  }

  let email = "customer@tiltshield.app";
  let name = "Tiltshield User";
  try {
    const body = await req.json();
    if (body?.email) email = String(body.email);
    if (body?.name) name = String(body.name);
  } catch {}

  const txRef = `tiltshield_lifetime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

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
        redirect_url: `${appUrl}/results?payment=flutterwave`,
        customer: { email, name },
        customizations: {
          title: "Tiltshield Lifetime",
          description: "Full plan unlock \u2014 one-time founding price",
          logo: `${appUrl}/icon-192.png`,
        },
        meta: { product: "tiltshield_lifetime" },
      }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      console.error("Flutterwave init failed", data);
      return NextResponse.json(
        { error: data?.message || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ link: data.data.link, tx_ref: txRef });
  } catch (err) {
    console.error("Flutterwave error", err);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
