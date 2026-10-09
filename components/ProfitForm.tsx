"use client";

import { useState } from "react";
import type { CountryCode, ProfitResult } from "@/lib/etsyFees";
import { COUNTRY_FEES } from "@/lib/etsyFees";
import { useLanguage } from "@/components/LanguageProvider";

interface FormState {
  salePrice: string;
  shipping: string;
  cost: string;
  labor: string;
  packaging: string;
  country: CountryCode;
  offsiteAds: boolean;
  highVolume: boolean;
  salesVolume: string;
}

const initialState: FormState = {
  salePrice: "25",
  shipping: "0",
  cost: "5",
  labor: "3",
  packaging: "1",
  country: "US",
  offsiteAds: false,
  highVolume: false,
  salesVolume: "1",
};

function parseNumber(value: string): number {
  if (value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function ProfitForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<ProfitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salePrice: parseNumber(form.salePrice),
          shipping: parseNumber(form.shipping),
          cost: parseNumber(form.cost),
          labor: parseNumber(form.labor),
          packaging: parseNumber(form.packaging),
          country: form.country,
          offsiteAds: form.offsiteAds,
          highVolume: form.highVolume,
          salesVolume: parseNumber(form.salesVolume),
        }),
      });
      const data = (await res.json()) as ProfitResult | { error: string };
      if (!res.ok) {
        setError("error" in data ? data.error : t("forms.profit.networkError"));
        return;
      }
      setResult(data as ProfitResult);
    } catch {
      setError(t("forms.profit.networkError"));
    } finally {
      setLoading(false);
    }
  }

  const currency = COUNTRY_FEES[form.country].currency;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Field label={t("forms.profit.salePrice")} hint={`(${currency})`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.salePrice}
            onChange={(e) => update("salePrice", e.target.value)}
            className="input"
            required
          />
        </Field>

        <Field label={t("forms.profit.shipping")} hint={`(${currency})`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.shipping}
            onChange={(e) => update("shipping", e.target.value)}
            className="input"
          />
        </Field>

        <Field label={t("forms.profit.cost")} hint={`(${currency})`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={(e) => update("cost", e.target.value)}
            className="input"
          />
        </Field>

        <Field label={t("forms.profit.labor")} hint={`(${currency})`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.labor}
            onChange={(e) => update("labor", e.target.value)}
            className="input"
          />
        </Field>

        <Field label={t("forms.profit.packaging")} hint={`(${currency})`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.packaging}
            onChange={(e) => update("packaging", e.target.value)}
            className="input"
          />
        </Field>

        <Field label={t("forms.profit.salesVolume")}>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={form.salesVolume}
            onChange={(e) => update("salesVolume", e.target.value)}
            className="input"
          />
        </Field>

        <Field label={t("forms.profit.country")}>
          <select
            value={form.country}
            onChange={(e) => update("country", e.target.value as CountryCode)}
            className="input"
          >
            {(Object.keys(COUNTRY_FEES) as CountryCode[]).map((code) => (
              <option key={code} value={code}>
                {COUNTRY_FEES[code].name} ({COUNTRY_FEES[code].currency})
              </option>
            ))}
          </select>
        </Field>

        <div className="flex flex-col gap-3 sm:justify-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.offsiteAds}
              onChange={(e) => update("offsiteAds", e.target.checked)}
            />
            {t("forms.profit.offsiteAds")}
          </label>
          {form.offsiteAds && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.highVolume}
                onChange={(e) => update("highVolume", e.target.checked)}
              />
              {t("forms.profit.highVolume")}
            </label>
          )}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? t("forms.profit.calculating") : t("forms.profit.calculate")}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && <ResultDisplay result={result} currency={currency} />}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span>
        {label} {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function ResultDisplay({
  result,
  currency,
}: {
  result: ProfitResult;
  currency: string;
}) {
  const { t } = useLanguage();
  const { fees } = result;
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-semibold">{t("forms.profit.results")}</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label={t("forms.profit.revenue")} value={`${currency} ${result.revenue.toFixed(2)}`} />
        <Stat
          label={t("forms.profit.netProfit")}
          value={`${currency} ${result.netProfit.toFixed(2)}`}
          highlight={result.netProfit >= 0}
        />
        <Stat
          label={t("forms.profit.profitMargin")}
          value={`${result.profitMargin.toFixed(1)}%`}
          highlight={result.profitMargin >= 0}
        />
        <Stat
          label={t("forms.profit.breakEven")}
          value={`${currency} ${result.breakEvenPrice.toFixed(2)}`}
        />
        <Stat
          label={t("forms.profit.minPrice30")}
          value={`${currency} ${result.minPriceFor30Margin.toFixed(2)}`}
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          {t("forms.profit.feeBreakdown")}
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex justify-between">
            <span>{t("forms.profit.transactionFee")}</span>
            <span>{currency} {fees.transactionFee.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t("forms.profit.listingFee")}</span>
            <span>{currency} {fees.listingFee.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t("forms.profit.paymentProcessing")}</span>
            <span>{currency} {fees.paymentProcessingFee.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>{t("forms.profit.offsiteAdsFee")}</span>
            <span>{currency} {fees.offsiteAdsFee.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-semibold text-gray-900">
            <span>{t("forms.profit.totalFees")}</span>
            <span>{currency} {fees.totalEtsyFees.toFixed(2)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-base font-semibold ${
          highlight ? "text-green-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
