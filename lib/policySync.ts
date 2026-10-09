import { hashPage, alertAdmin } from "@/lib/feesSync";

/**
 * Etsy 政策页变更检测（不解析规则，只检测页面是否变化）。
 *
 * 监控页面：
 *  - https://www.etsy.com/legal/creativity/   (AI 披露 + Made by/Designed by + 原创设计)
 *  - https://www.etsy.com/legal/prohibited/   (禁售品 + 商标侵权)
 *
 * 流程：
 * 1. 抓取页面 HTML 并计算 SHA-256 hash
 * 2. 与 policy_sync_log 中该页面最新 hash 比对
 * 3. 未变化 → 记录 unchanged
 * 4. 变化 → 记录 changed + 告警管理员（人工复核 compliance_rules 表）
 *
 * 设计原则：政策是法律散文，无法可靠自动解析成 if/else。
 * 页面变化只告警，不自动改规则，避免静默误判。
 */

export const POLICY_PAGES = [
  {
    url: "https://www.etsy.com/legal/creativity/",
    label: "Creativity Standards (AI disclosure + attribution)",
  },
  {
    url: "https://www.etsy.com/legal/prohibited/",
    label: "Prohibited Items (trademark / IP)",
  },
] as const;

/** 抓取单个政策页 HTML */
export async function fetchPolicyPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; EtsyToolshedPolicySync/1.0; +https://etsytoolshed.com)",
      Accept: "text/html",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  return res.text();
}

export interface PolicySyncResult {
  url: string;
  label: string;
  status: "unchanged" | "changed" | "fetch_failed";
  pageHash?: string;
  message?: string;
}

/** 检查单个政策页是否变化。返回结果（含本次 hash），不写库。 */
export async function checkPolicyPage(
  url: string,
  label: string,
  lastHash: string | null,
): Promise<PolicySyncResult> {
  try {
    const html = await fetchPolicyPage(url);
    const pageHash = hashPage(html);

    if (lastHash === pageHash) {
      return { url, label, status: "unchanged", pageHash };
    }

    return {
      url,
      label,
      status: "changed",
      pageHash,
      message: `政策页已更新: ${label}`,
    };
  } catch (err) {
    return {
      url,
      label,
      status: "fetch_failed",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/** 向管理员告警政策页变化 */
export async function alertPolicyChange(results: PolicySyncResult[]): Promise<void> {
  const changed = results.filter((r) => r.status === "changed");
  if (changed.length === 0) return;

  const msg = changed
    .map((r) => `- ${r.label}: ${r.url}`)
    .join("\n");

  await alertAdmin(
    `Etsy 政策页有更新，请复核 compliance_rules 表：\n${msg}`,
  );
}
