export const STEP_LABELS = ["Placed", "Accepted", "Shipped", "Out for Delivery", "Delivered"];
export const STEP_COUNT = STEP_LABELS.length;

export function orderStep(order) {
  const status = String(order?.status || "").toLowerCase();
  if (status.includes("return")) return 4;
  if (status.includes("deliver")) return 4;
  if (status.includes("out for delivery")) return 3;
  if (status.includes("ship")) return 2;
  if (status.includes("accept") || status.includes("confirm")) return 1;
  if (status.includes("pending")) return 1;
  return 0;
}

export function isTerminal(order) {
  return ["Delivered", "Rejected", "Cancelled", "Return Requested", "Returned"].includes(
    order?.status
  );
}

export function getShipmentStatus(order) {
  return order?.shipment?.status || null;
}
