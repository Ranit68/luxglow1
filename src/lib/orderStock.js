import {
  collection,
  doc,
  getDoc,
  runTransaction,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export class StockError extends Error {
  constructor(message) {
    super(message);
    this.name = "StockError";
  }
}

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

export async function createOrderWithStockReservation(db, orderRef, orderPayload) {
  const items = normalizeCartItems(orderPayload.items);
  const orderDocRef = doc(db, "orders", orderRef);
  const productRefs = items.map((item) => doc(db, "products", item.id));

  await runTransaction(db, async (transaction) => {
    const existingOrder = await transaction.get(orderDocRef);

    if (existingOrder.exists()) {
      throw new StockError("This order was already created.");
    }

    const productSnapshots = [];

    for (const productRef of productRefs) {
      productSnapshots.push(await transaction.get(productRef));
    }

    productSnapshots.forEach((snapshot, index) => {
      const item = items[index];

      if (!snapshot.exists()) {
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

export async function releaseReservedStock(db, orderRef, orderPatch = {}) {
  const orderDocRef = doc(db, "orders", orderRef);

  await runTransaction(db, async (transaction) => {
    const orderSnapshot = await transaction.get(orderDocRef);

    if (!orderSnapshot.exists()) {
      return;
    }

    const order = orderSnapshot.data();

    if (!order.stockReserved || order.stockReleased) {
      transaction.update(orderDocRef, orderPatch);
      return;
    }

    const items = normalizeCartItems(order.items);
    const productSnapshots = [];

    for (const item of items) {
      const productRef = doc(db, "products", item.id);
      productSnapshots.push(await transaction.get(productRef));
    }

    productSnapshots.forEach((productSnapshot, index) => {
      const item = items[index];

      if (!productSnapshot.exists()) {
        return;
      }

      const product = productSnapshot.data();
      const stockField = getStockField(product);

      if (!stockField) {
        return;
      }

      transaction.update(productSnapshot.ref, {
        [stockField]: Number(product[stockField] || 0) + item.qty,
      });
    });

    transaction.update(orderDocRef, {
      ...orderPatch,
      stockReleased: true,
    });
  });
}

export async function markReservedOrderPaid(db, orderRef, orderPatch) {
  const orderDocRef = doc(db, "orders", orderRef);
  const orderSnapshot = await getDoc(orderDocRef);

  if (!orderSnapshot.exists()) {
    throw new StockError("Payment was received, but the reserved order was not found.");
  }

  await updateDoc(orderDocRef, {
    ...orderPatch,
    stockReserved: true,
    stockReleased: false,
  });
}
