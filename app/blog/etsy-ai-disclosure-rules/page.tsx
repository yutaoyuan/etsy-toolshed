import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import AiPostContent from "@/components/pages/posts/AiPostContent";
import { pageMetadata, getServerLang, st } from "@/lib/i18n/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const POST_URL = `${SITE_URL}/blog/etsy-ai-disclosure-rules`;
const PUBLISHED = "2026-10-09";

export const generateMetadata = () =>
  pageMetadata("aiPost", "/blog/etsy-ai-disclosure-rules");

export default async function EtsyAiDisclosureRulesPage() {
  const lang = await getServerLang();
  const headline = st("meta.aiPost.title", lang);
  const description = st("meta.aiPost.description", lang);
  const homeLabel = st("nav.home", lang);
  const blogLabel = st("nav.blog", lang);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: blogLabel, item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: headline, item: POST_URL },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: { "@type": "Organization", name: "EtsyToolshed" },
    publisher: {
      "@type": "Organization",
      name: "EtsyToolshed",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": POST_URL },
    image: `${SITE_URL}/og.jpg`,
    inLanguage: lang,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">{homeLabel}</Link>
        {" / "}
        <Link href="/blog" className="hover:text-gray-700">{blogLabel}</Link>
        {" / "}
        <span>{headline}</span>
      </nav>
      <AiPostContent />
      <JsonLd data={[breadcrumb, article]} />
    </main>
  );
}
