import BlogIndexContent from "@/components/pages/BlogIndexContent";
import { pageMetadata } from "@/lib/i18n/server";

export const generateMetadata = () => pageMetadata("blog", "/blog");

export default function BlogIndexPage() {
  return <BlogIndexContent />;
}

