import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isRecurringProduct, type ProductId } from "@/lib/pricing";

/**
 * POST /api/stripe/checkout
 * body: { email?, product?: ProductId }
 *
 * Env price IDs:
 *   STRIPE_PRICE_ID_PRO_MONTHLY
 *   STRIPE_PRICE_ID_PRO_ANNUAL
 *   STRIPE_PRICE_ID_FAMILY_MONTHLY
 *   STRIPE_PRICE_ID_LIFETIME
 *   STRIPE_PRICE_ID_FAMILY
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!secret) {
    return NextResponse.json(
      {
        error: "Stripe is not configured. Set STRIPE_SECRET_KEY.",
        demo: true,
      },
      { status: 503 }
    );
  }

  let email: string | undefined;
  let product: ProductId = "pro_monthly";
  try {
    const body = await req.json();
    email = body?.email;
    const p = String(body?.product || "pro_monthly") as ProductId;
    if (
      [
        "pro_monthly",
        "pro_annual",
        "family_monthly",
        "lifetime",
        "family",
      ].includes(p)
    ) {
      product = p;
    }
  } catch {
    /* */
  }

  const priceMap: Partial<Record<ProductId, string | undefined>> = {
    pro_monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
    pro_annual: process.env.STRIPE_PRICE_ID_PRO_ANNUAL,
    family_monthly: process.env.STRIPE_PRICE_ID_FAMILY_MONTHLY,
    lifetime: process.env.STRIPE_PRICE_ID_LIFETIME,
    family: process.env.STRIPE_PRICE_ID_FAMILY,
  };

  const priceId = priceMap[product];
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Missing Stripe price for ${product}. Set the matching STRIPE_PRICE_ID_* env.`,
        product,
        demo: true,
      },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const mode = isRecurringProduct(product) ? "subscription" : "payment";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/results?unlocked=1&product=${product}`,
      cancel_url: `${appUrl}/results?canceled=1`,
      customer_email: email,
      metadata: {
        product: `tiltshield_${product}`,
        billing: mode === "subscription" ? "recurring" : "one_time",
      },
      ...(mode === "subscription"
        ? {
            subscription_data: {
              metadata: { product: `tiltshield_${product}` },
            },
          }
        : {}),
    });

    return NextResponse.json({ url: session.url, product, mode });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
