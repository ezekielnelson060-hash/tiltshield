import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const transactionId = req.nextUrl.searchParams.get("transaction_id");

  if (!secret) {
    return NextResponse.json({ error: "Flutterwave not configured" }, { status: 503 });
  }

  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const data = await res.json();

    if (data.status === "success" && data.data?.status === "successful") {
      return NextResponse.json({
        paid: true,
        amount: data.data.amount,
        currency: data.data.currency,
        email: data.data.customer?.email,
      });
    }

    return NextResponse.json({ paid: false, raw: data }, { status: 402 });
  } catch (err) {
    console.error("Flutterwave verify error", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
