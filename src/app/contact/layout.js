import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Luxe&Glow",
  description:
    "Contact Luxe&Glow for saree orders, delivery questions, product support, and shopping assistance.",
  path: "/contact",
  keywords: [
    "contact saree store",
    "luxe and glow contact",
    "saree support india",
  ],
});

export default function ContactLayout({ children }) {
  return children;
}
