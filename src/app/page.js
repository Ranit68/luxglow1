import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PujoCountdown } from "@/components/DurgaPujoExperience";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const metadata = {
  title: "Luxe&Glow Pujo Edit 2026 - Designer Sarees Online",
  description:
    "Explore the Luxe&Glow Durga Pujo saree edit with festive silk, organza, cotton, and celebration-ready drapes for 2026.",
  keywords: [
    "Durga Pujo sarees",
    "Durga Puja saree collection",
    "festive sarees online",
    "designer sarees India",
    "silk sarees online",
    "Luxe&Glow sarees",
  ],
};

const dayEdits = [
  {
    title: "Mahalaya Collection",
    eyebrow: "Soft morning whites",
    copy: "Ivory, red borders, and quiet elegance for the first festive note.",
    href: "/shop?category=Festive",
    image:
      "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2Felegant_woman_in_a_white_and_red_traditional_saree_mahalaya_morning_atmosphere.png?alt=media&token=7f7b84ed-b88d-4b06-b11b-e4c5340d4fbb",
    featured: true,
  },
  {
    title: "Shashthi Style",
    eyebrow: "Light arrival looks",
    copy: "Airy organza and gentle drapes for the first pandal evening.",
    href: "/shop?category=Organza",
    image: "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FChatGPT%20Image%20Jul%2012%2C%202026%2C%2009_10_18%20PM.png?alt=media&token=5e9ee1d8-8414-40a9-a650-7d7824784fcf",
    featured: true,
  },
  {
    title: "Saptami Elegance",
    eyebrow: "Threadwork details",
    copy: "Petal-soft color and delicate zari for family visits.",
    href: "/shop?category=Silk",
    image: "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FChatGPT%20Image%20Jul%2012%2C%202026%2C%2008_53_19%20PM.png?alt=media&token=faeb9ae7-c4d4-4c8d-b988-abbbf00be08a",
    featured: true,
  },
  {
    title: "Ashtami Royal",
    eyebrow: "Anjali ready",
    copy: "Rich reds and golds made for the most photographed morning.",
    href: "/shop?category=Wedding",
    image:
      "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2Fregal_woman_in_a_heavy_silk_saree_for_ashtami_evening_opulent_traditional.png?alt=media&token=cde9e4e3-0164-45ee-940a-1dc52fe37803",
    featured: true,
  },
  {
    title: "Navami Celebration",
    eyebrow: "Evening glow",
    copy: "Bold contemporary weaves for the last grand night out.",
    href: "/shop?category=Party",
    image: "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FUntitled%20design(5).png?alt=media&token=8bbade9e-f846-4d10-bd78-f60ae6854b5d",
    featured: true,
  },
  {
    title: "Bijoya Classics",
    eyebrow: "Sindoor and sweets",
    copy: "The quintessential red-and-gold drape for Dashami rituals.",
    href: "/shop?category=Festive",
    red: true,
  },
];

const trustPoints = [
  ["From our family to yours", "Every saree is selected for fabric feel, drape, and festive polish."],
  ["Secure checkout", "Saved cart, account-linked shopping, and payment support."],
  ["Pan-India delivery", "Celebrate from Kolkata to anywhere your Pujo plans take you."],
];

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/favicon.ico"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contactEmail,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="overflow-hidden bg-[#F8F2EE] text-[#4A241E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <section className="relative min-h-[100svh] overflow-hidden bg-[#3A1F19] md:min-h-screen">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/pujo_banner.png?alt=media&token=02bea73e-1122-46ba-ae33-3dc364c52899"
          alt="Luxe&Glow Durga Puja festive saree collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,13,8,0.22),rgba(44,13,8,0.08)_42%,rgba(44,13,8,0.46)),linear-gradient(90deg,rgba(255,244,226,0.72),rgba(255,244,226,0.34)_42%,rgba(44,13,8,0.08)_72%)] md:bg-[#2C0D08]/10" />
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
          <span className="dhup-smoke dhup-smoke-one" />
          <span className="dhup-smoke dhup-smoke-two" />
          <span className="dhup-smoke dhup-smoke-three" />
          <span className="shiuli-flower shiuli-flower-one" />
          <span className="shiuli-flower shiuli-flower-two" />
          <span className="shiuli-flower shiuli-flower-three" />
          <span className="shiuli-flower shiuli-flower-four" />
        </div>

        <div className="relative z-10 min-h-[100svh] md:min-h-screen">
          <Link
            href="/shop?category=Festive"
            aria-label="Shop Pujo collection"
            className="absolute left-[12.7%] top-[73.6%] hidden h-[6.4%] w-[15.1%] md:block"
          />
          <Link
            href="/shop"
            aria-label="Explore festive looks"
            className="absolute left-[29%] top-[73.6%] hidden h-[6.4%] w-[15.1%] md:block"
          />

          <div className="flex min-h-[100svh] max-w-[78vw] flex-col justify-center px-5 pb-24 pt-28 text-[#5A120F] sm:max-w-[30rem] sm:px-8 md:hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
              Luxe&Glow Pujo Edit
            </p>
            <h1 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.98] text-[#6F100E] min-[390px]:text-5xl">
              Celebrate Durga Puja
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#4C342B]">
              Festive sarees inspired by Bengal&apos;s rituals, warm lights, and timeless elegance.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href="/shop?category=Festive"
                className="inline-flex justify-center bg-[#7D1111] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_34px_rgba(125,17,17,0.22)]"
              >
                Shop Pujo
              </Link>
              <Link
                href="/shop"
                className="inline-flex justify-center border border-[#9B6B31] bg-[#FFF8EC]/72 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A3F16]"
              >
                Explore Looks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#D8B26B] bg-[#FFFDF8] text-[#9A731F]">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9B251C]">
            The season begins
          </p>
          <h2 className="mt-3 font-[var(--font-playfair)] text-3xl font-semibold text-[#7D1111] md:text-4xl">
            Tradition, light, and a little modern drama.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6F5A46]">
            Inspired by the first notes of dhaak, shiuli flowers at dawn, temple lamps, and
            the quiet pride of dressing beautifully for family rituals. This Pujo edit keeps
            heritage close while making every look easy to wear.
          </p>
          <span className="mt-8 inline-block h-1 w-1 rounded-full bg-[#B9965B]" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9B251C]">
              Curated for the days
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold text-[#7D1111]">
              Your Pujo wardrobe, day by day
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A5A18] md:inline-flex"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.75fr_0.75fr]">
          {dayEdits.map((item, index) => {
            const imageCard = item.featured;
            const spanClass = index === 0 ? "lg:row-span-2" : "";

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`${spanClass} group relative min-h-[250px] overflow-hidden border border-[#E5D5C4] ${
                  item.red ? "bg-[#990B08] text-white" : "bg-[#E6E0DA] text-[#4A241E]"
                }`}
              >
                {imageCard && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                {imageCard && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D0B08]/78 via-[#1D0B08]/18 to-transparent" />
                )}
                <div
                  className={`relative z-10 flex h-full min-h-[250px] flex-col justify-end p-6 ${
                    imageCard ? "text-white" : ""
                  }`}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] opacity-70">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 font-[var(--font-playfair)] text-2xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-xs leading-6 opacity-[0.82]">{item.copy}</p>
                  <span className="mt-5 inline-flex w-fit items-center gap-2 border-b border-current pb-1 text-[10px] font-semibold uppercase tracking-[0.22em]">
                    Shop look
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[0.75fr_1fr_0.75fr] md:items-center">
        <PujoCountdown />

        <div className="md:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9B251C]">
            Style guide
          </p>
          <h2 className="mt-3 font-[var(--font-playfair)] text-3xl font-semibold text-[#7D1111]">
            What to wear this Pujo
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#6F5A46]">
            Choose lighter sarees for morning anjali, richer silks for Ashtami,
            and deep red or gold accents for Dashami. The edit is built so each
            piece can feel ceremonial without becoming difficult to repeat.
          </p>
          <Link
            href="/shop?category=Festive"
            className="mt-7 inline-flex border-b border-[#8A5A18] pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A5A18]"
          >
            Read the edit
          </Link>
        </div>

        <div className="relative min-h-[320px] overflow-hidden border border-[#E5D5C4]">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FChatGPT%20Image%20Jul%2012%2C%202026%2C%2006_58_50%20PM.png?alt=media&token=cbdba938-64d1-4ca7-9dbc-03a876cd5fe8"
            alt="Festive silk saree detail"
            fill
            sizes="(min-width: 768px) 26vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      </section>

      <section className="bg-[#960A07] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-xl border border-[#B91E18]/60 bg-[#850704] px-8 py-12 shadow-[0_28px_80px_rgba(55,0,0,0.24)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#F0C874]">
            Exclusive drop
          </p>
          <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold">
            Luxe&Glow Pujo Edit 2026
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-white/76">
            A limited festive collection featuring heritage-inspired sarees in pure reds,
            soft golds, ivory tones, and evening-ready textures.
          </p>
          <Link
            href="/shop?category=Festive"
            className="mt-8 inline-flex bg-[#FFE2A1] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7D1111] transition hover:bg-white"
          >
            Reserve your edit
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {trustPoints.map(([title, copy]) => (
            <div key={title} className="border-t border-[#CBB79A] pt-7">
              <h3 className="font-[var(--font-playfair)] text-xl font-semibold text-[#7D1111]">
                {title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-xs leading-6 text-[#6F5A46]">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
