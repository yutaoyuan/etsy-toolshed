"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, format, type Language } from "@/lib/i18n/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
  t: (key: string) => string;
  /** 带变量插值的翻译，{n} 等占位符会被替换 */
  tf: (key: string, vars: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LANG_COOKIE = "etsytoolshed_lang";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const fromCookie = getCookie(LANG_COOKIE);
  if (fromCookie === "en" || fromCookie === "zh") return fromCookie;
  const browser = window.navigator.language.toLowerCase();
  return browser.startsWith("zh") ? "zh" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // 初始化（读取 cookie / 浏览器语言）
  useEffect(() => {
    setLanguageState(detectInitialLanguage());
  }, []);

  // 持久化到 cookie（供服务端 SSR 读取）+ 更新 html lang 属性
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.cookie = `${LANG_COOKIE}=${language}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (lang) => setLanguageState(lang),
      toggle: () => setLanguageState((prev) => (prev === "en" ? "zh" : "en")),
      t: (key) => translations[language][key] ?? translations.en[key] ?? key,
      tf: (key, vars) =>
        format(
          translations[language][key] ?? translations.en[key] ?? key,
          vars,
        ),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
