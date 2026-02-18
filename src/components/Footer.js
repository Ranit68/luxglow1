import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-[var(--font-heading)] text-[#D4AF37]">
            Lux&Glow
          </h2>
          <p className="mt-4 text-gray-400">
            Premium sarees crafted for weddings, festivals & everyday elegance.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="space-y-2">
            <Link href="/" className="block hover:text-[#D4AF37]">Home</Link>
            <Link href="/shop" className="block hover:text-[#D4AF37]">Shop</Link>
            <Link href="/about" className="block hover:text-[#D4AF37]">About</Link>
            <Link href="/contact" className="block hover:text-[#D4AF37]">Contact</Link>
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-2">
            <p>Silk Sarees</p>
            <p>Wedding Sarees</p>
            <p>Cotton Sarees</p>
            <p>Party Wear</p>
          </div>
        </div>

        {/* POLICIES 🔥 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Policies
          </h3>
          <div className="space-y-2">
            <Link href="/privacy-policy" className="block hover:text-[#D4AF37]">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="block hover:text-[#D4AF37]">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="block hover:text-[#D4AF37]">
              Refund & Cancellation
            </Link>
            <Link href="/shipping-policy" className="block hover:text-[#D4AF37]">
              Shipping & Delivery
            </Link>
          </div>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="space-y-2">
            <Link href="https://www.instagram.com/luxeglow161?igsh=MWc2MWlqcHhmYXBvOA==" className="block hover:text-[#D4AF37]">
            Instagram
            </Link>
            <Link href="https://www.facebook.com/share/17wQtXRfZE/" className="block hover:text-[#D4AF37]">
            Facebook
            </Link>
             {/* <Link href="https://www.facebook.com/share/17wQtXRfZE/" className="block hover:text-[#D4AF37]">
            Pintrest
            </Link>
             <Link href="https://www.facebook.com/share/17wQtXRfZE/" className="block hover:text-[#D4AF37]">
            Whatsapp
            </Link> */}
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-6 text-gray-500">
        © {new Date().getFullYear()} LuxxGlow Sarees. All rights reserved.
      </div>
    </footer>
  );
}
