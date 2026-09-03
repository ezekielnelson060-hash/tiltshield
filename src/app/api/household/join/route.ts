import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * POST { code, name?, relationship? }
 * Joiner must be logged in. Looks up owner by household_code (service role),
 * inserts family_members under owner.
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon || !service) {
    return NextResponse.json(
      { error: "Server not configured for household join" },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to join a household" }, { status: 401 });
  }

  let code = "";
  let name = user.email?.split("@")[0] || "Member";
  let relationship = "other";
  try {
    const body = await req.json();
    code = String(body?.code || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    if (body?.name) name = String(body.name).slice(0, 40);
    if (body?.relationship) relationship = String(body.relationship).slice(0, 20);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (code.length < 4) {
    return NextResponse.json({ error: "Enter a valid household code" }, { status: 400 });
  }

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: owner } = await admin
    .from("profiles")
    .select("id, household_code, display_name")
    .eq("household_code", code)
    .maybeSingle();

  if (!owner) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  if (owner.id === user.id) {
    return NextResponse.json({ error: "That is your own household code" }, { status: 400 });
  }

  // Avoid duplicate name rows for same owner + similar name (soft)
  const { data: existing } = await admin
    .from("family_members")
    .select("id")
    .eq("owner_id", owner.id)
    .eq("name", name)
    .limit(1);

  if (existing?.length) {
    return NextResponse.json({
      ok: true,
      already: true,
      ownerId: owner.id,
      memberId: existing[0].id,
    });
  }

  const { data: row, error } = await admin
    .from("family_members")
    .insert({
      owner_id: owner.id,
      name,
      relationship,
      is_primary: false,
      readiness_score: 0,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    ownerId: owner.id,
    memberId: row?.id,
    ownerName: owner.display_name || "Household",
  });
}
