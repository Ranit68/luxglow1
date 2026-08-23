"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAvailableStock, isOutOfStock } from "@/lib/productStock";

const CartContext = createContext();

const readCartForUser = (userId) => {
  if (typeof window === "undefined" || !userId) {
    return [];
  }

  const savedCart = localStorage.getItem(`cart:${userId}`);
  return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCache, setCartCache] = useState({});

  const userId = user?.uid || null;
  const cart = useMemo(() => {
    if (!userId) {
      return [];
    }

    return cartCache[userId] ?? readCartForUser(userId);
  }, [cartCache, userId]);

  useEffect(() => {
    if (typeof window === "undefined" || !userId) {
      return;
    }

    localStorage.setItem(`cart:${userId}`, JSON.stringify(cart));
  }, [cart, userId]);

  const updateCart = (updater) => {
    if (!userId) {
      return;
    }

    setCartCache((prev) => {
      const currentCart = prev[userId] ?? readCartForUser(userId);
      const nextCart =
        typeof updater === "function" ? updater(currentCart) : updater;

      return {
        ...prev,
        [userId]: nextCart,
      };
    });
  };

  const addToCart = (product) => {
    if (isOutOfStock(product)) {
      return;
    }

    updateCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      const availableStock = getAvailableStock(product);

      if (exist) {
        if (availableStock !== null && exist.qty >= availableStock) {
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    updateCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const availableStock = getAvailableStock(item);
        if (availableStock !== null && item.qty >= availableStock) {
          return item;
        }

        return { ...item, qty: item.qty + 1 };
      })
    );
  };

  const decreaseQty = (id) => {
    updateCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const buyNow = (product) => {
    if (isOutOfStock(product)) {
      return;
    }

    updateCart([{ ...product, qty: 1 }]);
  };

  const removeItem = (id) => {
    updateCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (typeof window !== "undefined" && userId) {
      localStorage.removeItem(`cart:${userId}`);
    }

    if (!userId) {
      return;
    }

    setCartCache((prev) => ({
      ...prev,
      [userId]: [],
    }));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        buyNow,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
