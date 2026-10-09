"use client";

import AuthForm from "@/components/AuthForm";
import { useLanguage } from "@/components/LanguageProvider";

export default function LoginContent() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold">{t("login.h1")}</h1>
      <p className="mb-8 text-sm text-gray-600">{t("login.subtitle")}</p>
      <AuthForm />
    </main>
  );
}
