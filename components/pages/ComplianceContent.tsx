"use client";

import Link from "next/link";
import ComplianceForm from "@/components/ComplianceForm";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { useLanguage } from "@/components/LanguageProvider";
import { buildFaq } from "@/lib/i18n/faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Etsy AI Disclosure Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/etsy-ai-disclosure-checker`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Check whether your Etsy listing complies with Etsy's AI disclosure policy. Get a risk score, list of issues, and suggestions.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PAGE_URL = `${SITE_URL}/etsy-ai-disclosure-checker`;

export default function ComplianceContent() {
  const { t } = useLanguage();
  const faqs = buildFaq(t, "compliance", 4);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("compliance.h1"), item: PAGE_URL },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li><Link className="hover:text-emerald-600" href="/">{t("nav.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700">{t("compliance.h1")}</li>
        </ol>
      </nav>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("compliance.h1")}
        </h1>
        <p className="mt-3 text-gray-600">{t("compliance.subtitle")}</p>
        <p className="mt-2 text-xs text-gray-500">
          {t("compliance.disclaimer")}
        </p>
      </header>

      <ComplianceForm />
      <Faq items={faqs} />
      <JsonLd data={[jsonLd, breadcrumb]} />
    </main>
  );
}
