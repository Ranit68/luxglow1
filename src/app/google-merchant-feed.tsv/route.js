// https://www.luxeglow.in/google-merchant-feed.tsv
//
// Always-fresh Google Merchant Center text feed generated live from the
// Firestore products collection on every request. No caching, no hard-coded
// products. If MERCHANT_FEED_SECRET is set, the feed requires the matching
// ?key=<secret> query parameter (Google Merchant Center fetches the full URL
// when you set the data source URL options).

import { getAdminDb } from "@/lib/firebaseAdmin";
import { buildMerchantFeed } from "@/lib/merchant/feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEED_SECRET = process.env.MERCHANT_FEED_SECRET || "";

export async function GET(req) {
  if (FEED_SECRET) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("key") !== FEED_SECRET) {
      return new Response("Unauthorized", {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  let products;
  try {
    const db = getAdminDb();
    const snap = await db.collection("products").get();
    products = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (err) {
    return new Response(`Failed to load products: ${err?.message || "unknown error"}`, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { tsv, total, included, skipped, errors } = buildMerchantFeed(products);

  return new Response(tsv, {
    status: 200,
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Content-Disposition": 'attachment; filename="luxeglow-products.tsv"',
      "Cache-Control": "no-store, max-age=0",
      "X-Merchant-Feed-Stats": `total=${total}; included=${included}; skipped=${skipped}; rejects=${errors.length}`,
    },
  });
}