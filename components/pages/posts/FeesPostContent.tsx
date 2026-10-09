"use client";

import Link from "next/link";
import Faq from "@/components/Faq";
import { useLanguage } from "@/components/LanguageProvider";
import { buildFaq } from "@/lib/i18n/faq";

export default function FeesPostContent() {
  const { t, language: lang } = useLanguage();
  const faqs = buildFaq(t, "feesBlog", 4);

  if (lang === "zh") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8">
          <p className="text-sm text-emerald-600">{t("blog.post.fees.category")}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("blog.post.fees.title")}
          </h1>
          <p className="mt-3 text-gray-600">{t("blog.post.fees.excerpt")}</p>
        </header>

        <article className="prose prose-emerald max-w-none">
          <p>
            理解 Etsy 收费的结构，是盈利的第一步。每一次成交，Etsy 都会在多个环节收费。知道这些费用是什么、怎么算，你才能正确定价。
          </p>

          <h2>1. 上架费</h2>
          <p>每件商品 0.20 美元。商品售出后，Etsy 会自动上架副本并再次收取 0.20 美元。多件商品（多件属性）每件收取 0.20 美元。</p>

          <h2>2. 交易费</h2>
          <p>成交价的 6.5%，按商品价格加运费计算。</p>
          <blockquote>交易费 = (商品价格 + 运费) × 6.5%</blockquote>

          <h2>3. 支付处理费</h2>
          <p>美国约为 3% + 0.25 美元。其他国家费率和币种不同。</p>

          <h2>4. 站外广告费</h2>
          <p>若订单来自 Etsy 站外广告，Etsy 收取成交价的 15%（年销售额超过 10,000 美元的卖家为 12%）。</p>

          <h2>5. 货币转换费</h2>
          <p>若你的币种与买家支付币种不同，Etsy 收取 2.5% 的转换费。</p>

          <h2>利润公式</h2>
          <p>
            <strong>净利润</strong> = 售价 − 上架费 − 交易费 − 支付处理费 − 站外广告费 − 成本 − 人工 − 包装
          </p>

          <h2>如何盈利定价</h2>
          <ol>
            <li>把所有成本和费用加起来。</li>
            <li>决定目标利润率。</li>
            <li>用「盈亏平衡价」反推：售价需覆盖所有费用才不亏。</li>
            <li>在盈亏平衡价基础上加目标利润。</li>
          </ol>

          <p>
            用我们的 <Link className="text-emerald-600 underline" href="/etsy-profit-calculator">Etsy 利润计算器</Link> 可以一键得出费用和盈亏平衡价。
          </p>
        </article>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">{t("blog.related")}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-ai-disclosure-rules">{t("blog.relatedAi")}</Link></li>
            <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-vs-shopify-margin">{t("blog.relatedMargin")}</Link></li>
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
        <p className="text-sm text-emerald-600">Fees &amp; Pricing</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Etsy Fees 2026: A Complete Breakdown
        </h1>
        <p className="mt-3 text-gray-600">
          Every Etsy fee explained, with formulas and a pricing strategy that
          keeps your margin healthy.
        </p>
      </header>

      <article className="prose prose-emerald max-w-none">
        <p>
          Understanding Etsy&apos;s fee structure is the first step to running a
          profitable shop. Etsy charges fees at several points on every sale.
          Once you know what they are and how they&apos;re calculated, you can
          price correctly and protect your margin.
        </p>

        <h2>1. Listing fee</h2>
        <p>
          $0.20 per item. When an item sells, Etsy auto-renews the listing and
          charges another $0.20. Multi-quantity listings charge $0.20 per
          quantity.
        </p>

        <h2>2. Transaction fee</h2>
        <p>6.5% of the sale price, calculated on item price plus shipping.</p>
        <blockquote>
          Transaction fee = (item price + shipping) × 6.5%
        </blockquote>

        <h2>3. Payment processing fee</h2>
        <p>
          In the US this is roughly 3% + $0.25. Rates and currencies vary by
          country.
        </p>

        <h2>4. Offsite Ads fee</h2>
        <p>
          If a sale comes from an Etsy offsite ad, Etsy charges 15% of the sale
          price (12% for sellers with over $10,000 in annual sales).
        </p>

        <h2>5. Currency conversion fee</h2>
        <p>
          If your shop currency differs from the buyer&apos;s payment currency,
          Etsy charges a 2.5% conversion fee.
        </p>

        <h2>The profit formula</h2>
        <p>
          <strong>Net profit</strong> = sale price − listing fee − transaction
          fee − payment processing fee − offsite ads fee − cost − labor −
          packaging
        </p>

        <h2>How to price for profit</h2>
        <ol>
          <li>Add up all your costs and fees.</li>
          <li>Decide your target profit margin.</li>
          <li>Work backwards from your break-even price: the sale price must cover every fee to avoid losing money.</li>
          <li>Add your target profit on top of break-even.</li>
        </ol>

        <p>
          Our{" "}
          <Link className="text-emerald-600 underline" href="/etsy-profit-calculator">
            Etsy profit calculator
          </Link>{" "}
          gives you the fees and break-even price in one click.
        </p>
      </article>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">{t("blog.related")}</h2>
        <ul className="space-y-2 text-sm">
          <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-ai-disclosure-rules">{t("blog.relatedAi")}</Link></li>
          <li><Link className="text-emerald-600 hover:underline" href="/blog/etsy-vs-shopify-margin">{t("blog.relatedMargin")}</Link></li>
          <li><Link className="text-emerald-600 hover:underline" href="/etsy-profit-calculator">{t("blog.relatedProfitTool")}</Link></li>
        </ul>
      </section>

      <Faq items={faqs} />
    </main>
  );
}
