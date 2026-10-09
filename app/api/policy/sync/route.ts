import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  POLICY_PAGES,
  checkPolicyPage,
  alertPolicyChange,
  type PolicySyncResult,
} from "@/lib/policySync";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron 触发的政策页变更检测端点。
 *
 * 安全：仅接受 Vercel Cron 调用（Authorization: Bearer CRON_SECRET）。
 * 只检测页面是否变化并告警，不自动修改规则。
 */

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

  const results: PolicySyncResult[] = [];

  for (const page of POLICY_PAGES) {
    // 取该页面最近一次的 hash
    const { data: lastLog } = await admin
      .from("policy_sync_log")
      .select("page_hash")
      .eq("page_url", page.url)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const result = await checkPolicyPage(
      page.url,
      page.label,
      lastLog?.page_hash ?? null,
    );
    results.push(result);

    // 写入本次日志
    if (result.status === "fetch_failed") {
      await admin.from("policy_sync_log").insert({
        page_url: page.url,
        page_hash: "",
        status: "fetch_failed",
        message: result.message,
      });
    } else {
      await admin.from("policy_sync_log").insert({
        page_url: page.url,
        page_hash: result.pageHash,
        status: result.status,
        message: result.message,
      });
    }
  }

  await alertPolicyChange(results);

  return NextResponse.json({ results });
}
