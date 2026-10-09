"use client";

import { useState } from "react";
import type {
  AttributionType,
  ComplianceResult,
  Issue,
  Severity,
} from "@/lib/complianceRules";
import { useLanguage } from "@/components/LanguageProvider";

interface FormState {
  title: string;
  description: string;
  usesAi: boolean;
  attribution: AttributionType;
  needAi: boolean;
}

const initialState: FormState = {
  title: "AI Generated Wall Art Print",
  description:
    "Beautiful digital artwork. High resolution download. Perfect for your home.",
  usesAi: true,
  attribution: "made_by",
  needAi: false,
};

const severityColor: Record<Severity, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const riskLevelColor: Record<ComplianceResult["riskLevel"], string> = {
  low: "text-green-700",
  medium: "text-amber-700",
  high: "text-red-700",
};

export default function ComplianceForm() {
  const { t, tf } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const attributionLabels: Record<AttributionType, string> = {
    made_by: t("forms.compliance.attr.made_by"),
    designed_by: t("forms.compliance.attr.designed_by"),
    production_partner: t("forms.compliance.attr.production_partner"),
    not_listed: t("forms.compliance.attr.not_listed"),
  };

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          usesAi: form.usesAi,
          attribution: form.attribution,
          needAi: form.needAi,
        }),
      });
      const data = (await res.json()) as
        | ComplianceResult
        | { error: string };
      if (!res.ok) {
        setError("error" in data ? data.error : t("forms.compliance.networkError"));
        return;
      }
      setResult(data as ComplianceResult);
    } catch {
      setError(t("forms.compliance.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>{t("forms.compliance.title")}</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="input"
            maxLength={500}
          />
          <span className="text-xs text-gray-400">
            {tf("forms.compliance.chars", { n: form.title.length })}
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>{t("forms.compliance.description")}</span>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            className="input resize-y"
            maxLength={5000}
          />
          <span className="text-xs text-gray-400">
            {tf("forms.compliance.chars", { n: form.description.length })}
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.usesAi}
            onChange={(e) => update("usesAi", e.target.checked)}
          />
          {t("forms.compliance.usesAi")}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>{t("forms.compliance.attribution")}</span>
          <select
            value={form.attribution}
            onChange={(e) =>
              update("attribution", e.target.value as AttributionType)
            }
            className="input"
          >
            {(Object.keys(attributionLabels) as AttributionType[]).map((k) => (
              <option key={k} value={k}>
                {attributionLabels[k]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.needAi}
            onChange={(e) => update("needAi", e.target.checked)}
          />
          {t("forms.compliance.needAi")}
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t("forms.compliance.checking") : t("forms.compliance.check")}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
}

function ResultDisplay({ result }: { result: ComplianceResult }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("forms.compliance.report")}</h2>
        <span
          className={`text-2xl font-bold ${riskLevelColor[result.riskLevel]}`}
        >
          {result.riskScore}/100
        </span>
      </div>

      <p className="text-sm text-gray-600">
        {t("forms.compliance.riskLevel")}:{" "}
        <span className="font-semibold capitalize">
          {result.riskLevel}
        </span>
      </p>

      {result.issues.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">{t("forms.compliance.issuesFound")}</h3>
          <ul className="space-y-2">
            {result.issues.map((issue, idx) => (
              <IssueItem key={idx} issue={issue} />
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {t("forms.compliance.noIssues")}
        </p>
      )}

      {result.suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">{t("forms.compliance.suggestions")}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            {result.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {result.fixedDescription && (
        <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-800">
              {t("forms.compliance.rewriteResult")}
            </h3>
            <CopyButton text={result.fixedDescription} />
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {result.fixedDescription}
          </p>
        </div>
      )}

      <p className="border-t border-gray-100 pt-3 text-xs text-gray-400">
        {t("forms.compliance.disclaimer")}
      </p>
    </div>
  );
}

function IssueItem({ issue }: { issue: Issue }) {
  return (
    <li
      className={`rounded-lg border p-3 text-sm ${severityColor[issue.severity]}`}
    >
      <span className="mr-2 font-semibold uppercase">
        {issue.severity}
      </span>
      {issue.message}
    </li>
  );
}

function CopyButton({ text }: { text: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时静默失败
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100"
    >
      {copied ? t("forms.compliance.copied") : t("forms.compliance.copy")}
    </button>
  );
}
