import { getDelhiveryTracking } from "@/lib/delhivery";

export async function syncOrderTracking(db, ref) {
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, reason: "not-found" };

  const doc = snap.data();
  const awb = doc?.shipment?.awb || doc?.shipment?.waybill;

  if (!awb) {
    return { ok: false, reason: "no-awb" };
  }

  if (doc?.delivered || doc?.returnRequested) {
    return { ok: true, status: doc?.shipment?.status, reason: "already-final" };
  }

  const tracking = await getDelhiveryTracking(awb);

  const update = {
    "shipment.status": tracking.status,
    "shipment.scans": tracking.scans,
    "shipment.delivered": tracking.delivered,
    "shipment.lastSyncedAt": new Date(),
  };

  if (
    tracking.delivered ||
    tracking.status === "Delivered" ||
    String(tracking.rawFirst?.StatusText || "").toLowerCase().includes("delivered")
  ) {
    update.status = "Delivered";
    update.deliveredAt = new Date();
    update["shipment.deliveryDate"] = new Date();
  }

  await ref.update(update);
  return { ok: true, status: tracking.status, delivered: tracking.delivered, scans: tracking.scans };
}
