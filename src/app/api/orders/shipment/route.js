import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdminToken } from "@/lib/adminAuth";
import { createDelhiveryShipment } from "@/lib/delhivery";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { error } = await requireAdminToken(req);
    if (error) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    const body = await req.json().catch(() => ({}));
    const orderId = String(body?.orderId || "").trim();
    const weightKg = Number(body?.weightKg || 0.5);

    if (!orderId) {
      return Response.json({ error: "Order ID is required." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.collection("orders").doc(orderId);
    const snap = await ref.get();

    if (!snap.exists) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    const doc = snap.data();
    const addr = doc?.address || {};
    const price = Number(doc?.total || 0);
    const paymentMode = (doc?.paymentMethod || "Pre-paid")
      .toLowerCase()
      .includes("cod")
      ? "COD"
      : "Pre-paid";

    const shipment = await createDelhiveryShipment({
      orderRef: doc?.orderRef || orderId,
      name: addr?.name || "Customer",
      phone: addr?.phone || "",
      addressLine1: addr?.line1 || "",
      addressLine2: addr?.line2 || "",
      pincode: addr?.pincode || "",
      city: addr?.city || "",
      state: addr?.state || addr?.district || "",
      orderValue: price,
      paymentMode,
      weightKg,
      pickupLocation: body?.pickupLocation || process.env.DELHIVERY_PICKUP_LOCATION,
      clientName: body?.clientName || process.env.DELHIVERY_CLIENT_NAME,
      client: body?.client || process.env.DELHIVERY_CLIENT,
    });

    if (!shipment.waybill) {
      throw new Error("Delhivery did not return a waybill number.");
    }

    await ref.update({
      status: "Shipped",
      shipment: {
        awb: shipment.waybill,
        waybill: shipment.waybill,
        shipmentId: shipment.shipmentId || orderId,
        status: "Booked",
        pickupLocation: body?.pickupLocation || process.env.DELHIVERY_PICKUP_LOCATION || "Default",
        weightKg,
        paymentMode,
        createdAt: new Date(),
        lastSyncedAt: new Date(),
        scans: [],
        delivered: false,
      },
    });

    return Response.json({
      success: true,
      waybill: shipment.waybill,
      labelUrl: shipment.labelUrl,
      status: "Shipped",
    });
  } catch (err) {
    return Response.json({ error: err.message || "Could not create shipment." }, { status: 500 });
  }
}
