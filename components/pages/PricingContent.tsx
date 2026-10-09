"use client";

import PricingPlans from "@/components/PricingPlans";
import JsonLd from "@/components/JsonLd";
import { useLanguage } from "@/components/LanguageProvider";
import type { PlanKey } from "@/lib/plans";

export default function PricingContent({
  currentPlan,
  email,
}: {
  currentPlan: PlanKey;
  email: string | null;
}) {
  const { t } = useLanguage();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "EtsyToolshed",
    description: t("pricing.subtitle"),
    brand: { "@type": "Brand", name: "EtsyToolshed" },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Starter",
        price: "9",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "19",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("pricing.h1")}
        </h1>
        <p className="mt-3 text-gray-600">{t("pricing.subtitle")}</p>
      </header>

      <PricingPlans currentPlan={currentPlan} email={email} />
      <JsonLd data={productSchema} />
    </main>
  );
}
