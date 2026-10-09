import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  convertListing,
  type ConverterInput,
  type ConverterResult,
} from "@/lib/converterRules";
import { rateLimit } from "@/lib/rateLimit";

/**
 * Etsy → Shopify listing 转换 API（规则版，单条）
 *
 * 免费版：单条转换。
 * Pro 批量 CSV 上传/导出在 P4 接入订阅权限后实现。
 *
 * 限次：P3 起使用 Supabase usage_logs 持久化限次
 * （匿名 3 次/天/IP，free 10 次/天，starter 100，pro 不限）。
 * 若 Supabase env 未配置，自动回退内存 Map 限次。
 */

const MAX_TAGS = 13;

const convertSchema = z.object({
  etsyTitle: z.string().min(1, "Title is required").max(500, "Title too long"),
  etsyTags: z
    .array(z.string().max(50, "Tag too long"))
    .max(MAX_TAGS, `At most ${MAX_TAGS} tags`),
  etsyDescription: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description too long"),
});

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ConverterResult | { error: string }>> {
  const rl = await rateLimit(req, "convert");
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

  const parsed = convertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const input: ConverterInput = {
    etsyTitle: parsed.data.etsyTitle,
    etsyTags: parsed.data.etsyTags,
    etsyDescription: parsed.data.etsyDescription,
  };

  const result = convertListing(input);
  return NextResponse.json(result);
}
