import ComplianceContent from "@/components/pages/ComplianceContent";
import { pageMetadata } from "@/lib/i18n/server";

export const generateMetadata = () =>
  pageMetadata("compliance", "/etsy-ai-disclosure-checker");

export default function AiDisclosureCheckerPage() {
  return <ComplianceContent />;
}

