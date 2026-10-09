import LoginContent from "@/components/pages/LoginContent";
import { pageMetadata } from "@/lib/i18n/server";

export const generateMetadata = () => pageMetadata("login", "/login", true);

export default function LoginPage() {
  return <LoginContent />;
}

