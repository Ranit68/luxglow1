import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shipping Policy",
  description:
    "Read Luxe&Glow shipping timelines, delivery coverage, tracking updates, and cash on delivery availability.",
  path: "/shipping-policy",
});

export default function ShippingPolicyLayout({ children }) {
  return children;
}
