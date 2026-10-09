/**
 * Etsy AI 披露合规规则引擎（规则版，不接 AI）
 *
 * 规则口径基于 Etsy Seller Handbook 的 AI 披露政策。
 * 所有规则集中在此文件，组件不写死判定逻辑。
 *
 * 数据来源（规则可调部分从 Supabase compliance_rules 表读取，代码保留默认值作为降级）：
 *  - AI 披露要求 / Made by vs Designed by / 原创设计：https://www.etsy.com/legal/creativity/
 *  - 禁售品 / 商标侵权：https://www.etsy.com/legal/prohibited/
 *  - 可售品类说明：https://help.etsy.com/hc/en-us/articles/360024112614-What-Can-I-Sell-on-Etsy
 *
 * 输出：risk_score（0-100）、issues[]（违规项）、suggestions[]（建议）。
 * AI 重写描述由调用方（api/compliance/route.ts）在 Pro 用户 + needAi=true 时
 * 通过 lib/ai.ts 调用，并写入 fixed_description；本规则引擎本身不接 AI。
 */

export type AttributionType =
  | "made_by"
  | "designed_by"
  | "production_partner"
  | "not_listed";

export type Severity = "high" | "medium" | "low";

export interface ComplianceInput {
  title: string;
  description: string;
  usesAi: boolean;
  attribution: AttributionType;
}

export interface Issue {
  rule: string;
  severity: Severity;
  message: string;
}

export interface ComplianceResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  issues: Issue[];
  suggestions: string[];
  /** AI 重写后的描述；由 route 层注入，规则引擎默认返回 null */
  fixedDescription: string | null;
}

/** 可调规则集（来自 Supabase compliance_rules，未配置时用下方默认值） */
export interface ComplianceRuleSet {
  aiDisclosureKeywords: string[];
  protectedBrands: string[];
  titleMaxChars: number;
  titleMinChars: number;
  descriptionMinChars: number;
}

/** 描述中表示已做 AI 披露的关键词（不区分大小写） */
const DEFAULT_AI_DISCLOSURE_KEYWORDS = [
  "ai-generated",
  "ai generated",
  "ai-assisted",
  "ai assisted",
  "artificial intelligence",
  "created with ai",
  "made with ai",
  "ai image",
  "ai art",
  "ai design",
];

/** 受保护品牌/商标词（不区分大小写，子串匹配） */
const DEFAULT_PROTECTED_BRANDS = [
  "disney",
  "star wars",
  "mickey",
  "marvel",
  "nike",
  "adidas",
  "lego",
  "barbie",
  "harry potter",
  "pokemon",
  "nintendo",
  "mario",
  "coca cola",
  "coca-cola",
  "gucci",
  "louis vuitton",
];

const DEFAULT_TITLE_MAX_CHARS = 140;
const DEFAULT_TITLE_MIN_CHARS = 20;
const DEFAULT_DESCRIPTION_MIN_CHARS = 50;

export const DEFAULT_RULE_SET: ComplianceRuleSet = {
  aiDisclosureKeywords: DEFAULT_AI_DISCLOSURE_KEYWORDS,
  protectedBrands: DEFAULT_PROTECTED_BRANDS,
  titleMaxChars: DEFAULT_TITLE_MAX_CHARS,
  titleMinChars: DEFAULT_TITLE_MIN_CHARS,
  descriptionMinChars: DEFAULT_DESCRIPTION_MIN_CHARS,
};

const SEVERITY_SCORE: Record<Severity, number> = {
  high: 30,
  medium: 15,
  low: 5,
};

function containsKeyword(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw)) return kw;
  }
  return null;
}

/**
 * 规则 1：使用了 AI 但描述中没有 AI 披露声明
 * @source https://www.etsy.com/legal/creativity/ — "Sellers must disclose within their listing description if an item is created with the use of AI."
 */
function checkAiDisclosure(input: ComplianceInput, rules: ComplianceRuleSet): Issue | null {
  if (!input.usesAi) return null;
  if (containsKeyword(input.description, rules.aiDisclosureKeywords)) return null;
  return {
    rule: "ai_disclosure_missing",
    severity: "high",
    message:
      "You use AI to create listing content but your description has no AI disclosure. Add a statement like 'This design was created with AI assistance.'",
  };
}

/**
 * 规则 2：使用了 AI 但归属选了 "Made by"
 * Etsy 口径：用 AI 生成的内容，卖家是设计者而非制作者，应选 "Designed by"。
 * @source https://www.etsy.com/legal/creativity/ — AI 生成作品归 "Designed by a seller" 类别。
 */
function checkAttribution(input: ComplianceInput): Issue | null {
  if (!input.usesAi) return null;
  if (input.attribution !== "made_by") return null;
  return {
    rule: "wrong_attribution",
    severity: "high",
    message:
      "When using AI-generated content, select 'Designed by' instead of 'Made by' — you designed the prompt/concept, AI generated the work.",
  };
}

/**
 * 规则 3：标题超过 Etsy 140 字符限制
 * @source https://help.etsy.com/hc/en-us/articles/360024112614 — 标题硬上限 140 字符。
 */
function checkTitleLength(input: ComplianceInput, rules: ComplianceRuleSet): Issue | null {
  if (input.title.length > rules.titleMaxChars) {
    return {
      rule: "title_too_long",
      severity: "medium",
      message: `Title is ${input.title.length} characters. Etsy truncates titles over ${rules.titleMaxChars} characters.`,
    };
  }
  if (input.title.length < rules.titleMinChars && input.title.length > 0) {
    return {
      rule: "title_too_short",
      severity: "low",
      message: `Title is only ${input.title.length} characters. Aim for at least ${rules.titleMinChars} characters for better search visibility.`,
    };
  }
  return null;
}

/**
 * 规则 4：标题或描述含受保护品牌词（商标风险）
 * @source https://www.etsy.com/legal/prohibited/ — 禁止侵犯知识产权/商标。
 */
function checkBrandWords(input: ComplianceInput, rules: ComplianceRuleSet): Issue | null {
  const hit =
    containsKeyword(input.title, rules.protectedBrands) ??
    containsKeyword(input.description, rules.protectedBrands);
  if (!hit) return null;
  return {
    rule: "protected_brand",
    severity: "high",
    message: `Avoid using the trademarked term "${hit}" in your listing. Using protected brand names can lead to takedowns or legal action.`,
  };
}

/**
 * 规则 5：描述过短
 */
function checkDescriptionLength(input: ComplianceInput, rules: ComplianceRuleSet): Issue | null {
  if (input.description.length >= rules.descriptionMinChars) return null;
  return {
    rule: "description_too_short",
    severity: "low",
    message: `Description is only ${input.description.length} characters. Add details about materials, size, and usage to help buyers and SEO.`,
  };
}

/**
 * 规则 6：声明不一致 — 未勾选 AI 但描述里出现了 AI 披露词
 */
function checkAiConsistency(input: ComplianceInput, rules: ComplianceRuleSet): Issue | null {
  if (input.usesAi) return null;
  const hit = containsKeyword(input.description, rules.aiDisclosureKeywords);
  if (!hit) return null;
  return {
    rule: "ai_declaration_inconsistent",
    severity: "medium",
    message: `You indicated no AI use, but your description mentions "${hit}". Update either the AI checkbox or the description to stay consistent.`,
  };
}

const RULES: Array<(input: ComplianceInput, rules: ComplianceRuleSet) => Issue | null> = [
  checkAiDisclosure,
  checkAttribution,
  checkTitleLength,
  checkBrandWords,
  checkDescriptionLength,
  checkAiConsistency,
];

function riskLevelFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function buildSuggestions(input: ComplianceInput, rules: ComplianceRuleSet): string[] {
  const suggestions: string[] = [];
  if (input.usesAi && !containsKeyword(input.description, rules.aiDisclosureKeywords)) {
    suggestions.push(
      "Add an AI disclosure sentence, e.g. 'This artwork was created with the assistance of AI tools.'",
    );
  }
  if (input.usesAi && input.attribution === "made_by") {
    suggestions.push(
      "Change your listing attribution from 'Made by' to 'Designed by'.",
    );
  }
  if (input.title.length > rules.titleMaxChars) {
    suggestions.push(
      `Shorten your title to ${rules.titleMaxChars} characters or fewer.`,
    );
  }
  if (input.description.length < rules.descriptionMinChars) {
    suggestions.push(
      "Expand your description with materials, dimensions, care instructions, and intended use.",
    );
  }
  return suggestions;
}

/**
 * 执行合规检查。
 * @param input listing 数据
 * @param rules 可选规则集（来自 Supabase），未提供时用代码默认值
 */
export function checkCompliance(
  input: ComplianceInput,
  rules: ComplianceRuleSet = DEFAULT_RULE_SET,
): ComplianceResult {
  const issues = RULES.map((rule) => rule(input, rules)).filter(
    (i): i is Issue => i !== null,
  );

  const riskScore = Math.min(
    100,
    issues.reduce((sum, i) => sum + SEVERITY_SCORE[i.severity], 0),
  );

  return {
    riskScore,
    riskLevel: riskLevelFromScore(riskScore),
    issues,
    suggestions: buildSuggestions(input, rules),
    fixedDescription: null,
  };
}
