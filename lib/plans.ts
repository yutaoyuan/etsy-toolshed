/**
 * 套餐配置（纯数据，无 node 依赖，可被客户端组件安全导入）。
 * 服务端逻辑（签名校验、创建 checkout）见 lib/lemonsqueezy.ts。
 */

export const PLANS = {
  free: {
    key: "free" as const,
    name: "Free",
    price: 0,
    interval: "forever",
    dailyLimit: 10,
  },
  starter: {
    key: "starter" as const,
    name: "Starter",
    price: 9,
    interval: "month",
    dailyLimit: 100,
    variantIdEnv: "LEMON_SQUEEZY_STARTER_VARIANT_ID",
  },
  pro: {
    key: "pro" as const,
    name: "Pro",
    price: 19,
    interval: "month",
    dailyLimit: -1, // unlimited
    variantIdEnv: "LEMON_SQUEEZY_PRO_VARIANT_ID",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
