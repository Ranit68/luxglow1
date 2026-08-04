import { getAdminDb } from "@/lib/firebaseAdmin";
import { StockError } from "@/lib/orderStock";
import { createOrderWithStockReservationAdmin } from "@/lib/orderStockAdmin";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      orderRef,
      userId,
      userEmail,
      address,
      items,
      total,
      paymentMethod = "Cash on Delivery",
      paymentStatus = "Pending",
    } = body || {};

    if (!orderRef || !userId) {
      return Response.json(
        { error: "Missing order details. Please try again." },
        { status: 400 }
      );
    }

    await createOrderWithStockReservationAdmin(getAdminDb(), orderRef, {
      orderRef,
      userId: userId || "",
      userEmail: userEmail || "",
      address: address || null,
      items: Array.isArray(items) ? items : [],
      total: Number(total || 0),
      status: "Pending",
      paymentMethod,
      paymentStatus,
      createdAt: new Date().toISOString(),
    });

    return Response.json({ success: true, orderRef });
  } catch (error) {
    const status = error instanceof StockError ? 409 : 500;
    return Response.json(
      { error: error.message || "Could not place the order right now." },
      { status }
    );
  }
}
