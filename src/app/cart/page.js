"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();

  // 🔄 LOADING STATE
  if (cart === null) {
    return (
      <main className="pt-28 min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-2xl">Loading cart...</div>
      </main>
    );
  }

  // 🛒 EMPTY CART PAGE (CENTERED — footer fix)
  if (cart.length === 0) {
    return (
      <main className="pt-28 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl text-[#5A0F1C] mb-4">Your cart is empty 🛒</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
        <Link href="/shop">
          <button className="px-8 py-3 rounded-full text-white bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]">
            Start Shopping
          </button>
        </Link>
      </main>
    );
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6">
      <div className="max-w-6xl mx-auto py-16">
        <h1 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C] mb-10">
          Shopping Cart
        </h1>

        {/* 🛍 CART ITEMS */}
        <div className="space-y-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl shadow flex gap-6 items-center
              animate-[fadeIn_.4s_ease]"
            >
              <Link href={`/shop/${item.id}`}>
                <img
                  src={item.imageUrl}
                  className="w-28 h-28 object-cover rounded-xl"
                />
              </Link>

              <div className="flex-1">
                <Link href={`/shop/${item.id}`}>
                  <h2 className="text-xl font-semibold hover:text-[#5A0F1C]">
                    {item.name}
                  </h2>
                </Link>

                <p className="text-gray-500 mt-1">₹{item.price}</p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200"
                  >−</button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200"
                  >+</button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:scale-110"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 💰 TOTAL */}
        <div className="text-right mt-14">
          <h2 className="text-3xl font-bold text-[#5A0F1C]">
            Total: ₹{total}
          </h2>

          <Link href="/checkout">
            <button className="mt-6 px-10 py-4 rounded-full text-white font-semibold 
            bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] hover:scale-105 transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
