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
  const [paymentMsg, setPaymentMsg] = useState("");


  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    district: "",
  });

  const total = cart?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;

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

  const fetchLocation = async (pin) => {
    if(pin.length !== 6) return;

    try {
        const res = await fetch("/api/check-delivery",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pincode: pin }),
        });

        const data = await res.json();

        if(!data.serviceable) return;

        if(!data.serviceable) return;

        setForm((prev) => ({
            ...prev,
            city: data.city,
            district: data.district,
        }));
    } catch (err){
        console.log("Pincode fetch failed")
    }
  };


 const saveAddress = async () => {

  if (!form.name.trim())
    return alert("Enter full name");

  if (!/^[0-9]{10}$/.test(form.phone))
    return alert("Enter valid 10 digit phone number");

  if (!form.line1.trim())
    return alert("Enter Address Line 1");

  if (!/^[0-9]{6}$/.test(form.pincode))
    return alert("Enter valid 6 digit pincode");

  if (!form.city)
    return alert("Enter pincode to autofill city");

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

  } catch (err) {
    alert("Failed to save address");
  }
};


  const deleteAddress = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const placeOrder = async () => {
    if (!selectedAddress) return alert("Select address");

    await addDoc(collection(db, "orders"), {
  userId: user.uid,
  userEmail: user.email || "",
      address: selectedAddress,
      items: cart,
      total,
      status: "Pending",
      createdAt: Timestamp.now(),
    });

    alert("Order placed 🎉");
    localStorage.removeItem("cart");
    router.push("/");
    window.location.reload();
  };

if (!cart) {
  return (
    <main className="pt-28 min-h-screen flex items-center justify-center">
      <p className="text-xl">Loading checkout...</p>
    </main>
  );
}

if (cart.length === 0) {
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


  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6">
      <div className="max-w-6xl mx-auto py-16 grid md:grid-cols-2 gap-12">

        <div>
          <h1 className="text-3xl text-[#5A0F1C] mb-6">Delivery Address</h1>

          {addresses.map((addr) => {
  const isSelected = selectedAddress?.id === addr.id;

  return (
    <div
      key={addr.id}
      onClick={() => setSelectedAddress(addr)}
      className={`
        cursor-pointer p-5 mb-4 rounded-2xl shadow 
        flex justify-between items-start transition
        ${isSelected
          ? "bg-[#5A0F1C]/5 border-2 border-[#5A0F1C]"
          : "bg-white border hover:border-[#5A0F1C]/40"}
      `}
    >
      <div className="flex gap-4">

        <div className={`
          mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${isSelected ? "border-[#5A0F1C]" : "border-gray-400"}
        `}>
          {isSelected && (
            <div className="w-2.5 h-2.5 bg-[#5A0F1C] rounded-full"></div>
          )}
        </div>

        <div>
          <p className="font-semibold">{addr.name}</p>
          <p className="text-gray-600 text-sm">
            {addr.line1}, {addr.line2}
          </p>
          <p className="text-gray-600 text-sm">
            {addr.city}, {addr.district} - {addr.pincode}
          </p>

          {isSelected && (
            <span className="text-xs text-[#5A0F1C] font-semibold">
              ✓ Selected Address
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteAddress(addr.id);
        }}
        className="text-red-500 hover:scale-110"
      >
        🗑
      </button>
    </div>
  );
})}


          <h2 className="mt-8 mb-3 font-semibold">Add New Address</h2>

          <div className="space-y-3">
            <input placeholder="Name"
              className="input"
              onChange={(e)=>setForm({...form,name:e.target.value})}/>

            <input placeholder="Phone"
              className="input"
              onChange={(e)=>setForm({...form,phone:e.target.value})}/>

            <input placeholder="Address Line 1"
              className="input"
              onChange={(e)=>setForm({...form,line1:e.target.value})}/>

            <input placeholder="Address Line 2"
              className="input"
              onChange={(e)=>setForm({...form,line2:e.target.value})}/>

            <input placeholder="Pincode"
              className="input"
              onChange={(e)=>{
                setForm({...form,pincode:e.target.value});
                fetchLocation(e.target.value);
              }}/>

            <input value={form.city} placeholder="City" className="input"/>
            <input value={form.district} placeholder="District" className="input"/>

            <button onClick={saveAddress}
              className="bg-[#5A0F1C] text-white px-6 py-3 rounded-xl">
              Save Address
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-3">
              <p>{item.name} x {item.qty}</p>
              <p>₹{item.price * item.qty}</p>
            </div>
          ))}

          <hr className="my-6" />

          <h3 className="text-2xl font-bold text-[#5A0F1C]">
            Total ₹{total}
          </h3>

          <button
  onClick={() => setPaymentMsg("Online payments coming soon 💳. Cash on Delivery is available for now.")}
  className="w-full mt-6 py-4 rounded-full text-white
  bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]"
>
  Pay Online (Coming Soon)
</button>

{paymentMsg && (
  <p className="text-center text-sm text-gray-600 mt-3">
    {paymentMsg}
  </p>
)}
{/* COD BUTTON ⭐ IMPORTANT */}
<button
  onClick={placeOrder}
  className="w-full mt-4 py-4 rounded-full 
  border-2 border-[#5A0F1C] text-[#5A0F1C] font-semibold
  hover:bg-[#5A0F1C] hover:text-white transition"
>
  Place Order — Cash on Delivery
</button>


        </div>

      </div>
    </main>
  );
}
