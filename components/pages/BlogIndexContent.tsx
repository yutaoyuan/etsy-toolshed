"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const posts = [
  {
    slug: "etsy-fees-2026",
    titleKey: "blog.post.fees.title",
    excerptKey: "blog.post.fees.excerpt",
  },
  {
    slug: "etsy-ai-disclosure-rules",
    titleKey: "blog.post.ai.title",
    excerptKey: "blog.post.ai.excerpt",
  },
  {
    slug: "etsy-vs-shopify-margin",
    titleKey: "blog.post.margin.title",
    excerptKey: "blog.post.margin.excerpt",
  },
];

export default function BlogIndexContent() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("blog.h1")}
        </h1>
        <p className="mt-3 text-gray-600">{t("blog.subtitle")}</p>
      </header>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-gray-200 p-5 transition hover:border-emerald-400 hover:shadow-sm"
          >
            <h2 className="text-xl font-semibold">{t(post.titleKey)}</h2>
            <p className="mt-2 text-sm text-gray-600">{t(post.excerptKey)}</p>
            <span className="mt-3 inline-block text-sm font-medium text-emerald-600">
              {t("common.readArticle")}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
