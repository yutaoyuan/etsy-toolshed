"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import JsonLd from "@/components/JsonLd";

export default function HomeContent() {
  const { t } = useLanguage();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const tools = [
    {
      href: "/etsy-profit-calculator",
      title: t("home.tools.profit.title"),
      desc: t("home.tools.profit.desc"),
    },
    {
      href: "/etsy-ai-disclosure-checker",
      title: t("home.tools.compliance.title"),
      desc: t("home.tools.compliance.desc"),
    },
    {
      href: "/etsy-to-shopify-listing-converter",
      title: t("home.tools.converter.title"),
      desc: t("home.tools.converter.desc"),
    },
  ];

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EtsyToolshed",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: t("home.subtitle"),
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EtsyToolshed",
    url: SITE_URL,
    description: t("home.subtitle"),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          {t("home.subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-gray-200 p-5 transition hover:border-emerald-400 hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold">{tool.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{tool.desc}</p>
          </Link>
        ))}
      </div>

      <JsonLd data={[organization, webSite]} />
    </main>
  );
}
