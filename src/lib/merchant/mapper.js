// Pure product -> Merchant API ProductInput mapper.
// No Firebase / next imports so it can run anywhere (including quick node
// tests). The website database remains the single source of truth.

import { CANONICAL_SITE_URL, MERCHANT_CONFIG } from "./config";

export const BRAND_NAME = "Luxe & Glow";
export const GOOGLE_PRODUCT_CATEGORY =
  "Apparel & Accessories > Clothing > Clothing Accessories > Sarees";

const MAX_TITLE_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_TOTAL_IMAGES = 10;

function stringify(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (value == null) return "";
  return String(value).trim();
}

function stripHtml(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isPublicHttpsUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Same precedence the site uses for its hero image on the product page.
export function resolvePrimaryImage(product) {
  return (
    product?.transparentImageUrl ||
    product?.pngImageUrl ||
    product?.noBgImageUrl ||
    product?.cutoutImageUrl ||
    product?.imageUrl ||
    product?.images?.[0] ||
    ""
  );
}

export function resolveAllImages(product) {
  const ordered = [];
  pushIfMissing(ordered, resolvePrimaryImage(product));
  if (Array.isArray(product?.images)) {
    for (const url of product.images) pushIfMissing(ordered, url);
  }
  for (const field of [
    "imageUrl",
    "transparentImageUrl",
    "pngImageUrl",
    "noBgImageUrl",
    "cutoutImageUrl",
  ]) {
    pushIfMissing(ordered, product?.[field]);
  }

  return ordered.slice(0, MAX_TOTAL_IMAGES).map((url) => {
    if (!isPublicHttpsUrl(url)) return null;
    return url;
  });
}

function pushIfMissing(list, value) {
  const url = String(value || "").trim();
  if (!url) return;
  if (list.some((item) => item === url)) return;
  list.push(url);
}

// Real inventory logic mirrors src/lib/productStock.js.
export function hasAvailableStock(product) {
  if (Object.prototype.hasOwnProperty.call(product, "stock")) {
    return Number.isFinite(Number(product.stock)) && Number(product.stock) > 0;
  }
  if (Object.prototype.hasOwnProperty.call(product, "quantity")) {
    return (
      Number.isFinite(Number(product.quantity)) &&
      Number(product.quantity) > 0
    );
  }
  // No inventory tracked on the website -> default to in stock so the item
  // stays visible on Google until inventory data is added.
  return true;
}

function micros(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return String(Math.round(numeric * 1e6));
}

export function buildDescription(product) {
  const base = stripHtml(product?.description);
  const details = [];

  if (stringify(product?.fabric)) {
    details.push(`Fabric: ${stringify(product.fabric)}`);
  }
  if (stringify(product?.color)) {
    details.push(`Color: ${stringify(product.color)}`);
  }
  const blouse = product?.blouseIncluded || product?.blouse;
  if (blouse) {
    details.push(
      /included|yes|true|free/i.test(String(blouse))
        ? "Stitched blouse included"
        : `Blouse: ${stringify(blouse)}`
    );
  }
  if (stringify(product?.pattern)) {
    details.push(`Pattern: ${stringify(product.pattern)}`);
  }
  if (stringify(product?.material)) {
    details.push(`Material: ${stringify(product.material)}`);
  }

  const detailLine = details.length ? details.join(" • ") : "";
  const body = base || `Premium ${stringify(product?.category) || "designer"} saree by ${BRAND_NAME}.`;
  const description = [body, detailLine].filter(Boolean).join("\n\n");
  return description.slice(0, MAX_DESCRIPTION_LENGTH).trim();
}

function cleanOfferId(value) {
  const id = String(value || "")
    .trim()
    .replace(/\s+/g, "-");
  // Google permits letters, numbers, underscores, hyphens, tildes and dots.
  return /^[A-Za-z0-9_~.-]+$/.test(id) ? id : "";
}

export function mapProductToMerchantInput(product) {
  const id = stringify(product?.id);
  const errors = [];

  const offerId = cleanOfferId(
    stringify(product?.sku) || id
  );
  if (!offerId) {
    return {
      ok: false,
      productId: id,
      offerId: "",
      errors: [
        `Missing usable product id/SKU ("${stringify(product?.sku) || id || "(empty)"}").`,
      ],
    };
  }

  const title = stringify(product?.name).slice(0, MAX_TITLE_LENGTH);
  if (!title) {
    return {
      ok: false,
      productId: id,
      offerId,
      errors: ["Missing product title."],
    };
  }

  const priceMicros = micros(product?.price);
  if (!priceMicros) {
    return {
      ok: false,
      productId: id,
      offerId,
      errors: [`Missing or invalid price (got "${product?.price}").`],
    };
  }

  const images = resolveAllImages(product);
  const imageLink = images[0] || null;
  if (!imageLink) {
    return {
      ok: false,
      productId: id,
      offerId,
      errors: [
        "No publicly accessible HTTPS image found (imageUrl / images / transparent variants).",
      ],
    };
  }

  const attributes = {
    title,
    description: buildDescription(product),
    link: `${CANONICAL_SITE_URL}/shop/${encodeURIComponent(id)}`,
    imageLink,
    availability: hasAvailableStock(product) ? "IN_STOCK" : "OUT_OF_STOCK",
    condition: "NEW",
    brand: BRAND_NAME,
    googleProductCategory: GOOGLE_PRODUCT_CATEGORY,
    price: {
      valueMicros: priceMicros,
      currencyCode: "INR",
    },
    customLabel0: stringify(product?.category) || "Saree",
  };

  if (Array.isArray(product?.categories)) {
    attributes.productTypes = product.categories
      .map((item) => stringify(item))
      .filter(Boolean)
      .slice(0, 10);
  }

  if (images.length > 1) {
    attributes.additionalImageLinks = images.slice(1);
  }

  const mrpMicros = micros(product?.mrp);
  if (mrpMicros && Number(mrpMicros) > Number(priceMicros)) {
    attributes.maximumRetailPrice = {
      valueMicros: mrpMicros,
      currencyCode: "INR",
    };
  }

  return {
    ok: true,
    productId: id,
    offerId,
    input: {
      offerId,
      contentLanguage: MERCHANT_CONFIG.contentLanguage,
      feedLabel: MERCHANT_CONFIG.feedLabel,
      productAttributes: attributes,
    },
  };
}