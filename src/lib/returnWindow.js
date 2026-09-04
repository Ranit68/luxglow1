export const RETURN_WINDOW_DAYS = 2;
export const RETURN_WINDOW_MS = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export const DELIVERY_STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered"];

export function getDeliveredAt(order) {
  const value = order?.deliveredAt;
  if (!value) return null;
  if (value && typeof value.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function getReturnWindow(order, now = new Date()) {
  const deliveredAt = getDeliveredAt(order);
  if (!deliveredAt) {
    return {
      delivered: false,
      withinWindow: false,
      expired: false,
      remainingMs: 0,
      deliveredAt: null,
      deadline: null,
    };
  }

  const deadline = new Date(deliveredAt.getTime() + RETURN_WINDOW_MS);
  const remainingMs = deadline.getTime() - now.getTime();
  const withinWindow = remainingMs > 0;

  return {
    delivered: true,
    withinWindow,
    expired: !withinWindow,
    remainingMs: Math.max(0, remainingMs),
    deliveredAt,
    deadline,
  };
}

export function formatReturnCountdown(remainingMs) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function isReturnRequested(order) {
  return Boolean(order?.returnRequested);
}
