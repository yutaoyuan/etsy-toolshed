import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import SiteNav from "@/components/SiteNav";
import { getServerLang } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  const t = (k: string) => translations[lang][k] ?? translations.en[k] ?? k;

  const title = t("site.title");
  const description = t("home.subtitle");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | EtsyToolshed",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "EtsyToolshed",
      title,
      description,
      url: SITE_URL,
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
      locale: lang === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("etsytoolshed_lang")?.value;
  const lang = langCookie === "zh" ? "zh" : "en";

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <LanguageProvider>
          <SiteNav />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
