// Server-only Google Merchant Center configuration.
// Every Google-specific value lives in server environment variables (Vercel
// project settings / .env.local), never in client code or NEXT_PUBLIC_* vars.

const REQUIRED_KEYS = [
  { key: "GOOGLE_MERCHANT_ID", label: "Merchant Center account ID" },
  {
    key: "GOOGLE_MERCHANT_DATA_SOURCE_ID",
    label: "Merchant Center data source ID",
  },
];

export const MERCHANT_CONFIG = {
  merchantId: process.env.GOOGLE_MERCHANT_ID || "",
  dataSourceId: process.env.GOOGLE_MERCHANT_DATA_SOURCE_ID || "",
  contentLanguage: process.env.GOOGLE_MERCHANT_CONTENT_LANGUAGE || "en",
  feedLabel: process.env.GOOGLE_MERCHANT_FEED_LABEL || "IN",
  syncSecret: process.env.MERCHANT_SYNC_SECRET || "",
};

// Canonical production domain is www.luxeglow.in. The non-www host
// permanently redirects to www, so all Merchant URLs must target www.
export const CANONICAL_SITE_URL = "https://www.luxeglow.in";

export function getDataSourceName() {
  const { merchantId, dataSourceId } = MERCHANT_CONFIG;
  if (!merchantId || !dataSourceId) return "";
  return `accounts/${merchantId}/dataSources/${dataSourceId}`;
}

export function getConfigErrors() {
  const missing = REQUIRED_KEYS.filter(({ key }) => !process.env[key]);
  if (missing.length > 0) {
    return `Missing Merchant Center environment variables: ${missing
      .map(({ key, label }) => `${key} (${label})`)
      .join(", ")}. Add them in Vercel project settings (server-side only).`;
  }
  return "";
}

export function hasValidConfig() {
  return getConfigErrors() === "";
}