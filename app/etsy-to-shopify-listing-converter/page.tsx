import ConverterContent from "@/components/pages/ConverterContent";
import { pageMetadata } from "@/lib/i18n/server";

export const generateMetadata = () =>
  pageMetadata("converter", "/etsy-to-shopify-listing-converter");

export default function EtsyToShopifyConverterPage() {
  return <ConverterContent />;
}

