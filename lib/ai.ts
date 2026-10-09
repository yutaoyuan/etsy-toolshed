/**
 * AI 描述重写服务。
 *
 * 支持两个 provider（由 AI_PROVIDER 环境变量选择）：
 *  - anthropic：Claude（ANTHROPIC_API_KEY / ANTHROPIC_MODEL）
 *  - deepseek：DeepSeek Chat（DEEPSEEK_API_KEY / DEEPSEEK_MODEL）
 *
 * 未配置 provider 或 API key 时，rewriteDescription 返回 null（静默降级，不报错）。
 */

import type { Issue, ComplianceInput } from "./complianceRules";

export interface RewriteParams {
  input: ComplianceInput;
  issues: Issue[];
  suggestions: string[];
}

function getConfig():
  | { provider: "anthropic" | "deepseek"; apiKey: string; model: string }
  | null {
  const provider = process.env.AI_PROVIDER;
  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;
    return {
      provider,
      apiKey,
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-20241022",
    };
  }
  if (provider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return null;
    return {
      provider,
      apiKey,
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
    };
  }
  return null;
}

function buildSystemPrompt(): string {
  return [
    "You are an Etsy listing copywriter who helps sellers write compliant,",
    "search-friendly descriptions. Rewrite the given Etsy listing description so that:",
    "1. If the seller uses AI-generated content, include a clear AI disclosure statement",
    "   (e.g. 'This design was created with AI assistance.').",
    "2. If the seller selected the wrong attribution, suggest the correct wording for",
    "   'Designed by' rather than 'Made by'.",
    "3. Keep the original product information, materials, and key details intact.",
    "4. Write in natural, persuasive English suitable for an Etsy product page.",
    "5. Do not add trademarked brand names unless they were already present.",
    "Return ONLY the rewritten description text, no extra commentary.",
  ].join(" ");
}

function buildUserPrompt(params: RewriteParams): string {
  const { input, issues, suggestions } = params;
  const issueList =
    issues.length > 0
      ? issues.map((i) => `- ${i.message}`).join("\n")
      : "- No compliance issues detected.";
  const suggestionList =
    suggestions.length > 0
      ? suggestions.map((s) => `- ${s}`).join("\n")
      : "- No specific suggestions.";

  return [
    `Title: ${input.title}`,
    `Uses AI: ${input.usesAi ? "yes" : "no"}`,
    `Attribution: ${input.attribution}`,
    "",
    "Current description:",
    input.description,
    "",
    "Compliance issues found:",
    issueList,
    "",
    "Suggestions:",
    suggestionList,
    "",
    "Rewrite the description above to address the issues and suggestions.",
  ].join("\n");
}

async function callAnthropic(
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data?.content?.[0]?.text ?? "";
}

async function callDeepSeek(
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<string> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

/**
 * 用 AI 重写 Etsy 商品描述。
 * 未配置 provider / key 或调用失败时返回 null（静默降级）。
 */
export async function rewriteDescription(
  params: RewriteParams,
): Promise<string | null> {
  const cfg = getConfig();
  if (!cfg) return null;

  const system = buildSystemPrompt();
  const user = buildUserPrompt(params);

  try {
    const text =
      cfg.provider === "anthropic"
        ? await callAnthropic(cfg.apiKey, cfg.model, system, user)
        : await callDeepSeek(cfg.apiKey, cfg.model, system, user);
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch (err) {
    // 静默降级，不影响合规检查主流程
    console.error("[ai] rewriteDescription failed:", err);
    return null;
  }
}
