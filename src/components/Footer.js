import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0E] text-gray-300 mt-24">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 
      grid sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-semibold text-[#D4AF37]">
            Lux&Glow
          </h2>

          <p className="mt-4 text-gray-400 leading-relaxed">
            Discover premium sarees crafted for weddings,
            celebrations and timeless elegance.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            ✨ Trusted by modern women across India
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">
            Quick Links
          </h3>

          <div className="space-y-3">
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/shop" className="footer-link">Shop</Link>
            <Link href="/about" className="footer-link">About Us</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>
        </div>

        {/* CUSTOMER POLICIES */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">
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

        {/* CONTACT + SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">
            Contact Us
          </h3>

          <div className="space-y-3 text-gray-400">

            <p className="flex items-center gap-2">
              <Mail size={16}/> support@luxxglow.com
            </p>

            <p className="flex items-center gap-2">
              <Phone size={16}/> +91 XXXXX XXXXX
            </p>

          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-6">

            <Link
              href="https://www.instagram.com/luxeglow161"
              target="_blank"
              className="social-icon"
            >
              <Instagram size={20}/>
            </Link>

            <Link
              href="https://www.facebook.com/share/17wQtXRfZE/"
              target="_blank"
              className="social-icon"
            >
              <Facebook size={20}/>
            </Link>

          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Lux&Glow Sarees — All Rights Reserved.
      </div>

    </footer>
  );
}