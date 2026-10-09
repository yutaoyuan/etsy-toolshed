interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * 通用 JSON-LD 结构化数据组件。
 * 用法：<JsonLd data={{ "@type": "SoftwareApplication", ... }} />
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
