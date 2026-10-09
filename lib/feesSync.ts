import crypto from "node:crypto";

/**
 * Etsy 费率半自动同步。
 *
 * 流程：
 * 1. 抓取 https://www.etsy.com/legal/fees
 * 2. 计算内容 hash，与 fee_sync_log 最新记录比对
 * 3. 未变化 → 记录 unchanged，结束
 * 4. 变化 → 解析费率 → 合理性校验 → 写入 fee_rates (status='draft') → 告警管理员
 * 5. 解析/校验失败 → 不写库，记录 parse_failed 并告警
 *
 * 设计原则：永不静默覆盖线上费率。解析失败只告警，线上继续用最后一条 active。
 */

export const ETSY_FEES_URL = "https://www.etsy.com/legal/fees";

export interface ParsedFees {
  transactionRate: number;
  listingFee: number;
  offsiteAdsLow: number;
  offsiteAdsHigh: number;
}

/** 抓取费率页 HTML（跟随重定向，模拟浏览器 UA） */
export async function fetchFeesPage(): Promise<string> {
  const res = await fetch(ETSY_FEES_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; EtsyToolshedFeeSync/1.0; +https://etsytoolshed.com)",
      Accept: "text/html",
    },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch fees page: HTTP ${res.status}`);
  }
  return res.text();
}

/** SHA-256 hash 页面内容（用于变更检测） */
export function hashPage(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/** 去掉 HTML 标签，保留可读文本 */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 从页面文本中解析费率。
 * 只解析全球统一费率（transaction / listing / offsite ads），
 * 各国 payment processing 保留默认值（在 route 层合并）。
 * 解析失败返回 null，由调用方告警。
 */
export function parseFees(html: string): ParsedFees | null {
  const text = stripHtml(html);
  if (text.length < 200) return null; // 内容过少，可能是 JS 壳

  // transaction fee：找 "transaction" 附近的百分比
  const txMatch = text.match(/transaction[^%]{0,80}?(\d+(?:\.\d+)?)\s*%/i);
  const transactionRate = txMatch ? Number(txMatch[1]) / 100 : NaN;

  // listing fee：$0.20 形式
  const listingMatch = text.match(/listing[^$]{0,80}?\$\s*(\d+(?:\.\d+)?)/i);
  const listingFee = listingMatch ? Number(listingMatch[1]) : NaN;

  // offsite ads：15% 与 12%
  const offsiteMatches = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*%/g))
    .map((m) => Number(m[1]))
    .filter((n) => n > 0 && n <= 30);
  // 取两个不同的较大值作为 low/high（15 和 12）
  const distinct: number[] = [];
  for (const n of offsiteMatches) {
    if (!distinct.includes(n)) distinct.push(n);
  }
  distinct.sort((a, b) => b - a);
  const offsiteAdsHigh = distinct[0] != null ? distinct[0] / 100 : NaN;
  const offsiteAdsLow = distinct[1] != null ? distinct[1] / 100 : NaN;

  const parsed: ParsedFees = {
    transactionRate,
    listingFee,
    offsiteAdsLow,
    offsiteAdsHigh,
  };

  if (!passesSanityCheck(parsed)) return null;
  return parsed;
}

/** 合理性校验：费率必须在合理区间内，避免误解析污染数据 */
export function passesSanityCheck(p: ParsedFees): boolean {
  const isRate = (n: number) => !Number.isNaN(n) && n > 0 && n < 1;
  const isMoney = (n: number) => !Number.isNaN(n) && n >= 0 && n < 100;
  return (
    isRate(p.transactionRate) &&
    isMoney(p.listingFee) &&
    isRate(p.offsiteAdsLow) &&
    isRate(p.offsiteAdsHigh) &&
    p.offsiteAdsHigh <= p.offsiteAdsLow // high-volume 卖家费率更低
  );
}

/** 向管理员告警（Discord/Slack/飞书 webhook 等）。未配置则跳过。 */
export async function alertAdmin(message: string): Promise<void> {
  const url = process.env.FEES_ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `[EtsyToolshed 费率同步] ${message}` }),
    });
  } catch {
    // 告警失败不影响同步主流程
  }
}
