"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PujoCountdown } from "@/components/DurgaPujoExperience";
import { absoluteUrl, siteConfig } from "@/lib/seo";

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
  },
  {
    title: "Saptami Elegance",
    eyebrow: "Threadwork details",
    copy: "Petal-soft color and delicate zari for family visits.",
    href: "/shop?category=Silk",
    image: "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FChatGPT%20Image%20Jul%2012%2C%202026%2C%2008_53_19%20PM.png?alt=media&token=faeb9ae7-c4d4-4c8d-b988-abbbf00be08a",
  },
  {
    title: "Ashtami Royal",
    eyebrow: "Anjali ready",
    copy: "Rich reds and golds made for the most photographed morning.",
    href: "/shop?category=Wedding",
    image:
      "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2Fregal_woman_in_a_heavy_silk_saree_for_ashtami_evening_opulent_traditional.png?alt=media&token=cde9e4e3-0164-45ee-940a-1dc52fe37803",
  },
  {
    title: "Navami Celebration",
    eyebrow: "Evening glow",
    copy: "Bold contemporary weaves for the last grand night out.",
    href: "/shop?category=Party",
    image: "https://firebasestorage.googleapis.com/v0/b/chatbot-8cc45.firebasestorage.app/o/luxeglow%2FUntitled%20design(5).png?alt=media&token=8bbade9e-f846-4d10-bd78-f60ae6854b5d",
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

export default function HomeClient() {
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
              Festive sarees inspired by Bengal's rituals, warm lights, and timeless elegance.
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
            const spanClass = item.red
              ? "border border-rose-200 bg-rose-50 text-[#5D131F]"
              : "border border-[#E5D5C4] bg-white text-[#3A1513]";

            return (
              <Link
                key={index}
                href={item.href}
                className={`group relative min-h-[250px] overflow-hidden border border-[#E5D5C4] ${spanClass} rounded-[1.75rem] px-6 py-6 text-left transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D0B08]/78 via-[#1D0B08]/18 to-transparent" />
                <div className="relative z-10 flex h-full min-h-[250px] flex-col justify-end p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A3E30]">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 font-[var(--font-playfair)] text-2xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5C4039]">{item.copy}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#E7D4BB] px-6 pb-24 pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {trustPoints.map(([title, description], index) => (
              <div key={index} className="rounded-[2rem] border border-[#E5D5C4] bg-white p-10 text-left shadow-[0_18px_42px_rgba(62,25,18,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8F381E]">{title}</p>
                <p className="mt-4 text-sm leading-7 text-[#5B4038]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
