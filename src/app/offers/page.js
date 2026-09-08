"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgePercent,
  Camera,
  ClipboardCheck,
  Gift,
  Instagram,
  MessageCircle,
  Megaphone,
  Share2,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { siteConfig } from "@/lib/seo";

function formatDiscount(coupon) {
  if (coupon.discountType === "fixed") {
    return `₹${Number(coupon.discountValue).toLocaleString("en-IN")} OFF`;
  }
  return `${coupon.discountValue}% OFF`;
}

function SocialShareCard() {
  const steps = [
    {
      icon: ShoppingBag,
      title: "Buy & receive your saree",
      text: "Place an order and wait for it to be delivered to your doorstep.",
    },
    {
      icon: Camera,
      title: "Post a photo wearing it",
      text: "Snap a photo wearing your Luxe&Glow saree. Natural light works best.",
    },
    {
      icon: Share2,
      title: "Tag us on Instagram / Facebook",
      text: "Post the photo and tag @luxeglow on Instagram or Luxe&Glow on Facebook. Add #LuxeGlowSaree.",
    },
    {
      icon: MessageCircle,
      title: "Share the post link with us",
      text: "Send the post link to us on WhatsApp — we'll verify and send your reward code.",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#5A0F1C] via-[#7A1C2B] to-[#8E2437] p-8 text-white shadow-[0_30px_60px_rgba(62,25,18,0.25)] sm:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#E3B873]">
            <Megaphone className="h-4 w-4" />
            Earn cashback on your style
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Post your saree look &amp; get up to{" "}
            <span className="text-[#E3B873]">50% OFF</span> your next order
          </h2>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-[#E3B873]/50 bg-[#E3B873]/10 px-5 py-2 text-sm font-semibold text-[#F4DFB0]">
          *Terms apply
        </span>
      </div>

      <p className="mt-6 max-w-3xl leading-relaxed text-gray-200">
        We handcraft every saree and love seeing them come alive in your wardrobe. Show us
        how you style it, and we&apos;ll reward you with a discount on your next Luxe&Glow
        order.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3B873] text-[#5A0F1C]">
                <step.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold text-[#E3B873]">Step {index + 1}</span>
            </div>
            <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#E3B873]/30 bg-[#E3B873]/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-semibold text-[#F4DFB0]">
            <Gift className="h-5 w-5" />
            How do I get the code?
          </p>
          <p className="mt-1 max-w-xl text-sm text-gray-300">
            Once we confirm your post, we&apos;ll WhatsApp you a coupon code worth up to 50%
            off your next order. Simple — earn by sharing your style.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#E3B873] px-6 py-3 text-sm font-semibold text-[#5A0F1C] transition hover:bg-[#F4DFB0]"
          >
            <MessageCircle className="h-4 w-4" />
            Talk to us on WhatsApp
          </Link>
          <Link
            href="https://www.instagram.com/luxeglow161"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Instagram className="h-4 w-4" />
            @luxeglow161
          </Link>
        </div>
      </div>
    </section>
  );
}

function FirstOrderCard() {
  return (
    <section className="rounded-[2rem] border border-[#E7DDD1] bg-white p-8 shadow-[0_18px_40px_rgba(62,25,18,0.06)] sm:p-10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C7893C]">
        <BadgePercent className="h-4 w-4" />
        First order reward
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-[#5A0F1C]">
        Welcome to Luxe&Glow
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-[#5F5148]">
        New to our saree house? Enjoy{" "}
        <span className="font-semibold text-[#7A1C2B]">₹200 off</span> your first order of
        ₹1,000 or more. Apply the code at checkout — no strings attached.
      </p>

      <div className="mt-6 inline-flex flex-wrap items-center gap-3">
        <span className="rounded-2xl border border-dashed border-[#7A1C2B] bg-[#FAF6F0] px-6 py-3 font-[var(--font-mono)] text-xl font-bold tracking-[0.2em] text-[#7A1C2B]">
          FIRST100
        </span>
        <span className="text-sm text-[#7A6B5F]">Min. order ₹1,000 · On your first order</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-[#7A1C2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5A0F1C]"
        >
          <ShoppingBag className="h-4 w-4" />
          Shop sarees
        </Link>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 rounded-full border border-[#D8C4B8] px-6 py-3 text-sm font-semibold text-[#5A0F1C] transition hover:bg-[#FAF6F0]"
        >
          <Tag className="h-4 w-4" />
          Go to checkout
        </Link>
      </div>
    </section>
  );
}

function LiveCoupons() {
  const [coupons, setCoupons] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/coupons/list")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (active && data?.coupons?.length) setCoupons(data.coupons);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-[2rem] border border-[#E7DDD1] bg-[#FCF8F3] p-8 sm:p-10">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C7893C]">
        <ClipboardCheck className="h-4 w-4" />
        Live right now
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-[#5A0F1C]">
        Active coupon codes
      </h2>
      <p className="mt-3 text-[#5F5148]">
        Codes updated live from the store. Copy one and apply it at checkout.
      </p>

      {coupons === null ? (
        <p className="mt-6 text-sm text-[#7A6B5F]">Loading live coupons...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="rounded-2xl border border-[#E7DDD1] bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-xl border border-dashed border-[#7A1C2B] bg-[#FAF6F0] px-4 py-2 font-[var(--font-mono)] text-base font-bold tracking-[0.16em] text-[#7A1C2B]">
                  {coupon.code}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {formatDiscount(coupon)}
                </span>
              </div>
              {Number(coupon.minimumOrderValue) > 0 && (
                <p className="mt-3 text-sm text-[#7A6B5F]">
                  Min. order ₹
                  {Number(coupon.minimumOrderValue).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Terms() {
  return (
    <section className="rounded-[2rem] border border-[#E7DDD1] bg-white p-8 text-sm leading-relaxed text-[#5F5148] sm:p-10">
      <h2 className="text-2xl font-semibold text-[#24110D]">Terms &amp; conditions</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>
          The social reward (up to 50% off) applies to customers who have placed at least
          one completed order. Discount is issued as a coupon for a future purchase.
        </li>
        <li>
          Your post must include a clear photo of the purchased Luxe&Glow saree and tag{" "}
          <span className="font-medium text-[#7A1C2B]">@luxeglow161</span> (Instagram) or{" "}
          <span className="font-medium text-[#7A1C2B]">Luxe&Glow</span> (Facebook). Posting
          must be public so we can verify it.
        </li>
        <li>
          Reward amount varies by post quality and product and is at the sole discretion of
          Luxe&Glow. Each customer can earn this reward once per order.
        </li>
        <li>
          Coupons cannot be combined with other offers, cannot be redeemed for cash, and are
          valid only for online orders on luxeglow.in.
        </li>
        <li>Free shipping applies to all orders across India.</li>
      </ul>
    </section>
  );
}

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28 md:px-6">
      <div className="mx-auto max-w-6xl py-16">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8E2437]">
            Luxe&Glow Rewards
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-[#5A0F1C]">Offers &amp; Ways to Save</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#6F6258]">
            Save on your first order, and earn up to 50% off your next one by sharing your
            Luxe&Glow look with the world.
          </p>
        </div>

        <div className="space-y-8">
          <SocialShareCard />
          <FirstOrderCard />
          <LiveCoupons />
          <Terms />
        </div>

        <p className="mt-12 text-center text-sm text-[#A08D7D]">
          Questions about an offer? Reach us at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-[#7A1C2B]">
            {siteConfig.contactEmail}
          </a>{" "}
          or call {siteConfig.phone}.
        </p>
      </div>
    </main>
  );
}