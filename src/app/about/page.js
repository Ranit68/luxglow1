import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Gem, ShieldCheck, Truck } from "lucide-react";

const values = [
  {
    title: "Curated with restraint",
    copy: "Every saree is chosen for drape, finish, color depth, and how naturally it fits real occasions.",
  },
  {
    title: "Rooted in heritage",
    copy: "Our edit keeps Indian craft at the center while styling it for women who shop online and dress intuitively.",
  },
  {
    title: "Built for trust",
    copy: "Clear product details, protected checkout flows, and account-linked carts keep the buying experience calm.",
  },
];

const promises = [
  ["Premium feel", "Silks, cottons, organzas, and festive textures selected for graceful wear.", Gem],
  ["Protected shopping", "Saved items, checkout, and order flows stay connected to your account.", ShieldCheck],
  ["Pan-India reach", "A boutique saree experience designed for customers across India.", Truck],
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#F7F3EE] text-[#2D1712]">
      <section className="relative min-h-[78svh] bg-[#2F1711] pt-24">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FChatGPT%20Image%20Jul%2012%2C%202026%2C%2006_58_50%20PM.png?alt=media&token=cbdba938-64d1-4ca7-9dbc-03a876cd5fe8"
          alt="Luxe&Glow heritage saree detail"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-58"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,23,17,0.86),rgba(47,23,17,0.52),rgba(47,23,17,0.18)),linear-gradient(180deg,rgba(47,23,17,0.2),rgba(47,23,17,0.72))]" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl text-[#FFF8ED]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#E7C981]">
              About Luxe&Glow
            </p>
            <h1 className="mt-5 font-[var(--font-editorial)] text-5xl font-semibold leading-[0.96] md:text-7xl">
              Sarees chosen for memory, movement, and meaning.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#F3E5CF]/86 md:text-base">
              Luxe&Glow is an online saree house shaped around modern Indian occasions:
              Pujo mornings, wedding evenings, family celebrations, and everyday elegance
              that still feels special.
            </p>
            <Link
              href="/shop"
              className="mt-9 inline-flex items-center gap-2 border border-[#E7C981] bg-[#E7C981] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#32130D] transition hover:bg-[#F7DEA0]"
            >
              Explore collection
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
            Our story
          </p>
          <h2 className="mt-4 font-[var(--font-editorial)] text-4xl font-semibold leading-tight text-[#7D1111] md:text-5xl">
            A boutique eye, made accessible online.
          </h2>
          <p className="mt-6 text-sm leading-8 text-[#5F5148]">
            We started Luxe&Glow with a simple belief: buying a saree online should
            feel as considered as choosing one in a trusted boutique. The photography,
            fabric curation, product details, and checkout experience all work toward
            one goal: helping you find a saree that already feels styled.
          </p>
          <p className="mt-5 text-sm leading-8 text-[#5F5148]">
            Our collections bring together festive statements, softer daily drapes,
            bridal-ready pieces, and heritage-inspired edits. Each saree is selected
            for how it looks, how it moves, and how confidently it can carry an occasion.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-[0.8fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-[#E1D2C2] sm:mt-16">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2Felegant_woman_in_a_white_and_red_traditional_saree_mahalaya_morning_atmosphere.png?alt=media&token=7f7b84ed-b88d-4b06-b11b-e4c5340d4fbb"
              alt="White and red festive saree"
              fill
              sizes="(min-width: 1024px) 26vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-[1.5rem] border border-[#E1D2C2]">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2Fregal_woman_in_a_heavy_silk_saree_for_ashtami_evening_opulent_traditional.png?alt=media&token=cde9e4e3-0164-45ee-940a-1dc52fe37803"
              alt="Regal silk saree for celebration"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[#DED0C0] bg-[#F0EAE2] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {values.map((item) => (
            <div key={item.title} className="border-t border-[#B9965B] pt-7">
              <h3 className="font-[var(--font-editorial)] text-3xl font-semibold text-[#7D1111]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#5F5148]">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
              Our promise
            </p>
            <h2 className="mt-4 font-[var(--font-editorial)] text-4xl font-semibold leading-tight text-[#24110D] md:text-5xl">
              Quiet luxury, clear service, and sarees that hold attention.
            </h2>
          </div>
          <p className="text-sm leading-8 text-[#5F5148]">
            We keep the site experience focused and personal: simple browsing,
            thoughtful imagery, protected actions for cart and checkout, and collections
            organized around how customers actually dress for occasions.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {promises.map(([title, copy, Icon]) => (
            <div key={title} className="rounded-[1.25rem] border border-[#E1D2C2] bg-[#FFFBF5] p-7">
              <Icon className="h-6 w-6 text-[#8A5A18]" />
              <h3 className="mt-6 font-[var(--font-editorial)] text-2xl font-semibold text-[#7D1111]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5F5148]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#8F0907] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#F0C874]">
            From our family to yours
          </p>
          <h2 className="mt-4 font-[var(--font-editorial)] text-4xl font-semibold md:text-5xl">
            Find a saree for the moment you want to remember.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/78">
            Explore the Pujo edit, festive collection, and everyday classics curated
            with the same Luxe&Glow eye.
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-flex bg-[#FFE2A1] px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7D1111] transition hover:bg-white"
          >
            Shop Luxe&Glow sarees
          </Link>
        </div>
      </section>
    </main>
  );
}
