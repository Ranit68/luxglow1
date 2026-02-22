"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-[#FAF6F0] text-gray-800 overflow-hidden font-sans">

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#D4AF37] opacity-5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-3 rounded-full bg-[#5A0F1C]/10 text-[#5A0F1C] text-sm font-medium tracking-wide mb-4"
          >
            ESTABLISHED 2024
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-[var(--font-heading)] text-[#5A0F1C] leading-tight mb-6"
          >
            Weaving Heritage into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]">
              Modern Elegance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Lux&Glow bridges the gap between timeless Indian tradition and contemporary fashion, bringing handcrafted luxury to your doorstep.
          </motion.p>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute inset-0 border-2 border-[#5A0F1C] rounded-3xl translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?q=80&w=1000&auto=format&fit=crop"
                alt="Elegant Saree Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
                <p className="text-[#5A0F1C] font-bold text-xl font-[var(--font-heading)]">1000+</p>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
              The Lux&Glow Difference
            </h2>
            <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full" />
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Born from a passion for Indian craftsmanship, Lux&Glow was founded with a single goal: to make premium ethnic wear accessible to every modern woman. We believe that luxury shouldn't come with an unattainable price tag.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Every piece in our collection is meticulously curated from artisans who respect the loom. We combine heritage techniques with modern silhouettes to ensure you look stunning, whether it's a wedding, a festival, or a casual brunch.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#5A0F1C]">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full" /> Handpicked Fabrics
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#5A0F1C]">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full" /> Authenticated Quality
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= VALUES / STATS ================= */}
      <section className="bg-white py-20 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {[
              { label: "Premium Quality", icon: "✨", desc: "Top tier fabrics" },
              { label: "Trusted Sellers", icon: "🤝", desc: "Verified partners" },
              { label: "Pan India Ship", icon: "🚚", desc: "All 28 States" },
              { label: "Secure Pay", icon: "🔒", desc: "100% Protected" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center px-4 group"
              >
                <div className="w-14 h-14 bg-[#FAF6F0] rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-[#5A0F1C] group-hover:text-[#D4AF37] transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="font-[var(--font-heading)] text-lg text-[#5A0F1C] font-bold">{item.label}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C] mb-4">
            Why Lux&Glow?
          </h2>
          <p className="text-gray-600">We don't just sell sarees; we deliver an experience of elegance and trust.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium Fabrics",
              desc: "We source only the finest silks, cottons, and georgettes for a luxurious drape.",
              icon: "🧵"
            },
            {
              title: "Affordable Luxury",
              desc: "Get the look and feel of high-end boutiques without breaking the bank.",
              icon: "💎"
            },
            {
              title: "Fast & Reliable",
              desc: "Dedicated shipping partners ensure your order reaches you safely and quickly.",
              icon: "🚀"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF6F0] rounded-bl-full -mr-4 -mt-4 z-0" />
              <div className="relative z-10">
                <div className="text-4xl mb-6 bg-[#FAF6F0] w-16 h-16 flex items-center justify-center rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-[var(--font-heading)] text-[#5A0F1C] mb-3 font-bold">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-[#5A0F1C] py-24 px-6 relative overflow-hidden">
        {/* Gold Overlay Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] text-[#FAF6F0]">
              Loved by 10,000+ Women
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "The quality is unmatched! Received so many compliments at my friend's wedding. Definitely my go-to for ethnic wear.",
              "Finally, a site that understands modern trends while keeping the tradition alive. Fast shipping and great packaging too!",
              "I was skeptical about online saree shopping, but Lux&Glow exceeded my expectations. The color is exactly as shown."
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#FAF6F0] p-8 rounded-2xl shadow-xl relative"
              >
                <div className="absolute -top-4 left-6 bg-[#D4AF37] text-[#5A0F1C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified
                </div>
                <p className="text-gray-700 italic mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[#5A0F1C]">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="font-bold text-[#5A0F1C] text-sm">Customer {i + 1}</p>
                    <div className="flex text-[#D4AF37] text-xs">★★★★★</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A0F1C] to-[#8a1c32] rounded-[2.5rem] shadow-2xl transform scale-x-105" />
          
          <div className="relative z-10 text-center px-8 py-16">
            <h2 className="text-4xl md:text-5xl font-[var(--font-heading)] text-white mb-6">
              Ready to Glow? ✨
            </h2>
            <p className="text-[#FAF6F0] text-lg mb-10 max-w-2xl mx-auto opacity-90">
              Explore our exclusive collection of handcrafted sarees designed to make you the center of attention.
            </p>
            
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FAF6F0] text-[#5A0F1C] px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                Shop Collection
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}