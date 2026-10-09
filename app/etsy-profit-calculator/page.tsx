import ProfitContent from "@/components/pages/ProfitContent";
import { pageMetadata } from "@/lib/i18n/server";

export const generateMetadata = () =>
  pageMetadata("profit", "/etsy-profit-calculator");

export default function ProfitCalculatorPage() {
  return <ProfitContent />;
}

