import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop Premium Sarees Online",
  description:
    "Browse premium sarees online at Luxe&Glow, including silk, Mashru, Mashru Banarasi, Banarasi, Bengali style, fancy, festive, wedding, and party wear sarees.",
  path: "/shop",
  keywords: [
    "shop premium sarees online",
    "premium sarees online india",
    "silk sarees online",
    "mashru silk saree",
    "mashru banarasi saree",
    "banarasi sarees online",
    "bengali style saree",
    "fancy sarees online",
    "party wear sarees online",
    "festive sarees online",
    "wedding sarees online india",
    "designer sarees online india",
    "latest saree collection",
  ],
});

export default function ShopLayout({ children }) {
  return children;
}
