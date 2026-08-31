import { createClient } from "@/lib/supabase/client";
import type { TiltSession } from "@/lib/session";

/** Save assessment to Supabase when the user is logged in. Never throws. */
export async function persistAssessmentToCloud(session: TiltSession): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

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
        food_buffer_days: session.answers.food_buffer_days,
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
        }))
      );
    }

    return true;
  } catch (e) {
    console.warn("persistAssessmentToCloud", e);
    return false;
  }
}
