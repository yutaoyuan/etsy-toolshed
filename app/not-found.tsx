import Link from "next/link";
import { getServerLang, st } from "@/lib/i18n/server";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const lang = await getServerLang();
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-bold text-emerald-600">404</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {st("notFound.title", lang)}
      </h1>
      <p className="mt-3 text-gray-600">{st("notFound.description", lang)}</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
      >
        {st("notFound.backHome", lang)}
      </Link>
    </main>
  );
}
