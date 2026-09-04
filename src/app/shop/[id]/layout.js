import { getAdminDb } from "@/lib/firebaseAdmin";
import { createMetadata, siteConfig, absoluteUrl, primaryKeywords } from "@/lib/seo";

function getPrimaryCategory(product) {
  const values = [];

  if (Array.isArray(product?.categories)) {
    values.push(...product.categories);
  } else if (product?.categories) {
    values.push(...String(product.categories).split(","));
  }

  if (Array.isArray(product?.category)) {
    values.push(...product.category);
  } else if (product?.category) {
    values.push(...String(product.category).split(","));
  }

  return values.map((item) => String(item).trim()).filter(Boolean)[0] || "designer";
}

async function getProduct(id) {
  try {
    const db = getAdminDb();
    const snap = await db.collection("products").doc(id).get();
    if (snap.exists) return { id: snap.id, ...snap.data() };
  } catch (e) {
    // fail quietly — metadata will fall back to site defaults
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  const title = product?.name
    ? `${product.name} — Buy Online at Luxe&Glow`
    : `${siteConfig.name} — Designer Saree Details`;
  const description = product?.description
    ? product.description.slice(0, 158)
    : siteConfig.description;
  const category = getPrimaryCategory(product);
  const image =
    product?.transparentImageUrl ||
    product?.pngImageUrl ||
    product?.noBgImageUrl ||
    product?.cutoutImageUrl ||
    product?.imageUrl ||
    product?.images?.[0] ||
    siteConfig.ogImage;

  const parentMeta = createMetadata({
    title,
    description,
    path: `/shop/${id}`,
    keywords: [
      ...primaryKeywords,
      `${category} saree`,
      "designer saree details",
      "buy saree online india",
      ...(product?.fabric ? [`${product.fabric} saree`] : []),
    ],
    images: [image],
  });

  return parentMeta;
}

export default function ProductLayout({ children, params }) {
  return <div id="product-page">{children}</div>;
}
