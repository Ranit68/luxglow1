import { Timestamp } from "firebase-admin/firestore";
import { StockError } from "@/lib/orderStock";

function normalizeCartItems(items) {
  const grouped = new Map();

  for (const item of items || []) {
    const id = String(item?.id || "").trim();
    const qty = Number(item?.qty || 0);

    if (!id || !Number.isInteger(qty) || qty < 1) {
      throw new StockError("Your cart has an invalid item. Please refresh and try again.");
    }

    const existing = grouped.get(id);
    grouped.set(id, {
      ...item,
      id,
      qty: (existing?.qty || 0) + qty,
    });
  }

  return Array.from(grouped.values());
}

function getStockField(product) {
  if (Object.prototype.hasOwnProperty.call(product, "stock")) return "stock";
  if (Object.prototype.hasOwnProperty.call(product, "quantity")) return "quantity";
  return null;
}

export async function createOrderWithStockReservationAdmin(db, orderRef, orderPayload) {
  const items = normalizeCartItems(orderPayload.items);
  const orderDocRef = db.collection("orders").doc(orderRef);
  const productRefs = items.map((item) => db.collection("products").doc(item.id));

  await db.runTransaction(async (transaction) => {
    const existingOrder = await transaction.get(orderDocRef);

    if (existingOrder.exists) {
      throw new StockError("This order was already created.");
    }

    const productSnapshots = await Promise.all(productRefs.map((productRef) => transaction.get(productRef)));

    productSnapshots.forEach((snapshot, index) => {
      const item = items[index];

      if (!snapshot.exists) {
        throw new StockError(`${item.name || "A product"} is no longer available.`);
      }

      const product = snapshot.data();
      const stockField = getStockField(product);

      if (!stockField) {
        throw new StockError(`${item.name || product.name || "A product"} does not have stock set.`);
      }

      const available = Number(product[stockField] || 0);

      if (!Number.isFinite(available) || available < item.qty) {
        throw new StockError(
          `${item.name || product.name || "A product"} has only ${Math.max(available, 0)} left.`
        );
      }

      transaction.update(snapshot.ref, {
        [stockField]: available - item.qty,
      });
    });

    transaction.set(orderDocRef, {
      ...orderPayload,
      items,
      stockReserved: true,
      stockReleased: false,
      createdAt: Timestamp.now(),
    });
  });
}
