import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * 统一限次：优先用 Supabase usage_logs，env 未配置时回退内存 Map。
 *
 * 限次策略（按 endpoint，按天）：
 * - 匿名（未登录）：3 次/天/IP
 * - free：10 次/天
 * - starter：100 次/天
 * - pro：不限
 *
 * P3：所有写入用 service role（绕过 RLS）。
 * P4：Lemon Squeezy webhook 把订阅 plan 同步到 users.plan，限次直接读 users.plan。
 */

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  starter: 100,
  pro: -1, // -1 = unlimited
};
const ANON_LIMIT = 3;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  userId: string | null;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]?.trim() ?? "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---------- 内存回退（Supabase env 未配置时使用） ----------
interface MemEntry {
  count: number;
  date: string; // YYYY-MM-DD
}
const memStore = new Map<string, MemEntry>();

function rateLimitInMemory(
  key: string,
  limit: number,
): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().slice(0, 10);
  const entry = memStore.get(key);
  if (!entry || entry.date !== today) {
    memStore.set(key, { count: 1, date: today });
    return { allowed: true, remaining: Math.max(0, limit - 1) };
  }
  if (limit === -1) {
    entry.count += 1;
    return { allowed: true, remaining: -1 };
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

// ---------- Supabase 限次 ----------
async function rateLimitWithSupabase(
  ip: string,
  endpoint: string,
): Promise<RateLimitResult> {
  const admin = createAdminClient();
  const server = await createClient();
  if (!admin) {
    // 不应发生（调用方已检查），兜底内存
    return {
      ...rateLimitInMemory(`${ip}:${endpoint}`, ANON_LIMIT),
      limit: ANON_LIMIT,
      userId: null,
    };
  }

  // 取当前登录用户
  let userId: string | null = null;
  let limit = ANON_LIMIT;
  if (server) {
    const { data } = await server.auth.getUser();
    if (data.user) {
      userId = data.user.id;
      // plan 由 Lemon Squeezy webhook 同步到 users.plan
      const { data: userRow } = await admin
        .from("users")
        .select("plan")
        .eq("id", userId)
        .single();
      const plan = userRow?.plan ?? "free";
      limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
    }
  }

  if (limit === -1) {
    // pro 不限，但仍记录日志
    await admin.from("usage_logs").insert({ user_id: userId, ip, endpoint });
    return { allowed: true, remaining: -1, limit, userId };
  }

  const since = startOfToday().toISOString();
  let used = 0;
  if (userId) {
    const { count: userCount } = await admin
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("endpoint", endpoint)
      .gte("created_at", since);
    used = userCount ?? 0;
  } else {
    const { count: ipCount } = await admin
      .from("usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("endpoint", endpoint)
      .gte("created_at", since);
    used = ipCount ?? 0;
  }

  if (used >= limit) {
    return { allowed: false, remaining: 0, limit, userId };
  }

  await admin.from("usage_logs").insert({ user_id: userId, ip, endpoint });
  return { allowed: true, remaining: limit - used - 1, limit, userId };
}

/**
 * 统一入口：调用方在每个 API route 中调用此函数。
 */
export async function rateLimit(
  req: NextRequest,
  endpoint: string,
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const admin = createAdminClient();

  // env 未配置 → 内存回退
  if (!admin) {
    const res = rateLimitInMemory(`${ip}:${endpoint}`, ANON_LIMIT);
    return { ...res, limit: ANON_LIMIT, userId: null };
  }

  return rateLimitWithSupabase(ip, endpoint);
}
