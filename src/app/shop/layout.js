import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop Sarees Online",
  description:
    "Browse silk, cotton, bridal, festive, ready to wear, organza, and party wear sarees online at Luxe&Glow.",
  path: "/shop",
  keywords: [
    "shop sarees online",
    "women sarees online shopping",
    "bridal saree collection",
    "party wear sarees online",
    "ready to wear saree online",
    "organza saree online",
  ],
});

export default function ShopLayout({ children }) {
  return children;
}
