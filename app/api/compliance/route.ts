import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  checkCompliance,
  type AttributionType,
  type ComplianceInput,
  type ComplianceResult,
} from "@/lib/complianceRules";
import { rateLimit } from "@/lib/rateLimit";
import { getComplianceRules } from "@/lib/complianceCache";
import { rewriteDescription } from "@/lib/ai";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Etsy AI 披露合规检查 API。
 *
 * 规则：可调部分（品牌词/AI 披露关键词/阈值）从 Supabase compliance_rules 读取，
 * 带 1 小时内存缓存；Supabase 不可用时回退代码默认值。
 * 判定逻辑（Made by vs Designed by 等）固定在 lib/complianceRules.ts，
 * 每条规则标注 @source 对应 Etsy 官方政策页。
 *
 * 限次：使用 Supabase usage_logs 持久化限次
 * （匿名 3 次/天/IP，free 10 次/天，starter 100，pro 不限）。
 * 若 Supabase env 未配置，自动回退内存 Map 限次。
 *
 * needAi=true 时，若用户为 Pro 且 AI provider/key 已配置，
 * 调用 AI 重写描述并在 fixed_description 中返回；否则 fixed_description 为 null。
 */

const ATTRIBUTION_TYPES = [
  "made_by",
  "designed_by",
  "production_partner",
  "not_listed",
] as const;

const complianceSchema = z.object({
  title: z.string().max(500, "Title too long"),
  description: z.string().max(5000, "Description too long"),
  usesAi: z.boolean(),
  attribution: z.enum(ATTRIBUTION_TYPES),
  needAi: z.boolean().optional().default(false),
});

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ComplianceResult | { error: string }>> {
  const rl = await rateLimit(req, "compliance");
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Daily usage limit reached. Sign up for more, or try again tomorrow.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = complianceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const input: ComplianceInput = {
    title: parsed.data.title,
    description: parsed.data.description,
    usesAi: parsed.data.usesAi,
    attribution: parsed.data.attribution as AttributionType,
  };

  const rules = await getComplianceRules();
  const result = checkCompliance(input, rules);

  // AI 重写：仅 Pro 用户且 needAi=true 时触发
  if (parsed.data.needAi && rl.userId) {
    const admin = createAdminClient();
    if (admin) {
      const { data: userRow } = await admin
        .from("users")
        .select("plan")
        .eq("id", rl.userId)
        .single();
      if (userRow?.plan === "pro") {
        result.fixedDescription = await rewriteDescription({
          input,
          issues: result.issues,
          suggestions: result.suggestions,
        });
      }
    }
  }

  return NextResponse.json(result);
}
