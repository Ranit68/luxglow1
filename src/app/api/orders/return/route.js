import { getAdminDb } from "@/lib/firebaseAdmin";
import { getDeliveredAt, RETURN_WINDOW_MS, isReturnRequested } from "@/lib/returnWindow";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { orderId, userId } = await req.json();

    if (!orderId || !userId) {
      return Response.json({ error: "Order and user are required." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.collection("orders").doc(orderId);
    const snap = await ref.get();

    if (!snap.exists) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    const doc = snap.data();
    if (doc.userId !== userId) {
      return Response.json({ error: "Unauthorized to return this order." }, { status: 403 });
    }

    if (isReturnRequested(doc)) {
      return Response.json({ error: "A return is already requested for this order." }, { status: 409 });
    }

    const deliveredAt = getDeliveredAt(doc);
    if (!deliveredAt) {
      return Response.json(
        { error: "This order has not been delivered yet." },
        { status: 409 }
      );
    }

    const remaining = deliveredAt.getTime() + RETURN_WINDOW_MS - Date.now();
    if (remaining <= 0) {
      return Response.json(
        { error: "The 2-day return window for this order has closed." },
        { status: 410 }
      );
    }

    await ref.update({
      returnRequested: true,
      returnRequestedAt: new Date(),
      returnStatus: "Requested",
      status: "Return Requested",
    });

    return Response.json({ success: true, returnStatus: "Requested" });
  } catch (error) {
    return Response.json({ error: error.message || "Could not request a return." }, { status: 500 });
  }
}
