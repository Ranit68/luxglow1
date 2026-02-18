"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState(null);

  // 🚫 REDIRECT IF NOT LOGGED IN
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user]);

  // 🔥 FETCH USER ORDERS
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Orders fetched:", data);
        setOrders(data);

      } catch (err) {
        console.log("Firestore error:", err);
        setOrders([]); // prevent infinite loading if error happens
      }
    };

    fetchOrders();
  }, [user]);

  // ⏳ WAIT UNTIL FIREBASE AUTH READY
  if (user === null) return null;

  // ⏳ LOADING ORDERS
  if (orders === null) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6">
      <div className="max-w-6xl mx-auto py-16">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
              My Profile
            </h1>
            <p className="text-gray-500 mt-1">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="px-6 py-2 rounded-full text-white bg-[#5A0F1C] hover:bg-[#4a0d17] transition"
          >
            Logout
          </button>
        </div>

        {/* ORDERS */}
        <h2 className="text-3xl font-semibold text-[#5A0F1C] mb-8">
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 shadow text-center">
            <h3 className="text-2xl mb-3">No orders yet 🛍</h3>
            <p className="text-gray-500">Your placed orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">

            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-8 shadow-lg">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                  <p className="text-sm text-gray-500">
                    Order ID: <span className="font-semibold">{order.id.slice(0,10)}</span>
                  </p>

                  <span className="px-4 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between mb-2">
                    <p>{item.name} × {item.qty}</p>
                    <p>₹{item.price * item.qty}</p>
                  </div>
                ))}

                <hr className="my-6" />

                <div className="flex justify-between font-bold text-[#5A0F1C]">
                  <p>Total</p>
                  <p>₹{order.total}</p>
                </div>

                <p className="text-sm mt-4 text-gray-600">
                  Deliver to: {order.address?.line1}, {order.address?.city} - {order.address?.pincode}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Ordered on: {order.createdAt?.toDate().toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}
      </div>
    </main>
  );
}
