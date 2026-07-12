import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Refund Policy",
  description:
    "Review Luxe&Glow refund and return terms for saree purchases, cancellations, and order issues.",
  path: "/refund-policy",
});

export default function RefundPolicyLayout({ children }) {
  return children;
}
