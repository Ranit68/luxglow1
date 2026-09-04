import { siteConfig } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/login",
          "/signup",
          "/profile",
          "/saved",
        ],
      },
    ],
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/image-sitemap.xml`],
  };
}
