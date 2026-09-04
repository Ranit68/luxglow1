import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdminToken } from "@/lib/adminAuth";

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
    const snap = await ref.get();

    if (!snap.exists) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    await ref.update({
      status: "Delivered",
      deliveredAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message || "Could not update the order." }, { status: 500 });
  }
}
