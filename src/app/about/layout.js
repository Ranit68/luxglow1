import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Luxe&Glow",
  description:
    "Learn about Luxe&Glow, our saree styling approach, curated collections, and the craftsmanship behind our modern Indian fashion store.",
  path: "/about",
  keywords: [
    "about luxe and glow",
    "saree brand india",
    "designer saree store about",
  ],
});

export default function AboutLayout({ children }) {
  return children;
}
