import Link from "next/link";


export const metadata = {
  title: "Buy Designer Sarees Online | LuxxGlow",
  description:
    "Explore elegant silk, cotton & wedding sarees. Affordable luxury sarees online in India.",
};

export default function Home() {
  return (
    <main className="pt-28 bg-[#FAF6F0]">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-[var(--font-heading)] leading-tight text-[#5A0F1C]">
            Timeless Sarees <br /> For Modern Women ✨
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            Discover handpicked silk, cotton & wedding sarees crafted
            for elegance and everyday luxury.
          </p>

          <Link href="/shop">
  <button className="mt-8 px-8 py-4 rounded-full text-white font-semibold 
  bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] hover:scale-105 transition">
    Explore Collection
  </button>
</Link>

        </div>

        {/* HERO IMAGE */}
        <div className="h-[420px] rounded-3xl shadow-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
      </section>


      {/* CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-[var(--font-heading)] text-center text-[#5A0F1C]">
          Shop by Category
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {/* Silk */}
          <Link href="/shop?category=Silk">

          <div className="relative group overflow-hidden rounded-3xl shadow-lg">
            <img
              src="https://diademstore.com/cdn/shop/files/golden-pure-kanchipuram-tissue-silk.jpg?v=1748499862"
              className="h-[420px] w-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>
            <div className="absolute bottom-10 left-8 text-white">
              <h3 className="text-3xl font-[var(--font-heading)]">Silk Sarees</h3>
              <p className="opacity-0 group-hover:opacity-100 transition mt-2">
                View Collection →
              </p>
            </div>
          </div>
          </Link>
          

          {/* Festive */}
          <Link href="/shop?category=Festive">

          <div className="relative group overflow-hidden rounded-3xl shadow-lg">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwrlCs3Ony_oJhn8fnUaDUqSW7xJkMElZFRQ&s"
              className="h-[420px] w-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>
            <div className="absolute bottom-10 left-8 text-white">
              <h3 className="text-3xl font-[var(--font-heading)]">Festive Collection</h3>
              <p className="opacity-0 group-hover:opacity-100 transition mt-2">
                View Collection →
              </p>
            </div>
          </div>
          </Link>

          {/* Cotton */}
          <Link href="/shop?category=Cotton">

          <div className="relative group overflow-hidden rounded-3xl shadow-lg">
            <img
              src="https://thenmozhidesigns.com/cdn/shop/files/3S2A0370copy.jpg?v=1692417232&width=2048"
              className="h-[420px] w-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>
            <div className="absolute bottom-10 left-8 text-white">
              <h3 className="text-3xl font-[var(--font-heading)]">Cotton Daily Wear</h3>
              <p className="opacity-0 group-hover:opacity-100 transition mt-2">
                View Collection →
              </p>
            </div>
          </div>
          </Link>

        </div>
      </section>



      {/* WHY CHOOSE */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
          Why LuxxGlow?
        </h2>

        <div className="grid md:grid-cols-3 gap-12 mt-14">

          <div>
            <div className="text-5xl">✨</div>
            <h3 className="mt-4 text-xl font-semibold">Premium Fabrics</h3>
            <p className="text-gray-600 mt-2">
              Handpicked quality sarees curated with love.
            </p>
          </div>

          <div>
            <div className="text-5xl">💰</div>
            <h3 className="mt-4 text-xl font-semibold">Affordable Luxury</h3>
            <p className="text-gray-600 mt-2">
              Luxury sarees without luxury pricing.
            </p>
          </div>

          <div>
            <div className="text-5xl">🚚</div>
            <h3 className="mt-4 text-xl font-semibold">Fast Delivery</h3>
            <p className="text-gray-600 mt-2">
              Safe & quick shipping across India.
            </p>
          </div>

        </div>
      </section>

{/* ABOUT US SECTION */}
<section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

  {/* IMAGE SIDE */}
  <div className="relative">
    <div className="rounded-3xl overflow-hidden shadow-2xl">
      <img
        src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1600&auto=format&fit=crop"
        className="w-full h-[450px] object-cover"
      />
    </div>

    {/* decorative gradient glow */}
    <div className="absolute -bottom-8 -right-8 w-40 h-40 
    bg-gradient-to-br from-[#5A0F1C] to-[#D4AF37] 
    rounded-full blur-3xl opacity-20"></div>
  </div>


  {/* TEXT SIDE */}
  <div>
    <h2 className="text-4xl md:text-5xl font-[var(--font-heading)] text-[#5A0F1C] leading-tight">
      Crafted With Tradition.  
      <br /> Styled For Today.
    </h2>

    <p className="mt-6 text-gray-700 text-lg leading-relaxed">
      At <span className="font-semibold text-[#5A0F1C]">Lux&Glow</span>, 
      we celebrate the timeless beauty of Indian sarees.  
      Every piece is thoughtfully selected to bring together 
      heritage craftsmanship and modern elegance.
    </p>

    <p className="mt-4 text-gray-600 leading-relaxed">
      Whether it’s a wedding, festive celebration, or daily wear — 
      our sarees are designed to make every woman feel confident, graceful, 
      and effortlessly beautiful.
    </p>

    <div className="mt-8 flex gap-6">

      <div>
        <h3 className="text-3xl font-bold text-[#5A0F1C]">100+</h3>
        <p className="text-gray-500 text-sm">Happy Customers</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#5A0F1C]">Premium</h3>
        <p className="text-gray-500 text-sm">Quality Fabrics</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-[#5A0F1C]">Pan India</h3>
        <p className="text-gray-500 text-sm">Delivery</p>
      </div>

    </div>

    <Link href="/about">
      <button className="mt-10 px-8 py-3 rounded-full text-white font-semibold
      bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] hover:scale-105 transition">
        Learn More About Us
      </button>
    </Link>
  </div>

</section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-16">
          <h2 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C]">
            Elevate Your Wardrobe Today 💖
          </h2>

        <Link href="/shop">
  <button className="mt-8 px-10 py-4 rounded-full text-white font-semibold 
  bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] hover:scale-105 transition">
    Shop Sarees
  </button>
</Link>

        </div>
      </section>

    </main>
  );
}
