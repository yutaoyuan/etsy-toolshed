import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * 各页面的真实最后更新时间。
 * /login 已设为 noindex，因此不放入 sitemap。
 * 本站使用 cookie 式语言切换（同一 URL 依 cookie 返回中英文），
 * 因此 sitemap 不声明 hreflang（hreflang 要求不同 URL 对应不同语言）。
 */
const routes: { path: string; lastmod: string; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", lastmod: "2026-01-15", freq: "weekly", priority: 1 },
  { path: "/etsy-profit-calculator", lastmod: "2026-01-10", freq: "monthly", priority: 0.9 },
  { path: "/etsy-ai-disclosure-checker", lastmod: "2026-01-10", freq: "monthly", priority: 0.9 },
  { path: "/etsy-to-shopify-listing-converter", lastmod: "2026-01-10", freq: "monthly", priority: 0.9 },
  { path: "/pricing", lastmod: "2026-01-10", freq: "monthly", priority: 0.7 },
  { path: "/blog", lastmod: "2026-01-12", freq: "weekly", priority: 0.8 },
  { path: "/blog/etsy-fees-2026", lastmod: "2026-01-05", freq: "monthly", priority: 0.7 },
  { path: "/blog/etsy-ai-disclosure-rules", lastmod: "2026-01-08", freq: "monthly", priority: 0.7 },
  { path: "/blog/etsy-vs-shopify-margin", lastmod: "2026-01-12", freq: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(r.lastmod),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
