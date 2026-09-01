import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/flutterwave/webhook
 * Set in Flutterwave dashboard (Live or Test):
 *   URL: https://YOUR_TILTSHIELD_DOMAIN/api/flutterwave/webhook
 *   Secret hash: same value as env FLUTTERWAVE_SECRET_HASH
 */
export async function POST(req: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const incoming = req.headers.get("verif-hash");

  if (secretHash && incoming !== secretHash) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = String(body.event || body["event.type"] || "");
  const data = (body.data || body) as Record<string, unknown>;
  const status = String(data.status || "");
  const meta = (data.meta || {}) as Record<string, unknown>;
  const customer = (data.customer || {}) as Record<string, unknown>;
  const txRef = String(data.tx_ref || data.txRef || "");
  const email = String(customer.email || "").toLowerCase();

  const productRaw = String(meta.product || txRef || "");
  let product: "lifetime" | "family" | null = null;
  if (productRaw.includes("family")) product = "family";
  else if (productRaw.includes("lifetime")) product = "lifetime";

  const ok =
    status === "successful" ||
    event.includes("charge.completed") ||
    event === "charge.completed";

  if (!ok || !product) {
    return NextResponse.json({ received: true, acted: false });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey && email) {
    try {
      const admin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: listed } = await admin.auth.admin.listUsers({ perPage: 200 });
      const user = listed?.users?.find((u) => u.email?.toLowerCase() === email);
      if (user) {
        await admin.from("profiles").upsert(
          {
            id: user.id,
            subscription_status: product === "family" ? "family" : "lifetime",
          },
          { onConflict: "id" }
        );
      }
    } catch (e) {
      console.error("webhook profile update", e);
    }
  }

  return NextResponse.json({ received: true, acted: true, product });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "tiltshield-flutterwave-webhook",
  });
}
