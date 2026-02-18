"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 get category from URL
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // 🔥 fetch products + filter
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        let data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ⭐ FILTER BY CATEGORY FROM HOME PAGE
        if (categoryParam) {
          data = data.filter(p => p.category === categoryParam);
        }

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam]);

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6">
      <div className="max-w-7xl mx-auto py-16">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C] mb-3">
          Shop Sarees
        </h1>

        {/* SHOW FILTER TEXT */}
        {categoryParam && (
          <p className="text-gray-500 mb-10">
            Showing category: <span className="font-semibold">{categoryParam}</span>
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-32 text-lg">
            Loading products...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="text-center py-32">
            <h2 className="text-2xl mb-3">No products found 😢</h2>
            <Link href="/shop" className="text-[#5A0F1C] underline">
              View all products
            </Link>
          </div>
        )}

        {/* PRODUCTS GRID */}
        {!loading && products.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
              >

                {/* IMAGE */}
                <div className="h-72 bg-gray-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    className="h-full w-full object-cover object-top hover:scale-105 transition duration-300"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-5">
                  <h2 className="font-semibold text-lg line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-gray-500 mt-1 text-sm">
                    {product.category}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-[#5A0F1C]">
                      ₹{product.price}
                    </p>

                    <Link href={`/shop/${product.id}`}>
                      <button className="px-4 py-2 rounded-full text-white text-sm
                      bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] hover:scale-105 transition">
                        View
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}
