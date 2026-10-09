import { createAdminClient } from "@/lib/supabase/admin";
import {
  COUNTRY_FEES,
  feeRowToConfig,
  type CountryFeeConfig,
  type CountryCode,
  type FeeRateRow,
} from "@/lib/etsyFees";

/**
 * 费率缓存：从 Supabase fee_rates 读取 active 行，内存缓存 1 小时。
 * 缓存未命中或 Supabase 不可用时回退到 lib/etsyFees.ts 的默认费率。
 */

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cache: { data: Record<CountryCode, CountryFeeConfig>; expiresAt: number } | null =
  null;

export async function getFeeConfig(
  country: CountryCode,
): Promise<CountryFeeConfig> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data[country] ?? COUNTRY_FEES[country];
  }

  const admin = createAdminClient();
  if (!admin) {
    return COUNTRY_FEES[country];
  }

  try {
    const { data, error } = await admin
      .from("fee_rates")
      .select("*")
      .eq("status", "active");

    if (error || !data) {
      return COUNTRY_FEES[country];
    }

    const map = { ...COUNTRY_FEES } as Record<CountryCode, CountryFeeConfig>;
    for (const row of data as FeeRateRow[]) {
      const code = row.country as CountryCode;
      if (COUNTRY_FEES[code]) {
        map[code] = feeRowToConfig(row);
      }
    }

    cache = { data: map, expiresAt: now + CACHE_TTL_MS };
    return map[country] ?? COUNTRY_FEES[country];
  } catch {
    return COUNTRY_FEES[country];
  }
}

/** 测试用：清空缓存 */
export function _resetFeeCache(): void {
  cache = null;
}
