import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#0E0E0E] text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-3xl font-semibold text-[#D4AF37]">Lux&Glow</h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            Discover premium sarees crafted for weddings, celebrations, and
            timeless elegance.
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
              support@luxxglow.com
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
        &copy; {new Date().getFullYear()} Lux&Glow Sarees. All rights reserved.
      </div>
    </footer>
  );
}
