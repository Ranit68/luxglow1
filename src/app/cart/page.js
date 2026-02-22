"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CartItemSkeleton from "@/components/CartItemSkeleton";

export default function CartPage() {

  const { cart, increaseQty, decreaseQty, removeItem } =
    useCart();

  /* ================= LOADING ================= */

  if (cart === null) {
    return (
      <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6">
        <div className="max-w-6xl mx-auto space-y-6 py-16">
          {[...Array(3)].map((_, i) =>
            <CartItemSkeleton key={i}/>
          )}
        </div>
      </main>
    );
  }

  /* ================= EMPTY ================= */

  if (cart.length === 0) {
    return (
      <main className="pt-28 min-h-[70vh]
      flex flex-col items-center justify-center text-center">

        <h1 className="text-4xl text-[#5A0F1C] mb-4">
          Your cart is empty 🛒
        </h1>

        <p className="text-gray-500 mb-6">
          Add beautiful sarees to continue shopping
        </p>

        <Link href="/shop">
          <button className="px-8 py-3 rounded-full
          text-white bg-gradient-to-r
          from-[#5A0F1C] to-[#D4AF37]">
            Start Shopping
          </button>
        </Link>

      </main>
    );
  }

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  /* ================= UI ================= */

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-4 md:px-6">

      <div className="max-w-7xl mx-auto
      grid lg:grid-cols-3 gap-10 py-16">

        {/* ================= CART ITEMS ================= */}

        <div className="lg:col-span-2 space-y-6">

          <h1 className="text-4xl
          font-[var(--font-heading)]
          text-[#5A0F1C]">
            Shopping Cart
          </h1>

          {cart.map(item => (

            <div
              key={item.id}
              className="bg-white rounded-3xl
              shadow-md p-5 flex gap-5
              flex-col sm:flex-row
              items-center">

              {/* IMAGE */}
              <Link href={`/shop/${item.id}`}>
                <div className="relative w-28 h-28">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </Link>

              {/* DETAILS */}
              <div className="flex-1 text-center sm:text-left">

                <Link href={`/shop/${item.id}`}>
                  <h2 className="text-lg font-semibold
                  hover:text-[#5A0F1C]">
                    {item.name}
                  </h2>
                </Link>

                <p className="text-gray-500 mt-1">
                  ₹{item.price}
                </p>

                {/* QTY */}
                <div className="flex justify-center
                sm:justify-start items-center gap-3 mt-4">

                  <button
                    onClick={()=>decreaseQty(item.id)}
                    className="w-9 h-9 rounded-full
                    bg-gray-100 hover:bg-gray-200">
                    −
                  </button>

                  <span className="font-semibold">
                    {item.qty}
                  </span>

                  <button
                    onClick={()=>increaseQty(item.id)}
                    className="w-9 h-9 rounded-full
                    bg-gray-100 hover:bg-gray-200">
                    +
                  </button>

                </div>

              </div>

              {/* REMOVE */}
              <button
                onClick={()=>removeItem(item.id)}
                className="text-red-500
                hover:scale-110 text-xl">
                ✕
              </button>

            </div>

          ))}

        </div>

        {/* ================= ORDER SUMMARY ================= */}

        <div className="bg-white rounded-3xl
        shadow-xl p-8 h-fit sticky top-32">

          <h2 className="text-2xl font-semibold
          text-[#5A0F1C]">
            Order Summary
          </h2>

          <div className="flex justify-between mt-6">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between mt-3">
            <span>Shipping</span>
            <span className="text-green-600">
              Free
            </span>
          </div>

          <hr className="my-6"/>

          <div className="flex justify-between
          text-xl font-bold">
            <span>Total</span>
            <span className="text-[#5A0F1C]">
              ₹{total}
            </span>
          </div>

          <Link href="/checkout">
            <button className="w-full mt-8 py-4
            rounded-full text-white font-semibold
            bg-gradient-to-r
            from-[#5A0F1C]
            to-[#D4AF37]
            hover:scale-105 transition">
              Proceed to Checkout
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}