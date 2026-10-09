import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_RULE_SET,
  type ComplianceRuleSet,
} from "@/lib/complianceRules";

/**
 * 合规规则缓存：从 Supabase compliance_rules 读取 active 行，内存缓存 1 小时。
 * Supabase 不可用或无数据时回退到 lib/complianceRules.ts 的 DEFAULT_RULE_SET。
 */

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface RuleRow {
  category: string;
  key: string;
  value: string;
}

let cache: { data: ComplianceRuleSet; expiresAt: number } | null = null;

function buildRuleSet(rows: RuleRow[]): ComplianceRuleSet {
  const set: ComplianceRuleSet = {
    aiDisclosureKeywords: [...DEFAULT_RULE_SET.aiDisclosureKeywords],
    protectedBrands: [...DEFAULT_RULE_SET.protectedBrands],
    titleMaxChars: DEFAULT_RULE_SET.titleMaxChars,
    titleMinChars: DEFAULT_RULE_SET.titleMinChars,
    descriptionMinChars: DEFAULT_RULE_SET.descriptionMinChars,
  };

  for (const row of rows) {
    switch (row.category) {
      case "ai_disclosure_keywords":
        if (!set.aiDisclosureKeywords.includes(row.key)) {
          set.aiDisclosureKeywords.push(row.key);
        }
        break;
      case "brand_words":
        if (!set.protectedBrands.includes(row.key)) {
          set.protectedBrands.push(row.key);
        }
        break;
      case "thresholds": {
        const n = Number(row.value);
        if (!Number.isNaN(n)) {
          if (row.key === "title_max_chars") set.titleMaxChars = n;
          else if (row.key === "title_min_chars") set.titleMinChars = n;
          else if (row.key === "description_min_chars")
            set.descriptionMinChars = n;
        }
        break;
      }
    }
  }
  return set;
}

export async function getComplianceRules(): Promise<ComplianceRuleSet> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const admin = createAdminClient();
  if (!admin) {
    return DEFAULT_RULE_SET;
  }

  try {
    const { data, error } = await admin
      .from("compliance_rules")
      .select("category, key, value")
      .eq("status", "active");

    if (error || !data) {
      return DEFAULT_RULE_SET;
    }

    const ruleSet = buildRuleSet(data as RuleRow[]);
    cache = { data: ruleSet, expiresAt: now + CACHE_TTL_MS };
    return ruleSet;
  } catch {
    return DEFAULT_RULE_SET;
  }
}

/** 测试用：清空缓存 */
export function _resetComplianceCache(): void {
  cache = null;
}
