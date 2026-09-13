"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";

const OFFER_STORAGE_KEY = "luxglow_offer_dismissed_at";
const OFFER_REPEAT_MS = 24 * 60 * 60 * 1000;
const OFFER_DELAY_MS = 2500;

const POSTER_URL =
  "https://firebasestorage.googleapis.com/v0/b/luxxglow.firebasestorage.app/o/ChatGPT%20Image%20Sep%2012%2C%202026%2C%2011_33_20%20AM.png?alt=media&token=0f4a4f1d-474c-44d7-99c9-224a98fdbe87";

export default function OfferPopup() {
  const [open, setOpen] = useState(false);

  const dismiss = () => {
    try {
      localStorage.setItem(OFFER_STORAGE_KEY, String(Date.now()));
    } catch {}
    setOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const lastDismissed = Number(localStorage.getItem(OFFER_STORAGE_KEY) || 0);
        if (!Number.isNaN(lastDismissed) && Date.now() - lastDismissed < OFFER_REPEAT_MS) {
          return;
        }
      } catch {}
      setOpen(true);
    }, OFFER_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Luxe&Glow festive discount offer"
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4"
    >
      <button
        type="button"
        aria-label="Close offer banner"
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-[#3A1513]/70 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[92svh] w-[92vw] max-w-sm flex-col overflow-hidden rounded-[1.5rem] border border-white/15 bg-white shadow-[0_40px_90px_rgba(30,10,8,0.5)]">
        <button
          type="button"
          aria-label="Close offer"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#3A1513]/45 text-white transition hover:bg-[#7D1111]"
        >
          <X className="h-4 w-4" />
        </button>
        <div
          className="relative w-full shrink-0"
          style={{ aspectRatio: "3 / 2", maxHeight: "66svh" }}
        >
          <Image
            src={POSTER_URL}
            alt="Luxe&Glow festive discount up to 50% off"
            fill
            priority
            sizes="(max-width: 640px) 92vw, 384px"
            className="object-contain"
          />
        </div>
        <Link
          href="/offers"
          onClick={dismiss}
          className="flex shrink-0 items-center justify-center gap-2 bg-[#7D1111] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#5A0F1C]"
        >
          Grab the offer
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}