import { getAdminDb } from "@/lib/firebaseAdmin";
import { syncOrderTracking } from "@/lib/orderSync";

export const runtime = "nodejs";
export const maxDuration = 60;

const CRON_SECRET = process.env.DELHIVERY_CRON_SECRET || "";

export async function GET(req) {
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const suppliedSecret = req.headers.get("x-cron-secret") || "";
  const secretOk = !CRON_SECRET || suppliedSecret === CRON_SECRET;

  if (!isVercelCron && !secretOk) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const shipped = await db
      .collection("orders")
      .where("shipment.awb", ">", "")
      .limit(500)
      .get();

    const results = [];
    let synced = 0;
    let delivered = 0;
    let skipped = 0;

    for (const doc of shipped.docs) {
      const data = doc.data();
      if (data?.delivered) {
        skipped += 1;
        continue;
      }
      const ref = db.collection("orders").doc(doc.id);
      try {
        const result = await syncOrderTracking(db, ref);
        if (result.ok) {
          synced += 1;
          if (result.delivered) delivered += 1;
        } else {
          skipped += 1;
        }
        results.push({ id: doc.id, ...result });
      } catch (e) {
        skipped += 1;
        results.push({ id: doc.id, ok: false, reason: e.message });
      }
    }

    return Response.json({ success: true, synced, delivered, skipped, results });
  } catch (e) {
    return Response.json({ error: e.message || "Sync failed." }, { status: 500 });
  }
}
