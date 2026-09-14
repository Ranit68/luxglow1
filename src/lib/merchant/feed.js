// Google Merchant Center text (TSV) feed builder.
//
// Reuses the exact same source-of-truth mapping as the Merchant API sync
// (product SEO, primary images) so every attribute stays consistent across the
// push-based Merchant API and this file-based feed. Runs fully server-side and
// reads the website database live on every call — nothing is hard-coded.

import { CANONICAL_SITE_URL } from "./config";
import {
  BRAND_NAME,
  GOOGLE_PRODUCT_CATEGORY,
  resolveAllImages,
  buildDescription,
  hasAvailableStock,
  isPublicHttpsUrl,
} from "./mapper";

const HEADERS = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "additional_image_link",
  "price",
  "availability",
  "condition",
  "brand",
  "google_product_category",
  "product_type",
  "sku",
  "color",
  "size",
  "material",
  "gender",
  "age_group",
];

const MAX_TITLE_LENGTH = 150;

function stringify(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (value == null) return "";
  return String(value).trim();
}

// Text feeds cannot contain tabs, line breaks or HTML tags.
function cleanText(value) {
  return stringify(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanUrl(value) {
  return String(value ?? "").trim().replace(/[\t\r\n]+/g, "");
}

function formatPriceInr(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  const amount = Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(2);
  return `${amount} INR`;
}

function buildProductType(product) {
  if (Array.isArray(product?.categories)) {
    const parts = product.categories.map(cleanText).filter(Boolean).slice(0, 10);
    if (parts.length) return parts.join(" > ");
  }
  return cleanText(product?.category);
}

export function buildMerchantFeed(products = []) {
  const lines = [HEADERS.join("\t")];
  const seen = new Set();
  const errors = [];
  let included = 0;

  for (const product of products) {
    const id = cleanText(product?.id);
    const offerId = cleanText(product?.sku) || id;
    const rowError = (reason) =>
      errors.push({ id: id || "(no id)", reason });

    if (!offerId) {
      rowError("Missing id/SKU");
      continue;
    }
    if (seen.has(offerId)) {
      rowError(`Duplicate id "${offerId}" skipped`);
      continue;
    }

    const title = cleanText(product?.name).slice(0, MAX_TITLE_LENGTH);
    const description = cleanText(buildDescription(product));
    const link = `${CANONICAL_SITE_URL}/shop/${encodeURIComponent(id)}`;
    const images = resolveAllImages(product)
      .filter((url) => url && isPublicHttpsUrl(url))
      .map(cleanUrl);
    const imageLink = images[0] || "";
    const price = formatPriceInr(product?.price);
    const availability = hasAvailableStock(product) ? "in_stock" : "out_of_stock";

    if (!title) {
      rowError("Missing title");
      continue;
    }
    if (!description) {
      rowError("Missing description");
      continue;
    }
    if (!imageLink) {
      rowError("No publicly accessible HTTPS image found");
      continue;
    }
    if (!price) {
      rowError(`Invalid price ("${product?.price}")`);
      continue;
    }

    seen.add(offerId);
    included += 1;

    // Keep a single alternate image so every row matches the header columns
    // exactly. Multiple tab-separated URLs in one cell would render as extra
    // "image 1 / image 2" columns in feed viewers.
    const additionalImageLink = images.slice(1, 2).join("\t");

    lines.push(
      [
        offerId, // id
        title,
        description,
        link,
        imageLink,
        additionalImageLink,
        price,
        availability,
        "new", // condition
        BRAND_NAME,
        GOOGLE_PRODUCT_CATEGORY,
        buildProductType(product),
        offerId, // sku
        cleanText(product?.color || product?.colors),
        cleanText(product?.size),
        cleanText(product?.fabric || product?.material),
        cleanText(product?.gender) || "female",
        cleanText(product?.ageGroup) || "adult",
      ].join("\t")
    );
  }

  return {
    tsv: included ? `${lines.join("\r\n")}\r\n` : lines.join("\r\n"),
    total: products.length,
    included,
    skipped: products.length - included,
    errors,
  };
}