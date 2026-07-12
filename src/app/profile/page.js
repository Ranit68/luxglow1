"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { savedProducts } = useSavedProducts();
  const router = useRouter();
  const [orders, setOrders] = useState(null);

  const getPaymentMethodLabel = (order) => order.paymentMethod || "Not recorded";

  const getPaymentStatusLabel = (order) => {
    if (order.paymentStatus) return order.paymentStatus;
    if (order.paymentMethod === "Cash on Delivery") return "Pending";
    return "Not recorded";
  };

  useEffect(() => {
    if (user === null) router.push("/login?redirect=/profile");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(ordersQuery);
        setOrders(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
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
      <main className="flex min-h-screen items-center justify-center pt-28">
        <p className="text-lg">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28 md:px-8">
      <div className="mx-auto max-w-6xl py-14">
        <div className="mb-14 flex flex-col justify-between gap-6 rounded-3xl bg-white p-8 shadow-lg md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5A0F1C] text-2xl font-semibold text-white">
              {user.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#5A0F1C]">
                {user.displayName || "User"}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/saved"
              className="rounded-full border border-[#D8C4B8] px-6 py-3 text-[#5A0F1C]"
            >
              Saved Products ({savedProducts.length})
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-[#5A0F1C] px-6 py-3 text-white transition hover:bg-[#4a0d17]"
            >
              Logout
            </button>
          </div>
        </div>

        <h2 className="mb-8 text-3xl font-semibold text-[#5A0F1C]">My Orders</h2>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow">
            <h3 className="mb-2 text-2xl">No Orders Yet</h3>
            <p className="text-gray-500">Start shopping to see orders here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-8 shadow-lg transition hover:shadow-xl"
              >
                <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">#{order.id.slice(0, 10)}</p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1 text-sm font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2 text-sm">
                      <p>
                        {item.name} x {item.qty}
                      </p>
                      <p className="font-medium">Rs. {item.price * item.qty}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between text-lg font-semibold text-[#5A0F1C]">
                  <p>Total</p>
                  <p>Rs. {order.total}</p>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                  <p>
                    Payment Method: <span className="font-medium text-[#5A0F1C]">{getPaymentMethodLabel(order)}</span>
                  </p>
                  <p>
                    Payment Status: <span className="font-medium text-[#5A0F1C]">{getPaymentStatusLabel(order)}</span>
                  </p>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  {order.address?.line1}, {order.address?.city} - {order.address?.pincode}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Ordered on {order.createdAt?.toDate().toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
