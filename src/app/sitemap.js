import { absoluteUrl } from "@/lib/seo";
import { getAdminDb } from "@/lib/firebaseAdmin";

export default async function sitemap() {
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

  const entries = routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/shop" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/shop" ? 0.9 : 0.6,
  }));

  try {
    const db = getAdminDb();
    const snap = await db.collection("products").get();
    const products = snap.docs.map((d) => ({
      url: absoluteUrl(`/shop/${d.id}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...entries, ...products];
  } catch (e) {
    return entries;
  }
}
