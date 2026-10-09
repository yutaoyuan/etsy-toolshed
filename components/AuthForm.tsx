"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

type Mode = "signin" | "signup";

export default function AuthForm() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError(t("login.supabaseNotConfigured"));
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage(t("login.confirmEmail"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // 登录成功后刷新页面，让服务端拿到 session
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.authFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <div className="flex rounded-lg border border-gray-200 p-1">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md py-2 text-sm font-medium ${
            mode === "signup"
              ? "bg-emerald-600 text-white"
              : "text-gray-600"
          }`}
        >
          {t("login.signup")}
        </button>
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-md py-2 text-sm font-medium ${
            mode === "signin"
              ? "bg-emerald-600 text-white"
              : "text-gray-600"
          }`}
        >
          {t("login.signin")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-1 text-sm">
          <span>{t("login.email")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>{t("login.password")}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            minLength={6}
            required
          />
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading
            ? t("login.pleaseWait")
            : mode === "signup"
              ? t("login.createAccount")
              : t("login.signin")}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}
    </div>
  );
}
