import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  planFromVariantId,
  verifyWebhookSignature,
  type PlanKey,
} from "@/lib/lemonsqueezy";

/**
 * Lemon Squeezy webhook 接收端。
 *
 * 1. 校验 X-Signature 签名（HMAC-SHA256，密钥来自 env）
 * 2. 处理订阅事件：created / updated / cancelled / expired
 * 3. 写入 subscriptions 表，并同步更新 users.plan（供限次使用）
 *
 * 注意：必须用原始请求体（raw text）验签，不能用解析后的 JSON。
 */

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    meta?: { event_name?: string; custom_data?: { user_id?: string } };
    data?: {
      id?: string;
      attributes?: {
        variant_id?: number;
        status?: string;
        renews_at?: string | null;
        ends_at?: string | null;
        user_email?: string;
      };
    };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  if (!eventName) {
    return NextResponse.json({ error: "Missing event_name" }, { status: 400 });
  }

  // 只处理订阅相关事件
  const handledEvents = [
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "subscription_expired",
  ];
  if (!handledEvents.includes(eventName)) {
    // 非订阅事件直接返回 200，不处理
    return NextResponse.json({ received: true });
  }

  const subId = payload.data?.id;
  const attrs = payload.data?.attributes ?? {};
  if (!subId) {
    return NextResponse.json({ error: "Missing subscription id" }, { status: 400 });
  }

  // 定位用户：优先 custom_data.user_id，回退按 email 查
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }

  let userId: string | null = payload.meta?.custom_data?.user_id ?? null;
  if (!userId && attrs.user_email) {
    const { data: userRow } = await admin
      .from("users")
      .select("id")
      .eq("email", attrs.user_email)
      .single();
    userId = userRow?.id ?? null;
  }
  if (!userId) {
    // 无法关联用户，返回 200 避免 LS 重试
    return NextResponse.json({ received: true, skipped: "no_user" });
  }

  // 确定 plan：active 按 variant 映射；cancelled/expired 降为 free
  let plan: PlanKey = "free";
  const status = attrs.status;
  if (status === "active" && attrs.variant_id) {
    const matched = planFromVariantId(String(attrs.variant_id));
    if (matched) plan = matched;
  }

  // upsert subscriptions
  await admin.from("subscriptions").upsert(
    {
      id: subId,
      user_id: userId,
      status: status ?? "unknown",
      plan,
      renews_at: attrs.renews_at ?? null,
      ends_at: attrs.ends_at ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  // 同步 users.plan（限次读取此字段）
  await admin.from("users").update({ plan }).eq("id", userId);

  return NextResponse.json({ received: true, plan });
}
