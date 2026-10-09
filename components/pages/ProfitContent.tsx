"use client";

import Link from "next/link";
import ProfitForm from "@/components/ProfitForm";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { useLanguage } from "@/components/LanguageProvider";
import { buildFaq } from "@/lib/i18n/faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Etsy Profit Calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/etsy-profit-calculator`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Calculate Etsy seller fees, net profit, profit margin, and break-even price for digital products, POD, handmade, and vintage listings.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PAGE_URL = `${SITE_URL}/etsy-profit-calculator`;

export default function ProfitContent() {
  const { t } = useLanguage();
  const faqs = buildFaq(t, "profit", 4);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("profit.h1"), item: PAGE_URL },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li><Link className="hover:text-emerald-600" href="/">{t("nav.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700">{t("profit.h1")}</li>
        </ol>
      </nav>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("profit.h1")}
        </h1>
        <p className="mt-3 text-gray-600">{t("profit.subtitle")}</p>
      </header>

      <ProfitForm />
      <Faq items={faqs} />
      <JsonLd data={[jsonLd, breadcrumb]} />
    </main>
  );
}
