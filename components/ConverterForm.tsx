"use client";

import { useState } from "react";
import type { ConverterResult } from "@/lib/converterRules";
import { useLanguage } from "@/components/LanguageProvider";

interface FormState {
  etsyTitle: string;
  etsyTags: string;
  etsyDescription: string;
}

const initialState: FormState = {
  etsyTitle:
    "Boho Sun Wall Art Print | Minimalist Mid Century Modern | Printable Digital Download",
  etsyTags:
    "boho wall art, sun print, minimalist art, mid century modern, printable wall art, digital download, boho decor, abstract art",
  etsyDescription:
    "This boho sun wall art print is the perfect addition to your minimalist or mid-century modern home. Download instantly and print at home or at your local print shop. High resolution 300 DPI file included in multiple sizes.",
};

export default function ConverterForm() {
  const { t, tf } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<ConverterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function parseTags(raw: string): string[] {
    return raw
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    const tags = parseTags(form.etsyTags);
    if (tags.length > 13) {
      setError(t("forms.converter.tagsTooMany"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etsyTitle: form.etsyTitle,
          etsyTags: tags,
          etsyDescription: form.etsyDescription,
        }),
      });
      const data = (await res.json()) as
        | ConverterResult
        | { error: string };
      if (!res.ok) {
        setError("error" in data ? data.error : t("forms.converter.networkError"));
        return;
      }
      setResult(data as ConverterResult);
    } catch {
      setError(t("forms.converter.networkError"));
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard 不可用时静默失败
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>{t("forms.converter.etsyTitle")}</span>
          <input
            type="text"
            value={form.etsyTitle}
            onChange={(e) => update("etsyTitle", e.target.value)}
            className="input"
            maxLength={500}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>{t("forms.converter.etsyTags")}</span>
          <textarea
            value={form.etsyTags}
            onChange={(e) => update("etsyTags", e.target.value)}
            rows={3}
            className="input resize-y"
          />
          <span className="text-xs text-gray-400">
            {tf("forms.converter.tagsCount", { n: parseTags(form.etsyTags).length })}
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>{t("forms.converter.etsyDescription")}</span>
          <textarea
            value={form.etsyDescription}
            onChange={(e) => update("etsyDescription", e.target.value)}
            rows={6}
            className="input resize-y"
            maxLength={5000}
          />
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t("forms.converter.converting") : t("forms.converter.convert")}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4 rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold">{t("forms.converter.shopifyCopy")}</h2>

          <OutputField
            label={t("forms.converter.shopifyTitle")}
            value={result.shopifyTitle}
            copied={copied === "shopifyTitle"}
            onCopy={() => copyToClipboard("shopifyTitle", result.shopifyTitle)}
          />
          <OutputField
            label={t("forms.converter.metaTitle")}
            value={result.metaTitle}
            copied={copied === "metaTitle"}
            onCopy={() => copyToClipboard("metaTitle", result.metaTitle)}
          />
          <OutputField
            label={t("forms.converter.metaDescription")}
            value={result.metaDescription}
            copied={copied === "metaDescription"}
            onCopy={() =>
              copyToClipboard("metaDescription", result.metaDescription)
            }
          />
          <OutputField
            label={t("forms.converter.altText")}
            value={result.altText}
            copied={copied === "altText"}
            onCopy={() => copyToClipboard("altText", result.altText)}
          />

          <div className="border-t border-gray-100 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              {t("forms.converter.pinterest")}
            </h3>
            <OutputField
              label={t("forms.converter.shopifyTitle")}
              value={result.pinterestPin.title}
              copied={copied === "pinTitle"}
              onCopy={() =>
                copyToClipboard("pinTitle", result.pinterestPin.title)
              }
            />
            <OutputField
              label={t("forms.converter.metaDescription")}
              value={result.pinterestPin.description}
              copied={copied === "pinDesc"}
              onCopy={() =>
                copyToClipboard("pinDesc", result.pinterestPin.description)
              }
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              {t("forms.converter.tiktok")}
            </h3>
            <OutputField
              label={t("forms.converter.tiktok")}
              value={result.tiktokCaption}
              copied={copied === "tiktok"}
              onCopy={() => copyToClipboard("tiktok", result.tiktokCaption)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function OutputField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs text-emerald-600 hover:text-emerald-700"
        >
          {copied ? t("forms.converter.copied") : t("forms.converter.copy")}
        </button>
      </div>
      <p className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-gray-800">
        {value}
      </p>
    </div>
  );
}
