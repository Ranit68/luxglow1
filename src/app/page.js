"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { PujoCountdown } from "@/components/DurgaPujoExperience";
import { db } from "@/lib/firebase";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const dayEdits = [
  {
    title: "Mahalaya Collection",
    eyebrow: "Soft morning whites",
    copy: "Ivory, red borders, and quiet elegance for the first festive note.",
    href: "/shop?category=Festive",
    image:
      "https://firebasestorage.googleapis.com/v0/b/luxxglow.firebasestorage.app/o/ChatGPT%20Image%20Aug%2023%2C%202026%2C%2010_09_25%20AM.png?alt=media&token=b9cb63e6-3831-467c-8817-bed31e086a5f",
    featured: true,
  },
  {
    title: "Shashthi Style",
    eyebrow: "Light arrival looks",
    copy: "Airy organza and gentle drapes for the first pandal evening.",
    href: "/shop?category=Organza",
    image: "https://firebasestorage.googleapis.com/v0/b/luxxglow.firebasestorage.app/o/ChatGPT%20Image%20Aug%2023%2C%202026%2C%2010_12_05%20AM.png?alt=media&token=f326f27a-200d-40c6-abc9-b8e1458cd8ff",
    featured: true,
  },
  {
    title: "Saptami Elegance",
    eyebrow: "Threadwork details",
    copy: "Petal-soft color and delicate zari for family visits.",
    href: "/shop?category=Silk",
    image: "https://firebasestorage.googleapis.com/v0/b/luxxglow.firebasestorage.app/o/ChatGPT%20Image%20Aug%2023%2C%202026%2C%2010_14_50%20AM.png?alt=media&token=bb6a2030-f1ef-4f60-8697-7575f241499c",
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

function formatPrice(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function getProductImage(product) {
  return (
    product.transparentImageUrl ||
    product.pngImageUrl ||
    product.noBgImageUrl ||
    product.cutoutImageUrl ||
    product.imageUrl ||
    product.images?.[0] ||
    ""
  );
}

async function resolveTopCollectionDoc(snapshotDoc) {
  const data = snapshotDoc.data();
  const productId = data.productId || data.productRef || data.id;

  if (productId?.path && !data.name) {
    const productSnap = await getDoc(productId);

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        sortOrder: data.sortOrder ?? data.order ?? 0,
        ...productSnap.data(),
      };
    }
  }

  if (typeof productId === "string" && !data.name) {
    const normalizedProductId = productId.includes("/") ? productId.split("/").pop() : productId;
    const productSnap = await getDoc(doc(db, "products", normalizedProductId));

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        sortOrder: data.sortOrder ?? data.order ?? 0,
        ...productSnap.data(),
      };
    }
  }

  return {
    id: productId || snapshotDoc.id,
    sortOrder: data.sortOrder ?? data.order ?? 0,
    ...data,
  };
}

async function loadTopCollectionProducts() {
  const collectionRefs = [
    collection(db, "top collection"),
    collection(db, "Top Collection"),
    collection(db, "topCollection"),
    collection(db, "topCollections"),
    collection(db, "top_collection"),
    collection(db, "sections", "top collection", "products"),
    collection(db, "sections", "Top Collection", "products"),
    collection(db, "sections", "topCollection", "products"),
    collection(db, "sections", "top_collections", "products"),
    collection(db, "sections", "top collection", "sarees"),
    collection(db, "sections", "Top Collection", "sarees"),
    collection(db, "sections", "topCollection", "sarees"),
  ];

  for (const collectionRef of collectionRefs) {
    let snapshot;

    try {
      snapshot = await getDocs(collectionRef);
    } catch {
      continue;
    }

    if (!snapshot.empty) {
      const products = await Promise.all(snapshot.docs.map(resolveTopCollectionDoc));
      return products
        .filter((product) => product.name && getProductImage(product))
        .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
    }
  }

  let productsSnapshot;

  const fallbackQueries = [
    query(collection(db, "products"), where("section", "==", "top collection"), limit(12)),
    query(collection(db, "products"), where("section", "==", "Top Collection"), limit(12)),
    query(collection(db, "products"), where("topCollection", "==", true), limit(12)),
    query(collection(db, "products"), where("isTopCollection", "==", true), limit(12)),
  ];

  for (const fallbackQuery of fallbackQueries) {
    try {
      productsSnapshot = await getDocs(fallbackQuery);
    } catch {
      continue;
    }

    if (!productsSnapshot.empty) break;
  }

  if (!productsSnapshot || productsSnapshot.empty) return [];

  return productsSnapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((product) => product.name && getProductImage(product));
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topCollectionProducts, setTopCollectionProducts] = useState([]);
  const [topCollectionLoading, setTopCollectionLoading] = useState(true);
  const [activeTopCollectionIndex, setActiveTopCollectionIndex] = useState(0);
  const topCollectionScrollerRef = useRef(null);

  useEffect(() => {
    const hasRazorpayParams =
      searchParams.get("razorpay_payment_id") &&
      searchParams.get("razorpay_order_id") &&
      searchParams.get("razorpay_signature");

    if (hasRazorpayParams) {
      const queryString = window.location.search;
      const targetUrl = `/checkout/status${queryString}`;

      if (window.location.pathname !== "/checkout/status") {
        window.location.replace(targetUrl);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;

    const fetchTopCollection = async () => {
      try {
        const products = await loadTopCollectionProducts();

        if (!ignore) {
          setTopCollectionProducts(products);
        }
      } catch {
        if (!ignore) {
          setTopCollectionProducts([]);
        }
      } finally {
        if (!ignore) {
          setTopCollectionLoading(false);
        }
      }
    };

    fetchTopCollection();

    return () => {
      ignore = true;
    };
  }, []);

  const updateTopCollectionCenter = (container) => {
    const items = Array.from(container.querySelectorAll("[data-top-product-index]"));
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = Number(item.dataset.topProductIndex || 0);
      }
    });

    setActiveTopCollectionIndex((currentIndex) =>
      currentIndex === closestIndex ? currentIndex : closestIndex
    );
  };

  const scrollTopCollection = (direction) => {
    const container = topCollectionScrollerRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * Math.min(container.clientWidth * 0.78, 420),
      behavior: "smooth",
    });
  };

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

      <section className="overflow-hidden px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9B251C]">
                Top collection
              </p>
              <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold text-[#7D1111]">
                Customer-loved sarees
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-2 border-b border-[#8A5A18] pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A5A18]"
            >
              Shop all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {topCollectionLoading && (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-[22rem] w-[16rem] shrink-0 animate-pulse rounded-[1.25rem] bg-[#E9DCCD]"
                />
              ))}
            </div>
          )}

          {!topCollectionLoading && topCollectionProducts.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => scrollTopCollection(-1)}
                className="absolute left-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2D2C1] bg-white/90 text-[#7D1111] shadow-[0_12px_28px_rgba(62,25,18,0.16)] backdrop-blur transition hover:bg-white sm:h-11 sm:w-11 lg:-left-5"
                aria-label="Scroll top collection left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={topCollectionScrollerRef}
                onScroll={(event) => updateTopCollectionCenter(event.currentTarget)}
                className="-mx-4 overflow-x-auto scroll-smooth px-12 pb-6 sm:-mx-6 sm:px-16 lg:mx-0 lg:px-12"
              >
                <div className="flex w-max snap-x snap-mandatory items-end gap-5 sm:gap-6">
                  {topCollectionProducts.map((product, index) => {
                    const featured = activeTopCollectionIndex === index;
                    const image = getProductImage(product);

                    return (
                      <Link
                        key={product.id}
                        data-top-product-index={index}
                        href={`/shop/${product.id}`}
                        className="group relative flex w-[16.5rem] shrink-0 snap-center flex-col items-center text-center transition duration-300 sm:w-[18.5rem] lg:w-[19.5rem]"
                      >
                        <div
                          className={`relative w-full overflow-visible transition-all duration-300 ${
                            featured
                              ? "h-[22rem] sm:h-[25rem] lg:h-[27rem]"
                              : "h-[20.75rem] sm:h-[23.75rem] lg:h-[25.75rem]"
                          }`}
                        >
                          <div className="absolute inset-x-4 bottom-5 h-14 rounded-full bg-[#2D1712]/18 blur-2xl" />
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 19.5rem, 18.5rem"
                            className={`object-contain drop-shadow-[0_22px_32px_rgba(45,23,18,0.24)] transition duration-500 group-hover:-translate-y-1 ${
                              featured ? "scale-[1.035]" : "scale-100"
                            }`}
                          />
                        </div>

                        <div className="-mt-3 w-full rounded-[1.25rem] border border-[#E2D2C1] bg-white/78 px-4 py-4 shadow-[0_18px_45px_rgba(62,25,18,0.08)] backdrop-blur">
                          <p className="line-clamp-2 min-h-[2.75rem] font-[var(--font-playfair)] text-xl font-semibold leading-tight text-[#3A1712]">
                            {product.name}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#7D1111]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollTopCollection(1)}
                className="absolute right-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2D2C1] bg-white/90 text-[#7D1111] shadow-[0_12px_28px_rgba(62,25,18,0.16)] backdrop-blur transition hover:bg-white sm:h-11 sm:w-11 lg:-right-5"
                aria-label="Scroll top collection right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
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
