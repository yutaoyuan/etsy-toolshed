"use client";

import { useState } from "react";
import { PLANS, type PlanKey } from "@/lib/plans";
import { useLanguage } from "@/components/LanguageProvider";

const PLAN_ORDER: PlanKey[] = ["free", "starter", "pro"];

export default function PricingPlans({
  currentPlan,
  email,
}: {
  currentPlan: PlanKey;
  email: string | null;
}) {
  const { t, tf } = useLanguage();
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planName: Record<PlanKey, string> = {
    free: t("pricing.plan.free"),
    starter: t("pricing.plan.starter"),
    pro: t("pricing.plan.pro"),
  };

  async function handleUpgrade(plan: PlanKey) {
    setError(null);
    if (!email) {
      window.location.href = "/login";
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/ls/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t("login.authFailed"));
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(t("forms.profit.networkError"));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLAN_ORDER.map((key) => {
          const plan = PLANS[key];
          const isCurrent = currentPlan === key;
          const isPaid = key !== "free";
          return (
            <div
              key={key}
              className={`flex flex-col rounded-xl border p-5 ${
                isCurrent
                  ? "border-emerald-400 ring-2 ring-emerald-200"
                  : "border-gray-200"
              }`}
            >
              <div className="mb-3">
                <h2 className="text-lg font-semibold">{planName[key]}</h2>
                <p className="text-2xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-500">
                    {plan.interval === "month" ? "/mo" : ""}
                  </span>
                </p>
              </div>
              <ul className="mb-5 flex-1 space-y-1 text-sm text-gray-600">
                <li>
                  {plan.dailyLimit === -1
                    ? t("pricing.feature.unlimited")
                    : tf("pricing.feature.dailyLimit", { n: plan.dailyLimit })}
                </li>
                {key === "pro" && <li>{t("pricing.feature.aiRewrite")}</li>}
                {key === "pro" && <li>{t("pricing.feature.bulkCsv")}</li>}
              </ul>
              {isCurrent ? (
                <span className="rounded-md bg-emerald-50 py-2 text-center text-sm font-medium text-emerald-700">
                  {t("pricing.current")}
                </span>
              ) : isPaid ? (
                <button
                  type="button"
                  disabled={loading !== null}
                  onClick={() => handleUpgrade(key)}
                  className="btn-primary"
                >
                  {loading === key ? t("pricing.loading") : t("pricing.upgrade")}
                </button>
              ) : (
                <span className="rounded-md border border-gray-200 py-2 text-center text-sm text-gray-500">
                  {t("pricing.freeForever")}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <p className="text-center text-xs text-gray-400">
        {t("pricing.footer")}
      </p>
    </div>
  );
}
