"use client";

import { Heart, Lock, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const iconMap = {
  buy: ShoppingBag,
  cart: ShoppingBag,
  save: Heart,
  default: Lock,
};

export default function AuthPromptModal({
  action = "continue",
  open,
  onClose,
  redirect,
  title,
  description,
}) {
  const router = useRouter();
  const Icon = iconMap[action] || iconMap.default;

  if (!open) {
    return null;
  }

  const encodedRedirect = encodeURIComponent(redirect || "/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1512]/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(28,19,17,0.32)]">
        <div className="bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.35),_transparent_55%),linear-gradient(135deg,#5A0F1C,#A33A4B)] px-8 py-8 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14">
            <Icon className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">
            {title || "Login required"}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/78">
            {description || "Create an account or sign in to continue."}
          </p>
        </div>

        <div className="space-y-6 px-8 py-8">
          <div className="grid gap-3 rounded-[1.5rem] bg-[#FBF6F1] p-4 text-sm text-[#5B4038]">
            <p>Keep your cart, saved products, and orders synced to your account.</p>
            <p>Checkout and saved-items features stay locked for guests.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-[#D8C4B8] px-5 py-3 text-sm font-medium text-[#4E1320] transition hover:bg-[#FBF6F1]"
            >
              Not now
            </button>

            <button
              onClick={() => router.push(`/login?redirect=${encodedRedirect}`)}
              className="flex-1 rounded-full bg-[#4E1320] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3A0D17]"
            >
              Login
            </button>

            <button
              onClick={() => router.push(`/signup?redirect=${encodedRedirect}`)}
              className="flex-1 rounded-full bg-gradient-to-r from-[#8E2437] to-[#D4AF37] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
