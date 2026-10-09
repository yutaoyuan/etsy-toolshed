"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

/**
 * 站点导航栏（客户端组件，用于读取语言上下文并渲染翻译后的链接）。
 */
export default function SiteNav() {
  const { t, toggle, language } = useLanguage();
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm transition-colors ${
      isActive(href)
        ? "font-medium text-emerald-600"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <header className="border-b border-gray-100">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/"
            className={`font-semibold ${
              isActive("/") ? "text-emerald-600" : "text-gray-900"
            }`}
          >
            EtsyToolshed
          </Link>
          <Link href="/etsy-profit-calculator" className={linkClass("/etsy-profit-calculator")}>
            {t("tools.profit")}
          </Link>
          <Link href="/etsy-ai-disclosure-checker" className={linkClass("/etsy-ai-disclosure-checker")}>
            {t("tools.compliance")}
          </Link>
          <Link href="/etsy-to-shopify-listing-converter" className={linkClass("/etsy-to-shopify-listing-converter")}>
            {t("tools.converter")}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href="/blog" className={linkClass("/blog")}>
            {t("nav.blog")}
          </Link>
          <Link href="/pricing" className={linkClass("/pricing")}>
            {t("nav.pricing")}
          </Link>
          <Link href="/login" className={linkClass("/login")}>
            {t("nav.signIn")}
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
            aria-label="Switch language"
          >
            {language === "en" ? "中文" : "EN"}
          </button>
        </div>
      </nav>
    </header>
  );
}
