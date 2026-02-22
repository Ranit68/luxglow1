"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    district: "",
  });

  const total =
    cart?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;

  /* ================= FETCH ADDRESSES ================= */

  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "addresses")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(data);
    };

    fetchAddresses();
  }, [user]);

  /* ================= PINCODE AUTO FILL ================= */

  const fetchLocation = async (pin) => {
    if (pin.length !== 6) return;

    try {
      const res = await fetch("/api/check-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: pin }),
      });

      const data = await res.json();
      if (!data.serviceable) return;

      setForm((prev) => ({
        ...prev,
        city: data.city,
        district: data.district,
      }));
    } catch {
      console.log("Pincode fetch failed");
    }
  };

  /* ================= SAVE ADDRESS ================= */

  const saveAddress = async () => {
    if (!form.name.trim()) return alert("Enter full name");
    if (!/^[0-9]{10}$/.test(form.phone))
      return alert("Enter valid 10 digit phone number");
    if (!form.line1.trim()) return alert("Enter Address Line 1");
    if (!/^[0-9]{6}$/.test(form.pincode))
      return alert("Enter valid 6 digit pincode");
    if (!form.city) return alert("Enter valid pincode");
    if (addresses.length >= 3)
      return alert("Maximum 3 addresses allowed");

    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "addresses"),
        form
      );

      setAddresses([...addresses, { id: docRef.id, ...form }]);

      setForm({
        name: "",
        phone: "",
        line1: "",
        line2: "",
        pincode: "",
        city: "",
        district: "",
      });

      alert("Address saved successfully ✅");
    } catch {
      alert("Failed to save address");
    }
  };

  /* ================= DELETE ADDRESS ================= */

  const deleteAddress = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  /* ================= PLACE ORDER ================= */

  const placeOrder = async () => {
    if (!selectedAddress) return alert("Select address");

    setLoading(true);

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      userEmail: user.email || "",
      address: selectedAddress,
      items: cart,
      total,
      status: "Pending",
      createdAt: Timestamp.now(),
    });

    localStorage.removeItem("cart");
    router.push("/");
    setLoading(false);
  };

  /* ================= EMPTY CART ================= */

  if (!cart || cart.length === 0) {
    return (
      <main className="pt-28 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl mb-4">Your cart is empty 🛒</h1>
        <button
          onClick={() => router.push("/shop")}
          className="text-[#5A0F1C] underline"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <main className="pt-24 bg-gradient-to-b from-[#F8F6F3] to-white min-h-screen px-4 md:px-8">
      <div className="max-w-7xl mx-auto py-12 grid lg:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-10">

          <h1 className="text-3xl md:text-4xl font-bold text-[#3E0E18]">
            Secure Checkout
          </h1>

          <div className="bg-white rounded-3xl p-8 shadow-lg border">

            <h2 className="text-xl font-semibold mb-6 text-[#5A0F1C]">
              Delivery Address
            </h2>

            {/* SAVED ADDRESSES */}
            <div className="space-y-4">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;

                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-5 rounded-2xl border cursor-pointer transition
                    ${isSelected
                        ? "border-[#5A0F1C] bg-[#5A0F1C]/5 shadow-md"
                        : "border-gray-200 hover:border-[#5A0F1C]/40"
                      }`}
                  >
                    <div className="flex justify-between">

                      <div>
                        <p className="font-semibold">{addr.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.line1}, {addr.line2}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.district} - {addr.pincode}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          📞 {addr.phone}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAddress(addr.id);
                        }}
                        className="text-red-500"
                      >
                        🗑
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADD NEW ADDRESS */}
            <div className="mt-10 border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">
                Add New Address
              </h3>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  placeholder="Full Name"
                  className="input-modern"
                  value={form.name}
                  onChange={(e)=>setForm({...form,name:e.target.value})}
                />

                <input
                  placeholder="Phone"
                  className="input-modern"
                  value={form.phone}
                  onChange={(e)=>setForm({...form,phone:e.target.value})}
                />

                <input
                  placeholder="Address Line 1"
                  className="input-modern md:col-span-2"
                  value={form.line1}
                  onChange={(e)=>setForm({...form,line1:e.target.value})}
                />

                <input
                  placeholder="Address Line 2"
                  className="input-modern md:col-span-2"
                  value={form.line2}
                  onChange={(e)=>setForm({...form,line2:e.target.value})}
                />

                <input
                  placeholder="Pincode"
                  className="input-modern"
                  value={form.pincode}
                  onChange={(e)=>{
                    setForm({...form,pincode:e.target.value});
                    fetchLocation(e.target.value);
                  }}
                />

                <input
                  value={form.city}
                  disabled
                  placeholder="City"
                  className="input-modern bg-gray-100"
                />

                <input
                  value={form.district}
                  disabled
                  placeholder="District"
                  className="input-modern"
                />

              </div>

              <button
                onClick={saveAddress}
                className="mt-6 bg-[#5A0F1C] text-white px-8 py-3 rounded-full hover:opacity-90 transition"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border h-fit lg:sticky lg:top-28">

          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t my-6"></div>

          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span className="text-[#5A0F1C] font-bold">
              ₹{total}
            </span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-8 py-4 rounded-full bg-[#5A0F1C]
            text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
          </button>

          <p className="text-xs text-gray-500 mt-6 text-center">
            🔒 Secure Checkout | Safe & Encrypted
          </p>

        </div>

      </div>
    </main>
  );
}