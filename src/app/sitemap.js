import { absoluteUrl } from "@/lib/seo";

export default function sitemap() {
  const routes = [
    "/",
    "/shop",
    "/about",
    "/contact",
    "/shipping-policy",
    "/refund-policy",
    "/privacy-policy",
    "/terms-conditions",
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/shop" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/shop" ? 0.9 : 0.6,
  }));
}
