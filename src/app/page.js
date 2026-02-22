import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title:
    "Lux&Glow – Buy Designer Sarees Online in India | Silk, Cotton, Wedding & Party Wear Sarees",

  description:
    "Shop premium designer sarees online at Lux&Glow. Explore silk, cotton, bridal & festive sarees with pan India delivery.",

  keywords: [
    "buy sarees online",
    "designer sarees India",
    "silk sarees online",
    "wedding sarees",
    "cotton sarees",
    "luxury sarees India",
    "bridal sarees online",
    "ethnic wear women",
    "Lux&Glow sarees",
  ],
};

export default function Home() {
  return (
    <main className="bg-[#FAF6F0] overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT */}
        <div className="space-y-7 text-center lg:text-left">

          <p className="tracking-widest text-sm text-[#D4AF37] font-semibold">
            NEW ARRIVAL COLLECTION
          </p>

          <h1 className="text-4xl md:text-6xl font-[var(--font-heading)] text-[#5A0F1C] leading-tight">
            Elegance Woven <br /> Into Every Saree ✨
          </h1>

          <p className="text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
            Discover premium handcrafted sarees blending timeless
            Indian tradition with modern luxury fashion.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link href="/shop">
              <button className="px-8 py-4 rounded-full text-white font-semibold
              bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]
              hover:scale-105 transition shadow-xl">
                Shop Collection
              </button>
            </Link>

            <Link href="/shop?category=Wedding">
              <button className="px-8 py-4 rounded-full border border-[#5A0F1C]
              text-[#5A0F1C] hover:bg-[#5A0F1C] hover:text-white transition">
                Wedding Sarees
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c"
            alt="Designer Saree"
            width={700}
            height={600}
            className="rounded-3xl shadow-2xl object-cover w-full h-[520px]"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20"/>
        </div>

      </section>

      {/* ================= CATEGORY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-center text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
          Shop by Category
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-14">

          {[
            {
              name: "Silk Sarees",
              img: "https://diademstore.com/cdn/shop/files/golden-pure-kanchipuram-tissue-silk.jpg",
              link: "Silk",
            },
            {
              name: "Festive Collection",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwrlCs3Ony_oJhn8fnUaDUqSW7xJkMElZFRQ&s",
              link: "Festive",
            },
            {
              name: "Cotton Daily Wear",
              img: "https://thenmozhidesigns.com/cdn/shop/files/3S2A0370copy.jpg",
              link: "Cotton",
            },
          ].map((item, i) => (
            <Link key={i} href={`/shop?category=${item.link}`}>
              <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">

                <Image
                  src={item.img}
                  alt={item.name}
                  width={400}
                  height={500}
                  className="h-[420px] w-full object-cover
                  group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"/>

                <div className="absolute bottom-10 left-8 text-white">
                  <h3 className="text-3xl font-[var(--font-heading)]">
                    {item.name}
                  </h3>
                  <p className="opacity-0 group-hover:opacity-100 transition">
                    View Collection →
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

          {[
            ["✨", "Premium Quality"],
            ["🚚", "Pan India Delivery"],
            ["🔒", "Secure Payments"],
            ["↩️", "Easy Returns"],
          ].map((item, i) => (
            <div key={i}>
              <p className="text-4xl">{item[0]}</p>
              <p className="mt-3 font-semibold">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        <Image
          src="https://images.unsplash.com/photo-1716504628105-bd76d91e85f2"
          alt="About Lux&Glow"
          width={600}
          height={500}
          className="rounded-3xl shadow-2xl object-cover"
        />

        <div>
          <h2 className="text-4xl md:text-5xl font-[var(--font-heading)] text-[#5A0F1C]">
            Crafted With Tradition.
            <br /> Styled For Today.
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            Lux&Glow celebrates timeless Indian craftsmanship.
            Every saree blends heritage elegance with modern fashion.
          </p>

          <div className="flex gap-10 mt-8">
            <div>
              <h3 className="text-3xl font-bold text-[#5A0F1C]">100+</h3>
              <p className="text-sm text-gray-500">Happy Customers</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#5A0F1C]">Premium</h3>
              <p className="text-sm text-gray-500">Fabrics</p>
            </div>
          </div>

          <Link href="/about">
            <button className="mt-10 px-8 py-3 rounded-full text-white
            bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]
            hover:scale-105 transition">
              Learn More
            </button>
          </Link>
        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl text-center p-14">

          <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
            Elevate Your Wardrobe Today 💖
          </h2>

          <Link href="/shop">
            <button className="mt-8 px-10 py-4 rounded-full text-white
            bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]
            hover:scale-105 transition shadow-lg">
              Shop Sarees
            </button>
          </Link>

        </div>
      </section>

    </main>
  );
}