import { createMetadata, siteConfig, primaryKeywords } from "@/lib/seo";

export default function Head() {
  const title = `${siteConfig.name} — The Heritage Series`;
  const description =
    "Discover curated saree collections: silk, cotton, bridal, festive, and party wear — styled for modern Indian occasions.";

  return createMetadata({
    title,
    description,
    path: "/shop",
    keywords: [...primaryKeywords, "heritage sarees", "heritage saree collection"],
  });
}
