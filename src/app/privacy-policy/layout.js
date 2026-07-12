import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Read how Luxe&Glow collects, uses, and protects customer data for browsing, orders, and account activity.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
