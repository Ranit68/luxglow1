"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const SavedProductsContext = createContext();

export const SavedProductsProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [savedError, setSavedError] = useState("");

  useEffect(() => {
    const fetchSavedProducts = async () => {
      if (!user) {
        setSavedProducts([]);
        setSavedError("");
        setLoadingSaved(false);
        return;
      }

      setLoadingSaved(true);
      setSavedError("");

      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "savedProducts")
        );

        setSavedProducts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      } catch (error) {
        setSavedProducts([]);
        setSavedError(error?.message || "Could not load saved products.");
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedProducts();
  }, [user]);

  const isSaved = (productId) =>
    savedProducts.some((product) => product.id === productId);

  const toggleSavedProduct = async (product) => {
    const activeUser = user || auth.currentUser;

    if (!activeUser) {
      return false;
    }

    const productRef = doc(
      db,
      "users",
      activeUser.uid,
      "savedProducts",
      product.id
    );
    const alreadySaved = isSaved(product.id);

    if (alreadySaved) {
      setSavedProducts((prev) => prev.filter((item) => item.id !== product.id));

      try {
        await deleteDoc(productRef);
        setSavedError("");
        return false;
      } catch (error) {
        setSavedProducts((prev) => [...prev, product]);
        setSavedError(error?.message || "Could not update saved products.");
        throw error;
      }
    }

    const optimisticProduct = {
      ...product,
      savedAt: new Date().toISOString(),
    };

    setSavedProducts((prev) => [optimisticProduct, ...prev]);

    try {
      await setDoc(productRef, {
        ...product,
        savedAt: serverTimestamp(),
      });
      setSavedError("");
      return true;
    } catch (error) {
      setSavedProducts((prev) => prev.filter((item) => item.id !== product.id));
      setSavedError(error?.message || "Could not update saved products.");
      throw error;
    }
  };

  return (
    <SavedProductsContext.Provider
      value={{
        isSaved,
        loadingSaved,
        savedError,
        savedProducts,
        toggleSavedProduct,
      }}
    >
      {children}
    </SavedProductsContext.Provider>
  );
};

export const useSavedProducts = () => useContext(SavedProductsContext);
