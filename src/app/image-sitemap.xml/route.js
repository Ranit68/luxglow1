import { getAdminDb } from "@/lib/firebaseAdmin";
import { absoluteUrl } from "@/lib/seo";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("products").get();

    const urls = snap.docs.map((doc) => {
      const data = doc.data();
      const pageUrl = absoluteUrl(`/shop/${doc.id}`);
      const images = [];
      if (data.imageUrl) images.push(data.imageUrl);
      if (Array.isArray(data.images)) images.push(...data.images);

      const imageTags = images
        .map((img) => `
          <image:image>
            <image:loc>${img}</image:loc>
            <image:caption>${escapeXml(data.name || "")}</image:caption>
            <image:title>${escapeXml(data.name || "")}</image:title>
          </image:image>`)
        .join("");

      return `
        <url>
          <loc>${pageUrl}</loc>
          <priority>0.8</priority>
          ${imageTags}
        </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${urls.join("\n")}
      </urlset>`;

    return new Response(xml, { headers: { "Content-Type": "application/xml" } });
  } catch (e) {
    return new Response("", { status: 500 });
  }
}

function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
