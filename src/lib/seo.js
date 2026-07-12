const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Luxe&Glow Sarees",
  shortName: "Luxe&Glow",
  description:
    "Buy designer sarees online in India with curated silk, cotton, bridal, organza, party wear, and festive collections.",
  url: siteUrl,
  ogImage:
    "https://images.pexels.com/photos/33439042/pexels-photo-33439042.jpeg?cs=srgb&dl=pexels-fliqaindia-33439042.jpg&fm=jpg",
  contactEmail: "support@luxeandglow.com",
};

export const primaryKeywords = [
  "sarees online",
  "buy sarees online india",
  "sarees for women",
  "designer sarees online",
  "silk saree online",
  "bridal saree online",
  "party wear saree",
  "organza saree",
  "ready to wear saree",
  "wedding sarees online",
  "cotton sarees online",
  "festive saree collection",
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  images,
  noIndex = false,
}) {
  const mergedKeywords = [...new Set([...primaryKeywords, ...keywords])];
  const imageList = images || [siteConfig.ogImage];

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      title,
      description,
      images: imageList.map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageList,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function createNoIndexMetadata(title) {
  return createMetadata({
    title,
    noIndex: true,
  });
}
