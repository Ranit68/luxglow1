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
    <div className="fixed z-50 flex w-full justify-center">
      <nav
        ref={menuRef}
        className={`transition-all duration-300 ${
          scrolled
            ? "mt-0 w-full border-b border-[#EADBCF] bg-[rgba(250,246,240,0.96)] shadow-[0_10px_28px_rgba(62,25,18,0.07)] backdrop-blur-xl"
            : "mt-0 w-full border-b border-white/30 bg-[rgba(250,246,240,0.76)] backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-3">
          <div className="hidden items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6C4E46] md:flex">
            <Link href="/" className="transition hover:text-[#7D1111]">Home</Link>
            <Link href="/shop" className="transition hover:text-[#7D1111]">Collections</Link>
            <Link href="/shop?category=Festive" className="transition hover:text-[#7D1111]">Pujo Edit 2026</Link>
            <Link href="/about" className="transition hover:text-[#7D1111]">About</Link>
          </div>

          <Link
            href="/"
            className="justify-self-start text-center text-[#5A0F1C] md:justify-self-center"
          >
            <span className="flex flex-col items-start md:items-center">
              <span className="font-[var(--font-playfair)] text-2xl font-semibold uppercase leading-none tracking-[0.08em]">
                Luxe & Glow
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.34em] text-[#8B6B62]">
                Saree House
              </span>
            </span>
          </Link>

          <div className="hidden items-center justify-end gap-4 md:flex">
            <Link href="/saved" className="relative p-2 text-[#5A0F1C] transition hover:text-[#9B251C]">
              <Heart className="h-4 w-4" />
              {savedCount > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-[#5A0F1C] px-2 py-0.5 text-xs text-white">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 text-[#5A0F1C] transition hover:text-[#9B251C]">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-[#5A0F1C] px-2 py-0.5 text-xs text-white">
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
                  className="flex h-8 w-8 items-center justify-center bg-[#5A0F1C] text-white transition hover:bg-[#9B251C]"
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
            className="justify-self-end bg-white/80 p-2 text-[#5A0F1C] shadow-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {open && (
          <div className="space-y-3 border-t border-[#EADBCF] bg-[rgba(255,250,245,0.98)] px-6 pb-6 pt-4 text-base text-[#5A0F1C] md:hidden">
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
                  className="block rounded-2xl bg-white px-4 py-3 text-left font-semibold shadow-sm"
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
