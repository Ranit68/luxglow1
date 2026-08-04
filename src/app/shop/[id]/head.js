import React from "react";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { siteConfig, absoluteUrl } from "@/lib/seo";

export default async function Head({ params }) {
  const id = params.id;
  let product = null;

  try {
    const snap = await getAdminDb().collection("products").doc(id).get();
    if (snap.exists) product = snap.data();
  } catch (e) {
    // fail quietly — metadata will fallback to site defaults
  }

  const title = product?.name ? `${product.name} | ${siteConfig.name}` : siteConfig.name;
  const description = product?.description
    ? product.description.slice(0, 155)
    : siteConfig.description;
  const image = product?.imageUrl || (product?.images && product.images[0]) || siteConfig.ogImage;
  const url = absoluteUrl(`/shop/${id}`);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product?.name || siteConfig.name,
    image: image ? [image] : undefined,
    description: product?.description || siteConfig.description,
    sku: product?.sku || id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product?.price ? String(product.price) : undefined,
      availability: product?.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: product?.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: String(product.rating),
          reviewCount: product.ratingCount || 0,
        }
      : undefined,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={url} />

      <meta property="og:type" content="product" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
