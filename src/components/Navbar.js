"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart?.length || 0;
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(); // ⭐ for outside click

  // detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⭐ CLOSE MENU WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed w-full z-50 flex justify-center">
      <nav
        ref={menuRef}
        className={`
        transition-all duration-300
        ${scrolled
            ? "w-full rounded-none bg-white shadow-md mt-0"
            : "w-[95%] mt-5 rounded-2xl bg-white/70 backdrop-blur-lg shadow-lg"}
        `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="text-3xl font-[var(--font-heading)] text-[#5A0F1C] tracking-wide">
            Lux&Glow
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
            <Link href="/" className="hover:text-[#5A0F1C]">Home</Link>
            <Link href="/shop" className="hover:text-[#5A0F1C]">Shop</Link>
            <Link href="/about" className="hover:text-[#5A0F1C]">About</Link>
            <Link href="/contact" className="hover:text-[#5A0F1C]">Contact</Link>
          </div>

          {/* RIGHT SIDE DESKTOP */}
          <div className="hidden md:flex items-center gap-6">

            {/* CART */}
            <Link href="/cart" className="relative text-xl">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#5A0F1C] text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* PROFILE ICON */}
            {!user ? (
              <Link
                href="/login"
                className="px-5 py-2 rounded-full text-white 
                bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full bg-[#5A0F1C] text-white 
                flex items-center justify-center text-lg font-bold hover:scale-110 transition"
              >
                👤
              </Link>
            )}
          </div>

          {/* MOBILE MENU BTN */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        {/* 📱 MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white px-6 pb-6 pt-2 space-y-4 text-lg">

            <Link href="/" onClick={()=>setOpen(false)} className="block">Home</Link>
            <Link href="/shop" onClick={()=>setOpen(false)} className="block">Shop</Link>
            <Link href="/about" onClick={()=>setOpen(false)} className="block">About</Link>
            <Link href="/contact" onClick={()=>setOpen(false)} className="block">Contact</Link>
            <Link href="/cart" onClick={()=>setOpen(false)} className="block">Cart</Link>

            {/* ⭐ FIXED MOBILE AUTH */}
            {!user ? (
              <Link
                href="/login"
                onClick={()=>setOpen(false)}
                className="block text-[#5A0F1C] font-semibold"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={()=>setOpen(false)}
                  className="block text-[#5A0F1C] font-semibold"
                >
                  My Profile 👤
                </Link>
              </>
            )}

          </div>
        )}
      </nav>
    </div>
  );
}
