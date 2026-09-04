import { absoluteUrl } from "@/lib/seo";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { blogPosts } from "@/content/blog";

export default async function sitemap() {
  const routes = [
    "/",
    "/shop",
    "/blog",
    "/about",
    "/contact",
    "/shipping-policy",
    "/refund-policy",
    "/privacy-policy",
    "/terms-conditions",
  ];

  const collectionViews = [
    "/shop?collection=ganesh-chaturthi",
    "/shop?collection=durga-puja",
    "/shop?collection=diwali",
  ];

  const priceViews = [
    "/shop?price=under-1000",
    "/shop?price=under-1500",
    "/shop?price=under-2000",
    "/shop?price=under-3000",
    "/shop?price=under-5000",
    "/shop?price=between-1000-2000",
    "/shop?price=between-2000-5000",
  ];

  const blogEntries = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const entries = routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/shop" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/shop" ? 0.9 : 0.6,
  }));

  const landingEntries = [...collectionViews, ...priceViews].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
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

    return [...entries, ...blogEntries, ...products, ...landingEntries];
  } catch (e) {
    return [...entries, ...blogEntries, ...landingEntries];
  }
}
