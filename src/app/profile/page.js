"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {

  const { user, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user, router]);

  /* ================= FETCH ORDERS ================= */
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

        setOrders(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

      } catch (err) {
        console.log(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  if (user === null) return null;

  if (orders === null) {
    return (
      <main className="pt-28 min-h-screen flex justify-center items-center">
        <p className="text-lg">Loading profile...</p>
      </main>
    );
  }

  /* ================= UI ================= */

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-4 md:px-8">

      <div className="max-w-6xl mx-auto py-14">

        {/* ================= PROFILE HEADER ================= */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-14
        flex flex-col md:flex-row justify-between md:items-center gap-6">

          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full
            bg-[#5A0F1C] text-white flex items-center
            justify-center text-2xl font-semibold">
              {user.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-2xl font-semibold text-[#5A0F1C]">
                {user.displayName || "User"}
              </h1>

              <p className="text-gray-500 text-sm">
                {user.email}
              </p>
            </div>

          </div>

          <button
            onClick={logout}
            className="px-6 py-3 rounded-full text-white
            bg-[#5A0F1C] hover:bg-[#4a0d17] transition"
          >
            Logout
          </button>

        </div>

        {/* ================= ORDERS ================= */}

        <h2 className="text-3xl font-semibold text-[#5A0F1C] mb-8">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 shadow text-center">
            <h3 className="text-2xl mb-2">No Orders Yet 🛍</h3>
            <p className="text-gray-500">
              Start shopping to see orders here.
            </p>
          </div>
        ) : (

          <div className="space-y-8">

            {orders.map(order => (

              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-lg p-8
                hover:shadow-xl transition"
              >

                {/* ORDER HEADER */}
                <div className="flex flex-col md:flex-row
                justify-between md:items-center gap-3 mb-6">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-semibold">
                      #{order.id.slice(0,10)}
                    </p>
                  </div>

                  <span className={`
                    px-4 py-1 rounded-full text-sm font-medium
                    ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}>
                    {order.status}
                  </span>

                </div>

                {/* ITEMS */}
                <div className="space-y-3">

                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between
                      border-b pb-2 text-sm"
                    >
                      <p>
                        {item.name} × {item.qty}
                      </p>

                      <p className="font-medium">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  ))}

                </div>

                {/* TOTAL */}
                <div className="flex justify-between
                mt-6 font-semibold text-lg text-[#5A0F1C]">

                  <p>Total</p>
                  <p>₹{order.total}</p>

                </div>

                {/* ADDRESS */}
                <p className="text-sm text-gray-600 mt-4">
                  📍 {order.address?.line1},{" "}
                  {order.address?.city} -{" "}
                  {order.address?.pincode}
                </p>

                {/* DATE */}
                <p className="text-xs text-gray-400 mt-2">
                  Ordered on{" "}
                  {order.createdAt
                    ?.toDate()
                    .toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}