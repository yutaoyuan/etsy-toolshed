import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createCheckout, PLANS, type PlanKey } from "@/lib/lemonsqueezy";

/**
 * 创建 Lemon Squeezy checkout URL。
 *
 * 仅登录用户可调用。服务端使用 LEMON_SQUEEZY_API_KEY 创建 checkout，
 * URL 返回给前端跳转。
 */

const schema = z.object({
  plan: z.enum(["starter", "pro"]),
});

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ url: string } | { error: string }>> {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Plan must be 'starter' or 'pro'" },
      { status: 400 },
    );
  }

  const plan = parsed.data.plan as PlanKey;
  if (!("variantIdEnv" in PLANS[plan])) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const url = await createCheckout(
      plan,
      data.user.id,
      data.user.email ?? "",
    );
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
