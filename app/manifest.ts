import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EtsyToolshed",
    short_name: "EtsyToolshed",
    description:
      "Free tools for Etsy sellers — profit calculator, AI disclosure checker, and Etsy-to-Shopify listing converter.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      {
        src: "/apple-icon.jpg",
        sizes: "1920x1920",
        type: "image/jpeg",
      },
    ],
  };
}
