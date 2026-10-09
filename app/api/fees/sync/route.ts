import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COUNTRY_FEES, type CountryCode } from "@/lib/etsyFees";
import {
  alertAdmin,
  fetchFeesPage,
  hashPage,
  parseFees,
} from "@/lib/feesSync";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron 触发的费率同步端点。
 *
 * 安全：仅接受 Vercel Cron 调用（Authorization: Bearer CRON_SECRET）。
 * 在 vercel.json 中配置每日调度。
 */

const COUNTRIES: CountryCode[] = ["US", "UK", "CA", "EU", "AU"];

function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }

  try {
    const html = await fetchFeesPage();
    const pageHash = hashPage(html);

    // 取最近一次同步的 page_hash
    const { data: lastLog } = await admin
      .from("fee_sync_log")
      .select("page_hash")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (lastLog?.page_hash === pageHash) {
      await admin.from("fee_sync_log").insert({
        page_hash: pageHash,
        status: "unchanged",
        message: "Fees page unchanged",
      });
      return NextResponse.json({ status: "unchanged" });
    }

    // 页面变化 → 解析
    const parsed = parseFees(html);
    if (!parsed) {
      await admin.from("fee_sync_log").insert({
        page_hash: pageHash,
        status: "parse_failed",
        message: "Failed to parse fees page",
      });
      await alertAdmin(
        "Etsy 费率页已变化但解析失败，请人工检查 https://www.etsy.com/legal/fees",
      );
      return NextResponse.json({ status: "parse_failed" });
    }

    // 写入 5 国 draft 行（全球统一费率 + 各国默认 payment processing）
    const drafts = COUNTRIES.map((c) => {
      const def = COUNTRY_FEES[c];
      return {
        country: c,
        transaction_rate: parsed.transactionRate,
        listing_fee: parsed.listingFee,
        payment_processing_rate: def.paymentProcessingRate,
        payment_processing_fixed: def.paymentProcessingFixed,
        offsite_ads_low: parsed.offsiteAdsLow,
        offsite_ads_high: parsed.offsiteAdsHigh,
        status: "draft",
      };
    });

    // 清理旧 draft，避免堆积
    await admin.from("fee_rates").delete().eq("status", "draft");
    await admin.from("fee_rates").insert(drafts);

    await admin.from("fee_sync_log").insert({
      page_hash: pageHash,
      status: "parsed",
      message: `Parsed rates: tx=${parsed.transactionRate}, listing=${parsed.listingFee}`,
    });

    await alertAdmin(
      `Etsy 费率页已更新，已生成 draft 费率（tx=${parsed.transactionRate}, listing=$${parsed.listingFee}）。请到 Supabase 审核并将 draft 改为 active。`,
    );

    return NextResponse.json({ status: "parsed", parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown sync error";
    await alertAdmin(`费率同步出错：${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
