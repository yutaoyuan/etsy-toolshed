import { createClient } from "@/lib/supabase/server";
import PricingContent from "@/components/pages/PricingContent";
import { pageMetadata } from "@/lib/i18n/server";
import type { PlanKey } from "@/lib/plans";

export const generateMetadata = () => pageMetadata("pricing", "/pricing");

export default async function PricingPage() {
  const supabase = await createClient();

  let currentPlan: PlanKey = "free";
  let email: string | null = null;

  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      email = data.user.email ?? null;
      const { data: userRow } = await supabase
        .from("users")
        .select("plan")
        .eq("id", data.user.id)
        .single();
      currentPlan = (userRow?.plan as PlanKey) ?? "free";
    }
  }

  return <PricingContent currentPlan={currentPlan} email={email} />;
}

