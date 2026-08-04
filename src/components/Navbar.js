"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSavedProducts } from "@/context/SavedProductsContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { savedProducts } = useSavedProducts();

  const cartCount = cart?.length || 0;
  const savedCount = savedProducts.length;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <nav
        ref={menuRef}
        className={`border-b border-[#EADBCF] transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(250,246,240,0.96)] shadow-[0_10px_28px_rgba(62,25,18,0.07)] backdrop-blur-xl"
            : "bg-[rgba(250,246,240,0.78)] backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="hidden items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6C4E46] lg:flex">
            <Link href="/" className="transition hover:text-[#7D1111]">Home</Link>
            <Link href="/shop" className="transition hover:text-[#7D1111]">Collections</Link>
            <Link href="/shop?category=Festive" className="transition hover:text-[#7D1111]">Pujo Edit 2026</Link>
            <Link href="/about" className="transition hover:text-[#7D1111]">About</Link>
          </div>

          <Link href="/" className="flex min-w-0 items-center text-[#5A0F1C]">
            <span className="flex flex-col items-start sm:items-center">
              <span className="font-[var(--font-playfair)] text-xl font-semibold uppercase leading-none tracking-[0.08em] sm:text-2xl">
                Luxe & Glow
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.34em] text-[#8B6B62]">
                Saree House
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/saved" className="relative rounded-full p-2 text-[#5A0F1C] transition hover:bg-white/70 hover:text-[#9B251C]">
              <Heart className="h-4 w-4" />
              {savedCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-[#5A0F1C] px-2 py-0.5 text-[10px] text-white">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative rounded-full p-2 text-[#5A0F1C] transition hover:bg-white/70 hover:text-[#9B251C]">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-[#5A0F1C] px-2 py-0.5 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {!user ? (
              <Link
                href="/login"
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5A0F1C] transition hover:text-[#9B251C]"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5A0F1C] text-white transition hover:bg-[#9B251C]"
                >
                  <UserRound className="h-4 w-4" />
                </Link>
                <button
                  onClick={logout}
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5A0F1C] transition hover:text-[#8E2437]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="inline-flex items-center justify-center rounded-full border border-[#EADBCF] bg-white/80 p-2.5 text-[#5A0F1C] shadow-sm lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="space-y-3 border-t border-[#EADBCF] bg-[rgba(255,250,245,0.98)] px-4 pb-6 pt-4 text-base text-[#5A0F1C] lg:hidden">
            <Link href="/" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3 shadow-sm">Home</Link>
            <Link href="/shop" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3 shadow-sm">Shop</Link>
            <Link href="/saved" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3 shadow-sm">Saved</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3 shadow-sm">About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3 shadow-sm">Contact</Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3 shadow-sm">Cart</Link>

            {!user ? (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-2xl bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] px-4 py-3 font-semibold text-white"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl bg-white px-4 py-3 font-semibold shadow-sm"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-full rounded-2xl bg-white px-4 py-3 text-left font-semibold shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
