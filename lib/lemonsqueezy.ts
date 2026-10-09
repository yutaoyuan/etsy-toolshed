import crypto from "node:crypto";
import { PLANS, type PlanKey } from "@/lib/plans";

/**
 * Lemon Squeezy 集成（服务端专用）
 *
 * 安全规则：
 * - 所有密钥只从 process.env 读取，源码不写真实值。
 * - webhook 签名校验、创建 checkout 等只在服务端执行。
 * - 客户端组件只允许 import @/lib/plans（纯数据），禁止 import 此文件。
 *
 * 需人工在 Lemon Squeezy 后台配置：
 * 1. 创建 Store，拿到 LEMON_SQUEEZY_STORE_ID
 * 2. 创建两个产品/variant：Starter ($9/mo)、Pro ($19/mo)，拿到 variant ID
 * 3. Settings → API 生成 LEMON_SQUEEZY_API_KEY
 * 4. Settings → Webhooks 添加 https://你的域名/api/ls/webhook，勾选订阅事件，拿到 LEMON_SQUEEZY_WEBHOOK_SECRET
 * 5. 把以上值填入 .env.local / Vercel 环境变量
 */

export { PLANS };
export type { PlanKey };

/**
 * 校验 Lemon Squeezy webhook 签名。
 * 签名 = HMAC-SHA256(原始请求体, WEBHOOK_SECRET)，hex 编码。
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  // 恒定时间比较，避免时序攻击
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

/**
 * 根据 plan 取对应的 Lemon Squeezy variant ID（从 env 读取）。
 */
export function getVariantId(plan: PlanKey): string | null {
  const planConfig = PLANS[plan];
  if (!("variantIdEnv" in planConfig)) return null;
  return process.env[planConfig.variantIdEnv] ?? null;
}

interface LemonSqueezyCheckoutResponse {
  data: {
    attributes: {
      url: string;
    };
  };
}

/**
 * 创建 Lemon Squeezy checkout，返回支付页 URL。
 * 仅在服务端调用，使用 LEMON_SQUEEZY_API_KEY。
 * 通过 custom_data 把 user_id 传给 webhook，用于关联订阅与用户。
 */
export async function createCheckout(
  plan: PlanKey,
  userId: string,
  email: string,
): Promise<string> {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  const variantId = getVariantId(plan);

  if (!apiKey || !storeId || !variantId) {
    throw new Error(
      "Lemon Squeezy is not configured. Set LEMON_SQUEEZY_API_KEY, LEMON_SQUEEZY_STORE_ID, and the variant ID env vars.",
    );
  }

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email,
            custom: {
              user_id: userId,
              plan,
            },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/pricing?status=success`,
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: storeId },
          },
          variant: {
            data: { type: "variants", id: variantId },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lemon Squeezy checkout failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as LemonSqueezyCheckoutResponse;
  return json.data.attributes.url;
}

/**
 * 根据 variant ID 反查 plan（webhook 中用）。
 */
export function planFromVariantId(variantId: string): PlanKey | null {
  for (const key of Object.keys(PLANS) as PlanKey[]) {
    const cfg = PLANS[key];
    if ("variantIdEnv" in cfg) {
      const id = process.env[cfg.variantIdEnv];
      if (id && id === variantId) return key;
    }
  }
  return null;
}
