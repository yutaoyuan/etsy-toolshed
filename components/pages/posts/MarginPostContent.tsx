"use client";

import Link from "next/link";
import Faq from "@/components/Faq";
import { useLanguage } from "@/components/LanguageProvider";
import { buildFaq } from "@/lib/i18n/faq";

export default function MarginPostContent() {
  const { t, language: lang } = useLanguage();
  const faqs = buildFaq(t, "marginBlog", 4);

  if (lang === "zh") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8">
          <p className="text-sm text-emerald-600">{t("blog.post.margin.category")}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("blog.post.margin.title")}
          </h1>
          <p className="mt-3 text-gray-600">{t("blog.post.margin.excerpt")}</p>
        </header>

        <article className="prose prose-emerald max-w-none">
          <p>Etsy 和 Shopify 的收费结构完全不同，利润率也因此差异很大。下面对比两者的费用和实际到手利润。</p>

          <h2>Etsy 的费用</h2>
          <ul>
            <li>上架费：每件 0.20 美元</li>
            <li>交易费：6.5%</li>
            <li>支付处理费：约 3% + 0.25 美元</li>
            <li>站外广告费：12%–15%</li>
          </ul>

          <h2>Shopify 的费用</h2>
          <ul>
            <li>月费：39 美元起（Basic）</li>
            <li>支付处理费：2.9% + 0.30 美元（Shopify Payments）</li>
            <li>无交易费、无上架费</li>
          </ul>

          <h2>利润率对比</h2>
          <p>
            假设售价 50 美元，成本 10 美元，运费 5 美元：
          </p>
          <ul>
            <li><strong>Etsy</strong>：上架 0.20 + 交易 3.58 + 支付 1.90 = 约 5.68 美元费用，净利润约 29.32 美元，利润率约 59%。</li>
            <li><strong>Shopify</strong>：支付 1.75 + 月费分摊（按月销量 100 件算，每件 0.39）= 约 2.14 美元费用，净利润约 32.86 美元，利润率约 66%。</li>
          </ul>
          <p>销量越高，Shopify 越划算；销量低时，Etsy 没有月费风险更低。</p>

          <h2>从 Etsy 搬到 Shopify</h2>
          <p>迁移时，最重要的是把 Etsy 风格的标题和描述改写成适合 Shopify SEO 的版本。Shopify 标题最好不超过 70 字符，描述要精简并包含行动号召。</p>
          <p>用我们的 <Link className="text-emerald-600 underline" href="/etsy-to-shopify-listing-converter">Etsy 转 Shopify 文案转换器</Link> 一键生成优化后的标题、Meta 描述和社媒文案。</p>
        </article>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">{t("blog.related")}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-fees-2026">{t("blog.relatedFees")}</Link></li>
            <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-ai-disclosure-rules">{t("blog.relatedAi")}</Link></li>
            <li><Link className="text-emerald-600 hover:underline" href="/etsy-to-shopify-listing-converter">{t("blog.relatedConverterTool")}</Link></li>
            <li><Link className="text-emerald-600 hover:underline" href="/etsy-profit-calculator">{t("blog.relatedProfitTool")}</Link></li>
          </ul>
        </section>

        <Faq items={faqs} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm text-emerald-600">Etsy vs Shopify</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Etsy vs Shopify Profit Margin
        </h1>
        <p className="mt-3 text-gray-600">
          A side-by-side fee and margin comparison, plus how to migrate your
          Etsy copy to Shopify.
        </p>
      </header>

      <article className="prose prose-emerald max-w-none">
        <p>
          Etsy and Shopify have very different fee structures, which directly
          affects how much profit you keep on each sale. Here is a direct
          comparison.
        </p>

        <h2>Etsy fees</h2>
        <ul>
          <li>Listing fee: $0.20 per item</li>
          <li>Transaction fee: 6.5%</li>
          <li>Payment processing: ~3% + $0.25</li>
          <li>Offsite Ads: 12%–15%</li>
        </ul>

        <h2>Shopify fees</h2>
        <ul>
          <li>Monthly subscription: from $39 (Basic)</li>
          <li>Payment processing: 2.9% + $0.30 (Shopify Payments)</li>
          <li>No transaction fee, no listing fee</li>
        </ul>

        <h2>Margin comparison</h2>
        <p>
          Assume a $50 sale, $10 cost, $5 shipping:
        </p>
        <ul>
          <li><strong>Etsy</strong>: $0.20 listing + $3.58 transaction + $1.90 payment = ~$5.68 in fees, net profit ~$29.32, margin ~59%.</li>
          <li><strong>Shopify</strong>: $1.75 payment + monthly fee amortized (at 100 sales/month, $0.39 each) = ~$2.14 in fees, net profit ~$32.86, margin ~66%.</li>
        </ul>
        <p>
          At higher volume, Shopify usually wins on margin. At low volume, Etsy
          has the advantage of no monthly commitment.
        </p>

        <h2>Moving from Etsy to Shopify</h2>
        <p>
          When migrating, the key is rewriting Etsy-style titles and
          descriptions into Shopify-optimized SEO copy. Shopify titles perform
          best under 70 characters, and descriptions should be concise with a
          clear call to action.
        </p>
        <p>
          Use our{" "}
          <Link className="text-emerald-600 underline" href="/etsy-to-shopify-listing-converter">
            Etsy to Shopify listing converter
          </Link>{" "}
          to generate optimized titles, meta descriptions, and social copy in
          one click.
        </p>
      </article>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">{t("blog.related")}</h2>
        <ul className="space-y-2 text-sm">
          <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-fees-2026">{t("blog.relatedFees")}</Link></li>
          <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-ai-disclosure-rules">{t("blog.relatedAi")}</Link></li>
          <li><Link className="text-emerald-600 hover:underline" href="/etsy-to-shopify-listing-converter">{t("blog.relatedConverterTool")}</Link></li>
          <li><Link className="text-emerald-600 hover:underline" href="/etsy-profit-calculator">{t("blog.relatedProfitTool")}</Link></li>
        </ul>
      </section>

      <Faq items={faqs} />
    </main>
  );
}
