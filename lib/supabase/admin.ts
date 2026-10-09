import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase service role 客户端（绕过 RLS，仅服务端使用）。
 * 用于限次写入 usage_logs 等后端操作。
 * env 缺失时返回 null，由调用方回退到内存限次。
 * 严禁在客户端组件中导入此文件。
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
