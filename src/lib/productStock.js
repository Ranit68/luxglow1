export function getAvailableStock(product) {
  if (!product) return null;

  if (Object.prototype.hasOwnProperty.call(product, "stock")) {
    const stock = Number(product.stock);
    return Number.isFinite(stock) ? stock : 0;
  }

  if (Object.prototype.hasOwnProperty.call(product, "quantity")) {
    const quantity = Number(product.quantity);
    return Number.isFinite(quantity) ? quantity : 0;
  }

  return null;
}

export function isOutOfStock(product) {
  const stock = getAvailableStock(product);
  return stock !== null && stock <= 0;
}

export function isLowStock(product, threshold = 3) {
  const stock = getAvailableStock(product);
  return stock !== null && stock > 0 && stock <= threshold;
}
