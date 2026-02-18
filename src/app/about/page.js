"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="pt-28 bg-[#FAF6F0]">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-[var(--font-heading)] text-[#5A0F1C]"
        >
          Our Story ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto"
        >
          LuxxGlow was born with a simple dream — bring elegant,
          high-quality sarees to every woman at affordable prices.
        </motion.p>
      </section>


      {/* STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">

        <motion.img
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          src="https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNhcmVlJTIwcGhvdG9zaG9vdHxlbnwwfHwwfHx8MA%3D%3D"
          className="rounded-3xl shadow-xl h-[420px] object-cover w-full"
        />

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
            Tradition meets Modern Elegance
          </h2>

          <p className="mt-6 text-gray-700 leading-relaxed">
            We carefully curate sarees from trusted suppliers and artisans.
            Every saree is checked manually before shipping to ensure
            quality and authenticity.
          </p>

          <p className="mt-4 text-gray-600">
            Our mission is simple — make luxury affordable for every woman.
          </p>
        </motion.div>

      </section>


      {/* STATS */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-center">

          {[
            ["100+", "Happy Customers"],
            ["Premium", "Quality Fabrics"],
            ["Fast", "Pan-India Delivery"],
            ["Secure", "Payments"],
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-4xl font-bold text-[#5A0F1C]">{item[0]}</h3>
              <p className="text-gray-500 mt-2">{item[1]}</p>
            </motion.div>
          ))}

        </div>
      </section>


      {/* WHY CHOOSE US */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
          Why Customers Love Us 💖
        </h2>

        <div className="grid md:grid-cols-3 gap-12 mt-14">

          {[
            ["✨", "Premium Fabrics", "Handpicked luxury sarees"],
            ["🚚", "Fast Shipping", "Safe delivery across India"],
            ["💰", "Affordable Pricing", "Luxury without high price"],
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-5xl">{item[0]}</div>
              <h3 className="mt-4 text-xl font-semibold">{item[1]}</h3>
              <p className="text-gray-600 mt-2">{item[2]}</p>
            </motion.div>
          ))}

        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C] text-center">
          What Our Customers Say
        </h2>

        <div className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-3 gap-10">

          {[
            "Beautiful saree and fast delivery! Loved it ❤️",
            "Quality is amazing for this price.",
            "Perfect for weddings. Highly recommended!",
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="bg-[#FAF6F0] p-8 rounded-3xl shadow"
            >
              <p className="text-gray-700">“{text}”</p>
              <p className="mt-4 text-sm text-[#5A0F1C] font-semibold">
                Verified Buyer
              </p>
            </motion.div>
          ))}

        </div>
      </section>


      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-16">
          <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
            Ready to Explore Luxury? 💫
          </h2>

          <Link href="/shop">
            <button className="mt-8 px-10 py-4 rounded-full text-white font-semibold 
            bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] hover:scale-105 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

    </main>
  );
}
