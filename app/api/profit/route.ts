import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateProfit,
  type CountryCode,
  type ProfitInput,
  type ProfitResult,
} from "@/lib/etsyFees";
import { rateLimit } from "@/lib/rateLimit";
import { getFeeConfig } from "@/lib/feeCache";

/**
 * 利润计算 API
 *
 * 费率：优先从 Supabase fee_rates (status=active) 读取，带 1 小时内存缓存；
 * Supabase 未配置或无 active 行时回退到 lib/etsyFees.ts 默认值。
 *
 * 限次：P3 起使用 Supabase usage_logs 持久化限次
 * （匿名 3 次/天/IP，free 10 次/天，starter 100，pro 不限）。
 * 若 Supabase env 未配置，自动回退内存 Map 限次（本地开发用）。
 */

const COUNTRY_CODES = ["US", "UK", "CA", "EU", "AU"] as const;

const profitSchema = z.object({
  salePrice: z.number().min(0, "Sale price cannot be negative"),
  shipping: z.number().min(0, "Shipping cannot be negative"),
  cost: z.number().min(0, "Cost cannot be negative"),
  labor: z.number().min(0, "Labor cannot be negative"),
  packaging: z.number().min(0, "Packaging cannot be negative"),
  country: z.enum(COUNTRY_CODES),
  offsiteAds: z.boolean(),
  highVolume: z.boolean(),
  salesVolume: z.number().int().min(0, "Sales volume cannot be negative"),
});

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ProfitResult | { error: string }>> {
  const rl = await rateLimit(req, "profit");
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

  const parsed = profitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const country = parsed.data.country as CountryCode;
  const feeConfig = await getFeeConfig(country);

  const input: ProfitInput = {
    salePrice: parsed.data.salePrice,
    shipping: parsed.data.shipping,
    cost: parsed.data.cost,
    labor: parsed.data.labor,
    packaging: parsed.data.packaging,
    country,
    offsiteAds: parsed.data.offsiteAds,
    highVolume: parsed.data.highVolume,
    salesVolume: parsed.data.salesVolume,
  };

  const result = calculateProfit(input, feeConfig);
  return NextResponse.json(result);
}
