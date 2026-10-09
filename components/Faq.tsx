import { useLanguage } from "@/components/LanguageProvider";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
}

/**
 * 可复用 FAQ 区块（<details> 折叠 + FAQPage 结构化数据）。
 * 同时渲染可见内容与 application/ld+json，利于 SEO 富媒体结果。
 */
export default function Faq({ items }: FaqProps) {
  const { t } = useLanguage();
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold">{t("faq.title")}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="rounded-lg border border-gray-200 p-4"
          >
            <summary className="cursor-pointer font-medium">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
