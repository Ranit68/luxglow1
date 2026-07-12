import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Designer Saree Details",
  description:
    "Explore saree details, fabric feel, pricing, delivery availability, and buying options before checkout.",
  path: "/shop",
  keywords: [
    "designer saree details",
    "saree product page",
    "buy saree online india",
  ],
});

export default function ProductLayout({ children }) {
  return children;
}
