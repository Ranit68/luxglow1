import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms and Conditions",
  description:
    "Review Luxe&Glow terms and conditions for browsing, account access, orders, payments, and delivery.",
  path: "/terms-conditions",
});

export default function TermsLayout({ children }) {
  return children;
}
