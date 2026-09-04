const CANONICAL_SITE_URL = "https://luxeglow.in";

function isLoopbackHost(rawUrl) {
  try {
    const host = new URL(rawUrl).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host.endsWith(".local");
  } catch {
    return true;
  }
}

// Canonical production domain is luxeglow.in. We never want localhost or a
// transient preview URL to leak into the sitemap / canonical tags, so if
// NEXT_PUBLIC_SITE_URL is unset or points at a loopback/development host we
// always fall back to the live domain.
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = (configuredUrl && !isLoopbackHost(configuredUrl) ? configuredUrl : CANONICAL_SITE_URL).replace(/\/+$/, "");

export const siteConfig = {
  name: "Luxe&Glow",
  shortName: "Luxe&Glow",
  description:
    "Shop premium sarees online in India, including silk, Mashru, Mashru Banarasi, Banarasi, Bengali style, fancy, festive, and party wear sarees.",
  url: siteUrl,
  ogImage:
    "https://images.pexels.com/photos/33439042/pexels-photo-33439042.jpeg?cs=srgb&dl=pexels-fliqaindia-33439042.jpg&fm=jpg",
  contactEmail: "support@luxeglow.in",
  phone: "+91-9933614554",
  whatsapp: "https://wa.me/919933614554",
  instagram: "https://www.instagram.com/luxeglow161",
  addressRegion: "West Bengal",
  addressCountry: "IN",
  areaServed: "IN",
};

export const primaryKeywords = [
  "buy sarees online india",
  "premium sarees online",
  "designer sarees online india",
  "silk sarees online",
  "banarasi sarees online",
  "mashru silk saree",
  "mashru banarasi saree",
  "bengali style saree",
  "party wear sarees online",
  "fancy sarees online",
  "festive sarees online",
  "wedding sarees online india",
  "traditional sarees online",
  "indian sarees online",
  "luxe glow sarees",
  "luxe and glow sarees",
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
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
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
