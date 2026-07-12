"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartItemSkeleton from "@/components/CartItemSkeleton";
import AuthPromptModal from "@/components/AuthPromptModal";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (cart === null) {
    return (
      <main className="min-h-screen bg-[#FAF6F0] px-6 pt-28">
        <div className="mx-auto max-w-6xl space-y-6 py-16">
          {[...Array(3)].map((_, index) => (
            <CartItemSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <>
        <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28">
          <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_60px_rgba(62,25,18,0.10)] md:p-14">
            <h1 className="text-4xl font-semibold text-[#5A0F1C]">
              Your cart is protected by login
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5B4038]">
              Guests can browse products, but cart and checkout are available only after login or registration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => setShowAuthPrompt(true)}
                className="rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] px-8 py-4 text-sm font-medium text-white"
              >
                Login to access cart
              </button>
              <Link
                href="/shop"
                className="rounded-full border border-[#D8C4B8] px-8 py-4 text-sm font-medium text-[#4E1320]"
              >
                Continue browsing
              </Link>
            </div>
          </section>
        </main>

        <AuthPromptModal
          action="cart"
          open={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          redirect="/cart"
          title="Login to use your cart"
          description="Cart access is only available for signed-in customers."
        />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
        <h1 className="mb-4 text-4xl text-[#5A0F1C]">Your cart is empty</h1>
        <p className="mb-6 text-gray-500">
          Add beautiful sarees to continue shopping.
        </p>
        <Link
          href="/shop"
          className="rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] px-8 py-3 text-white"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8E2437]">
              Account Cart
            </p>
            <h1 className="mt-3 text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
              Shopping Cart
            </h1>
          </div>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-5 rounded-3xl bg-white p-5 shadow-md sm:flex-row"
            >
              <Link href={`/shop/${item.id}`}>
                <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-[#F6EDE5]">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 text-center sm:text-left">
                <Link href={`/shop/${item.id}`}>
                  <h2 className="text-lg font-semibold hover:text-[#5A0F1C]">
                    {item.name}
                  </h2>
                </Link>

                <p className="mt-1 text-gray-500">Rs. {item.price}</p>

                <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 transition hover:scale-110"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="sticky top-32 h-fit rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-[#5A0F1C]">Order Summary</h2>

          <div className="mt-6 flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {total}</span>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <hr className="my-6" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-[#5A0F1C]">Rs. {total}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-8 block w-full rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-4 text-center font-semibold text-white transition hover:scale-105"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
