import { cookies } from "next/headers";
import { translations, type Language } from "./translations";

/** 服务端读取语言 cookie，返回当前语言。默认 en。 */
export async function getServerLang(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get("etsytoolshed_lang")?.value;
  if (value === "zh" || value === "en") return value;
  return "en";
}

/** 服务端翻译函数，优先当前语言，其次英文，最后返回 key 本身。 */
export function serverT(key: string, lang: Language): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}

/** 同步版本（在已拿到 lang 的场景使用）。 */
export function st(key: string, lang: Language): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * 生成支持多语言的页面 metadata。
 * metaKey 对应 translations 中的 meta.<metaKey>.title / .description。
 */
export async function pageMetadata(
  metaKey: string,
  canonicalPath: string,
  noindex = false,
) {
  const lang = await getServerLang();
  return {
    title: st(`meta.${metaKey}.title`, lang),
    description: st(`meta.${metaKey}.description`, lang),
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
