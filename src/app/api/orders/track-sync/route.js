import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdminToken } from "@/lib/adminAuth";
import { syncOrderTracking } from "@/lib/orderSync";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { error } = await requireAdminToken(req);
    if (error) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    const body = await req.json().catch(() => ({}));
    const orderId = String(body?.orderId || "").trim();
    if (!orderId) {
      return Response.json({ error: "Order ID is required." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.collection("orders").doc(orderId);
    const result = await syncOrderTracking(db, ref);

    if (result.reason === "not-found") {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
    if (result.reason === "no-awb") {
      return Response.json({ error: "This order has no shipment/AWB yet." }, { status: 409 });
    }

    return Response.json({ success: true, ...result });
  } catch (err) {
    return Response.json({ error: err.message || "Could not sync tracking." }, { status: 500 });
  }
}
