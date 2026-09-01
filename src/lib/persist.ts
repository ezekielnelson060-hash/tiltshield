import { createClient } from "@/lib/supabase/client";
import type { TiltSession, HistoryEntry } from "@/lib/session";
import {
  getActiveMemberId,
  loadFamilyMembers,
  saveFamilyMembers,
  patchMemberCloudId,
  type FamilyMember,
} from "@/lib/family";

function isUuid(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );
}

function resolveMemberUuid(memberId: string): string | null {
  if (memberId === "self") return null;
  const m = loadFamilyMembers().find((x) => x.id === memberId);
  if (m?.cloudId && isUuid(m.cloudId)) return m.cloudId;
  if (isUuid(memberId)) return memberId;
  return null;
}

export async function persistAssessmentToCloud(
  session: TiltSession
): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const memberId = session.memberId || getActiveMemberId();
    const memberUuid = resolveMemberUuid(memberId);

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        assessment_completed: true,
        readiness_score: session.scores.overall,
        display_name: user.email ?? null,
      },
      { onConflict: "id" }
    );

    const { data: assessment, error: aErr } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        emergency_fund_months: session.answers.emergency_fund_months,
        income_sources: session.answers.income_sources,
        has_offline_docs: session.answers.has_offline_docs,
        cloud_dependency: session.answers.cloud_dependency,
        emergency_supply_weeks: session.answers.emergency_supply_weeks,
        offline_contacts: session.answers.offline_contacts,
        phone_backup_plan: session.answers.phone_backup_plan,
        alt_payment_method: session.answers.alt_payment_method,
        monthly_expenses: session.answers.monthly_expenses,
        monthly_income: session.answers.monthly_income,
        food_buffer_days: session.answers.food_buffer_days,
        offline_value_store: session.answers.offline_value_store,
        digital_payment_dependency: session.answers.digital_payment_dependency,
        food_source_diversity: session.answers.food_source_diversity,
        has_med_kit: session.answers.has_med_kit,
        has_local_vendors: session.answers.has_local_vendors,
        has_hard_assets: session.answers.has_hard_assets,
        answers_json: session.answers,
        overall_score: session.scores.overall,
        member_id: memberUuid,
      })
      .select("id")
      .single();

    if (aErr || !assessment) {
      console.warn("assessment insert", aErr?.message);
      return false;
    }

    await supabase.from("category_scores").insert({
      user_id: user.id,
      assessment_id: assessment.id,
      money: session.scores.money,
      food: session.scores.food,
      digital: session.scores.digital,
      communication: session.scores.communication,
      documents: session.scores.documents,
      skills: session.scores.skills,
      home: session.scores.home,
      emergency: session.scores.emergency,
      overall: session.scores.overall,
    });

    if (session.vulnerabilities?.length) {
      await supabase.from("vulnerabilities").insert(
        session.vulnerabilities.map((v, i) => ({
          user_id: user.id,
          assessment_id: assessment.id,
          rank: i + 1,
          category: v.category,
          title: v.title,
          severity: v.severity,
          current_state: v.current_state ?? null,
          next_action: v.next_action ?? null,
          target: v.target ?? null,
          difficulty: v.difficulty ?? null,
          impact: v.impact ?? null,
          is_resolved: false,
        }))
      );
    }

    return true;
  } catch (e) {
    console.warn("persistAssessmentToCloud", e);
    return false;
  }
}

export async function loadHistoryFromCloud(): Promise<HistoryEntry[]> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("category_scores")
      .select("overall, money, food, digital, emergency, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: true })
      .limit(48);

    if (error || !data) return [];

    return data.map((row) => ({
      date: row.updated_at || new Date().toISOString(),
      overall: row.overall ?? 0,
      money: row.money ?? undefined,
      food: row.food ?? undefined,
      digital: row.digital ?? undefined,
      emergency: row.emergency ?? undefined,
      source: "cloud" as const,
    }));
  } catch {
    return [];
  }
}

export async function syncFamilyToCloud(): Promise<FamilyMember[]> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return loadFamilyMembers();

    const members = loadFamilyMembers();

    for (const m of members) {
      if (m.id === "self") continue;

      if (m.cloudId && isUuid(m.cloudId)) {
        await supabase.from("family_members").upsert({
          id: m.cloudId,
          owner_id: user.id,
          name: m.name,
          relationship: m.relationship,
          is_primary: m.isPrimary,
          readiness_score: m.readinessScore ?? 0,
        });
        continue;
      }

      const { data, error } = await supabase
        .from("family_members")
        .insert({
          owner_id: user.id,
          name: m.name,
          relationship: m.relationship,
          is_primary: m.isPrimary,
          readiness_score: m.readinessScore ?? 0,
        })
        .select("id")
        .single();

      if (!error && data?.id) {
        patchMemberCloudId(m.id, data.id as string);
      }
    }

    return loadFamilyMembers();
  } catch (e) {
    console.warn("syncFamilyToCloud", e);
    return loadFamilyMembers();
  }
}

export async function loadFamilyFromCloud(): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true });

    if (error || !data?.length) return;

    const local = loadFamilyMembers();
    const self = local.find((m) => m.id === "self") || {
      id: "self",
      name: "Me",
      relationship: "self" as const,
      isPrimary: true,
    };

    const merged: FamilyMember[] = [self];
    for (const r of data) {
      const cloudId = r.id as string;
      const existing = local.find((m) => m.cloudId === cloudId);
      merged.push({
        id: existing?.id || cloudId,
        cloudId,
        name: r.name as string,
        relationship: (r.relationship as FamilyMember["relationship"]) || "other",
        isPrimary: !!r.is_primary,
        readinessScore: r.readiness_score ?? 0,
      });
    }
    saveFamilyMembers(merged);
  } catch {
    /* */
  }
}

export async function setSubscriptionOnProfile(
  status: "lifetime" | "family" | "active"
): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .upsert(
        { id: user.id, subscription_status: status },
        { onConflict: "id" }
      );
  } catch {
    /* */
  }
}
