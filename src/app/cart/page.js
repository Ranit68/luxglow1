"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartItemSkeleton from "@/components/CartItemSkeleton";
import AuthPromptModal from "@/components/AuthPromptModal";
import CouponPanel from "@/components/CouponPanel";
import { getAvailableStock, isOutOfStock } from "@/lib/productStock";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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
      <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28 md:px-6">
        <section className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-[2.25rem] border border-[#E7DDD1] bg-white px-8 py-20 text-center shadow-[0_24px_60px_rgba(62,25,18,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7EEDD] text-[#7D1111]">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold text-[#5A0F1C]">Your cart is empty</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6F6258]">
            Add beautiful sarees to continue shopping and build your perfect festive edit.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] px-8 py-3.5 font-medium text-white transition hover:scale-[1.01]"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const hasUnavailableItems = cart.some((item) => {
    const stock = getAvailableStock(item);
    return isOutOfStock(item) || (stock !== null && item.qty > stock);
  });
  const shippingCharge = 0;
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "fixed") {
      return Math.min(appliedCoupon.computedDiscount || 0, subtotal);
    }
    return appliedCoupon.computedDiscount || 0;
  }, [appliedCoupon, subtotal]);
  const total = Math.max(0, subtotal - discountAmount + shippingCharge);

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28 md:px-6">
      <div className="mx-auto max-w-7xl py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8E2437]">
              Account Cart
            </p>
            <h1 className="mt-3 text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
              Your curated selection
            </h1>
          </div>
          <div className="rounded-full border border-[#E5D6C4] bg-white px-4 py-2 text-sm text-[#6F6258] shadow-sm">
            {cart.length} {cart.length === 1 ? "item" : "items"} ready for checkout
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.8fr]">
          <div className="space-y-5">
            {cart.map((item) => {
              const availableStock = getAvailableStock(item);
              const unavailable = isOutOfStock(item) || (availableStock !== null && item.qty > availableStock);

              return (
              <div
                key={item.id}
                className="flex flex-col gap-5 rounded-[1.6rem] border border-[#E7DDD1] bg-white p-5 shadow-[0_18px_40px_rgba(62,25,18,0.06)] sm:flex-row"
              >
                <Link href={`/shop/${item.id}`} className="shrink-0">
                  <div className="relative h-32 w-32 overflow-hidden rounded-[1.1rem] bg-[#F6EDE5]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className={`object-cover ${unavailable ? "grayscale" : ""}`}
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="text-center sm:text-left">
                    <Link href={`/shop/${item.id}`}>
                      <h2 className="text-lg font-semibold text-[#24110D] transition hover:text-[#5A0F1C]">
                        {item.name}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-[#7D1111]">Rs. {item.price}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#8A7667]">
                      {unavailable
                        ? "Out of stock"
                        : availableStock !== null
                          ? `${availableStock} left`
                          : "Handmade weave - Premium finish"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                    <div className="flex items-center rounded-full border border-[#E7DDD1] bg-[#FBF7F2] p-1">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#5A0F1C] transition hover:bg-white"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-8 text-center text-sm font-semibold text-[#24110D]">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        disabled={availableStock !== null && item.qty >= availableStock}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#5A0F1C] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 rounded-full border border-[#E7DDD1] px-3 py-2 text-sm text-[#8E2437] transition hover:bg-[#FFF5F5]"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-[1.8rem] border border-[#E7DDD1] bg-white p-7 shadow-[0_18px_40px_rgba(62,25,18,0.06)]">
            <h2 className="text-2xl font-semibold text-[#5A0F1C]">Order Summary</h2>

            <div className="mt-6 space-y-3 text-sm text-[#6F6258]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#24110D]">Rs. {total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-[#2C7A3A]">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Secure payment</span>
                <span className="font-medium text-[#24110D]">Included</span>
              </div>
            </div>

            <div className="mt-6 rounded-[1.15rem] border border-[#E7DDD1] bg-[#FCF8F3] p-4 text-sm text-[#6F6258]">
              <p className="font-semibold text-[#24110D]">Free delivery above Rs. 5,000</p>
              <p className="mt-2 leading-6">
                Your order is protected and ready for a smooth checkout experience.
              </p>
            </div>

            <div className="mt-6">
              <CouponPanel subtotal={subtotal} onCouponChange={setAppliedCoupon} />
            </div>

            <div className="mt-6 space-y-3 border-t border-[#E7DDD1] pt-5 text-sm text-[#6F6258]">
              <div className="flex items-center justify-between">
                <span>MRP</span>
                <span className="font-medium text-[#24110D]">Rs. {subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="font-medium text-emerald-600">- Rs. {discountAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className={`font-medium ${shippingCharge === 0 ? "text-emerald-600" : "text-[#24110D]"}`}>
                  {shippingCharge === 0 ? "Free" : `Rs. ${shippingCharge}`}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#E7DDD1] pt-5 text-lg font-semibold text-[#24110D]">
              <span>Total</span>
              <span className="text-[#5A0F1C]">Rs. {total}</span>
            </div>

            {hasUnavailableItems ? (
              <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Remove sold-out items or reduce quantity before checkout.
              </p>
            ) : (
              <Link
                href="/checkout"
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-4 font-semibold text-white transition hover:scale-[1.01]"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
