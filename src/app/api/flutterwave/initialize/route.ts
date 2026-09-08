import { NextRequest, NextResponse } from "next/server";
import {
  PRODUCTS,
  type ProductId,
  isHouseholdProduct,
  isRecurringProduct,
} from "@/lib/pricing";

const ALLOWED: ProductId[] = [
  "lifetime",
  "family",
  "pro_monthly",
  "pro_annual",
  "family_monthly",
];

/**
 * POST body: { email?, name?, userId?, product?: ProductId }
 * Recurring products bill the listed amount; optional FLUTTERWAVE_PLAN_* for true plans.
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
  let product: ProductId = "pro_monthly";
  let userId = "";
  try {
    const body = await req.json();
    if (body?.email) email = String(body.email);
    if (body?.name) name = String(body.name);
    if (body?.userId) userId = String(body.userId);
    const p = String(body?.product || "") as ProductId;
    if (ALLOWED.includes(p)) product = p;
  } catch {
    /* */
  }

  const catalog = PRODUCTS[product];
  const amount = catalog.amountUsd;
  const currency = process.env.FLUTTERWAVE_CURRENCY || "USD";
  const txRef = `tiltshield_${product}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const planEnv: Partial<Record<ProductId, string | undefined>> = {
    pro_monthly: process.env.FLUTTERWAVE_PLAN_PRO_MONTHLY,
    pro_annual: process.env.FLUTTERWAVE_PLAN_PRO_ANNUAL,
    family_monthly: process.env.FLUTTERWAVE_PLAN_FAMILY_MONTHLY,
  };
  const paymentPlan = isRecurringProduct(product)
    ? planEnv[product]
    : undefined;

  const title =
    product === "family" || product === "family_monthly"
      ? "Tiltshield Family"
      : product === "lifetime"
        ? "Tiltshield Founding Lifetime"
        : "Tiltshield Pro";

  const description = isRecurringProduct(product)
    ? `${catalog.name} — ${catalog.priceLabel}/${catalog.interval === "year" ? "yr" : "mo"}`
    : `${catalog.name} — ${catalog.priceLabel} one-time`;

  try {
    const payload: Record<string, unknown> = {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: `${appUrl}/results?payment=flutterwave&product=${product}`,
      customer: { email, name },
      customizations: {
        title,
        description,
        logo: `${appUrl}/icon-192.png`,
      },
      meta: {
        product: `tiltshield_${product}`,
        user_id: userId || undefined,
        billing: catalog.billing,
        household: isHouseholdProduct(product) ? "1" : "0",
      },
    };
    if (paymentPlan) {
      payload.payment_plan = paymentPlan;
    }

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      return NextResponse.json(
        { error: data?.message || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      link: data.data.link,
      tx_ref: txRef,
      product,
      recurring: isRecurringProduct(product),
    });
  } catch (err) {
    console.error("Flutterwave error", err);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
