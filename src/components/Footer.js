import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 overflow-hidden bg-[#1A1110] text-gray-300 sm:mt-20 lg:mt-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-16 lg:grid-cols-4 lg:gap-12 lg:px-8">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#5A0F1C] via-[#8E2437] to-[#D4AF37] text-sm font-semibold uppercase tracking-[0.2em] text-white">
              L&G
            </span>
            <div>
              <h2 className="text-3xl font-semibold text-[#F4E6D8]">Luxe&Glow</h2>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#C8A989]">Saree House</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm leading-relaxed text-gray-400">
            Discover premium sarees curated for weddings, celebrations, festive dressing, and refined everyday elegance.
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Trusted by modern women across India.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Quick Links</h3>
          <div className="space-y-3">
            <Link href="/" className="footer-link">
              Home
            </Link>
            <Link href="/shop" className="footer-link">
              Shop
            </Link>
            <Link href="/about" className="footer-link">
              About Us
            </Link>
            <Link href="/contact" className="footer-link">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Customer Policies
          </h3>
          <div className="space-y-3">
            <Link href="/privacy-policy" className="footer-link">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="footer-link">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="footer-link">
              Refund & Cancellation
            </Link>
            <Link href="/shipping-policy" className="footer-link">
              Shipping & Delivery
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Contact Us</h3>
          <div className="space-y-3 text-gray-400">
            <p className="flex items-center gap-2">
              <Mail size={16} />
              support@luxeandglow.com
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} />
              +91 XXXXX XXXXX
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="https://www.instagram.com/luxeglow161"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="https://www.facebook.com/share/17wQtXRfZE/"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
            >
              <Facebook size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Luxe&Glow Sarees. All rights reserved.
      </div>
    </footer>
  );
}
