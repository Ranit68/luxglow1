"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Search, ShoppingBag } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, onSnapshot, query } from "firebase/firestore";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import AuthPromptModal from "@/components/AuthPromptModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { auth, db } from "@/lib/firebase";
import { getAvailableStock, isOutOfStock } from "@/lib/productStock";
import { siteConfig } from "@/lib/seo";

const categories = ["All", "Silk", "Cotton", "Wedding", "Festive", "Daily Wear", "Party Wear"];
const occasions = ["Wedding", "Festive", "Corporate", "Casual"];
const fabrics = [
  "Silk",
  "Mashru",
  "Banarasi",
  "Cotton",
  "Organza",
  "Tissue",
  "Georgette",
  "Linen",
];
const MIN_PRICE = 700;
const MAX_PRICE = 150000;

const categoryContent = {
  default: {
    title: "The Heritage Series",
    eyebrow: "Premium sarees online in India",
    description:
      "Discover a curated collection of Bengal's finest weaves, from the ethereal transparency of Jamdani to the regal drape of pure silk. Shop premium silk, cotton, mashru, banarasi and party wear sarees online at Luxe&Glow.",
  },
  All: {
    title: "The Heritage Series",
    eyebrow: "Premium sarees online in India",
    description:
      "Discover a curated collection of Bengal's finest weaves, from the ethereal transparency of Jamdani to the regal drape of pure silk. Shop premium silk, cotton, mashru, banarasi and party wear sarees online at Luxe&Glow.",
  },
  Silk: {
    title: "Silk Sarees Online",
    eyebrow: "Buy pure & soft silk sarees India",
    description:
      "Shop silk sarees online at Luxe&Glow — pure soft silk, mashru silk, banarasi and designer silk weaves with rich zari borders. Handpicked for weddings, festivals and festive dressing across India.",
  },
  Cotton: {
    title: "Cotton Sarees Online",
    eyebrow: "Buy handloom & cotton sarees India",
    description:
      "Shop cotton sarees online at Luxe&Glow — breathable handloom and soft cotton weaves for daily wear, office and casual occasions. Comfortable drapes made for the Indian climate.",
  },
  Wedding: {
    title: "Bridal & Wedding Sarees Online",
    eyebrow: "Buy bridal sarees India",
    description:
      "Shop bridal and wedding sarees online at Luxe&Glow — rich reds, golds and heritage weaves for brides, bridesmaids and wedding guests. Make your big day unforgettable.",
  },
  Festive: {
    title: "Festive & Pujo Sarees Online",
    eyebrow: "Buy festive sarees India",
    description:
      "Shop festive and Durga Puja sarees online at Luxe&Glow — ivory, red and gold picks for anjali, ashtami and festive celebrations. Tradition, light, and a little modern drama.",
  },
  "Daily Wear": {
    title: "Daily Wear Sarees Online",
    eyebrow: "Buy everyday sarees India",
    description:
      "Shop daily wear sarees online at Luxe&Glow — comfortable, easy-care drapes for work, college and everyday elegance across India.",
  },
  "Party Wear": {
    title: "Party Wear Sarees Online",
    eyebrow: "Buy party & evening sarees India",
    description:
      "Shop party wear sarees online at Luxe&Glow — sequins, embroidered and contemporary weaves for evening events, receptions and celebrations.",
  },
};

function getCategoryInfo(category) {
  return categoryContent[category] || categoryContent.default;
}

// Price-bracket landing views (via /shop?price=...) — high-intent, low-competition
// keyword targets straight from the SEO strategy (Section 4).
const priceViews = {
  "under-1000": {
    eyebrow: "Sarees under ₹1000",
    title: "Sarees Under ₹1000 Online",
    description:
      "Shop affordable sarees under ₹1000 at Luxe&Glow — lightweight cotton and easy-care weaves you can wear every day without breaking the bank. Budget-friendly elegance for work, college and casual outings, with free shipping across India.",
    min: 0,
    max: 1000,
  },
  "under-1500": {
    eyebrow: "Sarees under ₹1500",
    title: "Sarees Under ₹1500 Online",
    description:
      "Discover sarees under ₹1500 at Luxe&Glow — printed cottons, cotton silks and casual drapes that balance comfort with a considered look. Affordable daily and office wear with cash on delivery available.",
    min: 0,
    max: 1500,
  },
  "under-2000": {
    eyebrow: "Sarees under ₹2000",
    title: "Sarees Under ₹2000 Online",
    description:
      "Browse sarees under ₹2000 at Luxe&Glow — party-wear cifffon and organza, printed silks and festive picks with rich borders. Style-forward dresses at an accessible price, delivered free across India.",
    min: 0,
    max: 2000,
  },
  "under-3000": {
    eyebrow: "Sarees under ₹3000",
    title: "Sarees Under ₹3000 Online",
    description:
      "Shop sarees under ₹3000 at Luxe&Glow — soft silk, mashru, organza and designer weaves with a premium drape for weddings, engagements and festive events. High-impact dressing on a sensible budget.",
    min: 0,
    max: 3000,
  },
  "under-5000": {
    eyebrow: "Sarees under ₹5000",
    title: "Sarees Under ₹5000 Online",
    description:
      "Discover premium sarees under ₹5000 at Luxe&Glow — pure silk, banarasi and luxurious party-wear weaves for the bride and wedding guest. Rich fabric, hand-finished borders and lasting quality, delivered free across India.",
    min: 0,
    max: 5000,
  },
  "between-1000-2000": {
    eyebrow: "Sarees ₹1000 – ₹2000",
    title: "Sarees Between ₹1000 and ₹2000",
    description:
      "Find sarees priced between ₹1000 and ₹2000 at Luxe&Glow — the sweet spot for quality everyday and festive cotton, chiffon and organza weaves. Reasonable prices with free shipping on every order.",
    min: 1000,
    max: 2000,
  },
  "between-2000-5000": {
    eyebrow: "Sarees ₹2000 – ₹5000",
    title: "Sarees Between ₹2000 and ₹5000",
    description:
      "Shop sarees between ₹2000 and ₹5000 at Luxe&Glow — silk, banarasi and designer festive weaves for weddings and grand celebrations. Premium fabric and detailing at a value-conscious price point.",
    min: 2000,
    max: 5000,
  },
};

// Festival landing views (via /shop?collection=...) — unique, indexable pages
// planned 3–4 weeks ahead of each festival (SEO strategy Section 5).
const collectionViews = {
  "ganesh-chaturthi": {
    eyebrow: "Ganpati Special Collection",
    title: "Ganpati Special Saree Collection 2026",
    description:
      "Dress for Ganesh Chaturthi with our Ganpati Special saree collection. From the elegant drape of a silk saree to festive cottons perfect for aarti and family gatherings, find tradition-minded weaves that honour the occasion and keep you comfortable through the celebration.",
    category: "Festive",
  },
  "durga-puja": {
    eyebrow: "Durga Puja Special Collection",
    title: "Durga Puja Saree Collection 2026",
    description:
      "Our Durga Puja saree collection brings the season's most-loved weaves — red-and-white tangails and garads, tant and jamdani, tussar and baluchari — for anjali, ashtami and sindoor khela. Shop festive sarees online that pair heritage with a modern drape, delivered free across India.",
    category: "Festive",
  },
  diwali: {
    eyebrow: "Diwali Special Collection",
    title: "Diwali Saree Collection 2026",
    description:
      "Light up Diwali with our festive saree collection — banarasi silks, organza with zardozi, sequin party weaves and soft cottons for Lakshmi puja and family dinners. Handpicked sarees to wear on the day you celebrate, and to gift to the women you love, delivered free across India.",
    category: "Festive",
  },
};

function formatPrice(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function getProductCategories(product) {
  const values = [];

  if (Array.isArray(product.categories)) {
    values.push(...product.categories);
  } else if (product.categories) {
    values.push(...String(product.categories).split(","));
  }

  if (Array.isArray(product.category)) {
    values.push(...product.category);
  } else if (product.category) {
    values.push(...String(product.category).split(","));
  }

  return values.map(normalizeCategory).filter(Boolean);
}

function matchesCategory(product, selectedCategory) {
  const selected = normalizeCategory(selectedCategory);
  return getProductCategories(product).some(
    (item) => item === selected || item.includes(selected) || selected.includes(item)
  );
}

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function getProductValues(product, keys) {
  const values = [];
  keys.forEach((key) => {
    const val = product?.[key];
    if (Array.isArray(val)) {
      values.push(...val);
    } else if (val !== undefined && val !== null && val !== "") {
      values.push(...String(val).split(","));
    }
  });
  return values.map(normalizeValue).filter(Boolean);
}

function matchesFilter(product, key, selected) {
  if (!selected) return true;
  if (Array.isArray(selected)) {
    if (selected.length === 0) return true;
    return getProductValues(product, key).some((v) =>
      selected.some((s) => v.includes(normalizeValue(s)) || normalizeValue(s).includes(v))
    );
  }
  const selectedNorm = normalizeValue(selected);
  return getProductValues(product, key).some(
    (v) => v.includes(selectedNorm) || selectedNorm.includes(v)
  );
}

export default function ShopPage() {
  const PRODUCTS_PER_PAGE = 12;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isSaved, toggleSavedProduct } = useSavedProducts();
  const pageParam = Number(searchParams.get("page")) || 1;
  const categoryParam = searchParams.get("category");
  const category = categoryParam || "All";
  const priceParam = searchParams.get("price");
  const collectionParam = searchParams.get("collection");

  const priceView = priceViews[priceParam];
  const collectionView = collectionViews[collectionParam];
  const activeCategoryInfo = priceView || collectionView || getCategoryInfo(category);
  const effectiveCategory = collectionView?.category || category;
  const effectiveMin = priceView?.min ?? 0;
  const effectiveMax = priceView?.max ?? MAX_PRICE;

  const landingLabel =
    priceView?.title ||
    collectionView?.title ||
    (category !== "All" ? category : "");
  const landingHref = priceParam
    ? `/shop?price=${encodeURIComponent(priceParam)}`
    : collectionParam
      ? `/shop?collection=${encodeURIComponent(collectionParam)}`
      : (category !== "All" ? `/shop?category=${encodeURIComponent(category)}` : "");

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(effectiveMax);
  const [minPrice, setMinPrice] = useState(effectiveMin);
  const [sort, setSort] = useState("latest");
  const [fabric, setFabric] = useState("");
  const [occasion, setOccasion] = useState("");
  const [blouseIncluded, setBlouseIncluded] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const [authPrompt, setAuthPrompt] = useState(null);

  useEffect(() => {
    const baseTitle = activeCategoryInfo.title;
    const suffix = " | Luxe&Glow";
    const prevTitle = document.title;
    document.title = baseTitle === "The Heritage Series" ? `${baseTitle}${suffix}` : `${baseTitle}${suffix}`;
    return () => {
      document.title = prevTitle;
    };
  }, [activeCategoryInfo.title]);

  useEffect(() => {
    let ignore = false;

    const unsubscribe = onSnapshot(query(collection(db, "products")), (snapshot) => {
      if (ignore) {
        return;
      }

      setLoading(true);
      let data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      if (effectiveCategory !== "All") {
        data = data.filter((product) => matchesCategory(product, effectiveCategory));
      }

      if (sort === "latest") {
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      }

      if (sort === "low") {
        data.sort((a, b) => a.price - b.price);
      }

      if (sort === "high") {
        data.sort((a, b) => b.price - a.price);
      }

      if (sort === "name") {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (search) {
        data = data.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (fabric) {
        data = data.filter((product) =>
          matchesFilter(product, ["fabric", "material", "type"], fabric)
        );
      }

      if (occasion) {
        data = data.filter((product) =>
          matchesFilter(product, ["occasion", "occasions", "category", "categories"], occasion)
        );
      }

      if (blouseIncluded) {
        data = data.filter((product) => {
          const blouse = product.blouse || product.blouseIncluded;
          const blouseNorm = normalizeValue(blouse);
          return blouseNorm === "included" || blouseNorm === "yes" || blouse === true;
        });
      }

      data = data.filter((product) => {
        const price = Number(product.price || 0);
        return price <= maxPrice && price >= minPrice;
      });

      const start = (pageParam - 1) * PRODUCTS_PER_PAGE;
      const paginated = data.slice(start, start + PRODUCTS_PER_PAGE);

      if (ignore) {
        return;
      }

      setVisibleProducts(paginated);
      setTotalMatches(data.length);
      setHasNextPage(start + PRODUCTS_PER_PAGE < data.length);
      setLoading(false);
    }, () => {
      if (!ignore) {
        setVisibleProducts([]);
        setTotalMatches(0);
        setHasNextPage(false);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, [PRODUCTS_PER_PAGE, blouseIncluded, effectiveCategory, fabric, maxPrice, minPrice, occasion, pageParam, search, sort]);

  const pageNumbers = useMemo(() => {
    const maxPage = Math.max(1, Math.ceil(totalMatches / PRODUCTS_PER_PAGE));
    return Array.from({ length: Math.min(maxPage, 4) }, (_, index) => index + 1);
  }, [PRODUCTS_PER_PAGE, totalMatches]);

  const updateCategory = (nextCategory) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");
    params.delete("price");
    params.delete("collection");
    if (nextCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
    }

    router.push(`/shop?${params.toString()}`);
  };

  const goPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/shop?${params.toString()}`);
  };
  const goNext = () => goPage(pageParam + 1);
  const goPrev = () => goPage(pageParam - 1);

  const handleSaveClick = async (product) => {
    const activeUser = user || auth.currentUser;

    if (!activeUser) {
      setAuthPrompt({
        action: "save",
        redirect: `/shop/${product.id}`,
        title: "Login to save products",
        description:
          "Create an account to keep your favorite sarees in one place before checkout.",
      });
      return;
    }

    try {
      await toggleSavedProduct(product);
    } catch {
      setAuthPrompt({
        action: "save",
        redirect: `/shop/${product.id}`,
        title: "Could not update wishlist",
        description: "Please try again. Your wishlist update did not complete.",
      });
    }
  };

  const handleAddToCart = (product) => {
    if (isOutOfStock(product)) {
      return;
    }

    const activeUser = user || auth.currentUser;

    if (!activeUser) {
      setAuthPrompt({
        action: "cart",
        redirect: `/shop/${product.id}`,
        title: "Login to add products to cart",
        description: "Sign in to place your favorite sarees in your cart.",
      });
      return;
    }

    addToCart({ id: product.id, ...product });
  };

  return (
    <main className="min-h-screen bg-[#F7F3EE] pt-24 text-[#2D1712]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
              {
                "@type": "ListItem",
                position: 2,
                name: "Shop",
                item: `${siteConfig.url}/shop`,
              },
              ...(landingHref
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: landingLabel,
                      item: `${siteConfig.url}${landingHref}`,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: landingLabel ? landingLabel : "Sarees Collection",
            numberOfItems: visibleProducts.length,
            itemListElement: visibleProducts.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: product.name,
              url: `${siteConfig.url}/shop/${product.id}`,
              image: product.imageUrl || product.images?.[0] || undefined,
            })),
          }),
        }}
      />
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-9 text-[10px] uppercase tracking-[0.24em] text-[#7D6B5D]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-[#7D1111]">Home</Link>
            </li>
            <li aria-hidden="true" className="px-1 text-[#B6A89A]">/</li>
            <li aria-current="page">Collections</li>
            {landingHref && (
              <>
                <li aria-hidden="true" className="px-1 text-[#B6A89A]">/</li>
                <li aria-current="page" className="text-[#7D1111]">{landingLabel}</li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex flex-col gap-6 border-b border-[#D8CABB] pb-8 sm:gap-8 sm:pb-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
              {activeCategoryInfo.eyebrow}
            </p>
            <h1 className="mt-3 font-[var(--font-editorial)] text-4xl font-semibold leading-tight text-[#24110D] md:text-5xl">
              {activeCategoryInfo.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#5F5148]">
              {activeCategoryInfo.description}
            </p>
          </div>

          <label className="relative block w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E7A69]" />
            <input
              placeholder="Search sarees"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border border-[#D8CABB] bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9A8A7B] focus:border-[#7D1111]"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5F5148]">
            Featured:
          </span>
          {[
            { href: "/shop?collection=ganesh-chaturthi", label: "Ganpati Special" },
            { href: "/shop?collection=durga-puja", label: "Durga Puja" },
            { href: "/shop?collection=diwali", label: "Diwali" },
            { href: "/shop?price=under-1000", label: "Under ₹1000" },
            { href: "/shop?price=under-2000", label: "Under ₹2000" },
            { href: "/shop?price=under-3000", label: "Under ₹3000" },
            { href: "/shop?price=under-5000", label: "Under ₹5000" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-medium transition ${
                landingHref === item.href
                  ? "border-[#7D1111] bg-[#7D1111] text-white"
                  : "border-[#D8CABB] bg-white text-[#5F5148] hover:border-[#7D1111] hover:text-[#7D1111]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 sm:pb-24 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Filters: show on top (full width) for small screens, as a left sidebar on large screens */}
        <aside className="order-1 w-full rounded-[1.5rem] border border-[#D8CABB] bg-white/80 p-5 text-xs shadow-sm mb-6 lg:mb-0 lg:order-1 lg:w-auto lg:sticky lg:top-24 lg:h-fit lg:space-y-8">
          <div className="flex items-center justify-between border-b border-[#D8CABB] pb-3">
            <p className="font-semibold uppercase tracking-[0.22em] text-[#24110D]">Filter by</p>
            <button
              type="button"
              onClick={() => {
                updateCategory("All");
                setSearch("");
                setMaxPrice(MAX_PRICE);
                setMinPrice(0);
                setFabric("");
                setOccasion("");
                setBlouseIncluded(false);
              }}
              className="text-[#8A5A18] transition hover:text-[#7D1111]"
            >
              Clear
            </button>
          </div>

          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#24110D]">Category</p>
            <div className="space-y-3">
              {categories.map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-3 text-[#5F5148]">
                  <input
                    type="radio"
                    name="category"
                    checked={category === item}
                    onChange={() => updateCategory(item)}
                    className="h-3.5 w-3.5 accent-[#7D1111]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-[#D8CABB] pt-6">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#24110D]">Fabric</p>
            <div className="flex flex-wrap gap-2">
              {fabrics.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFabric(fabric === item ? "" : item)}
                  className={`rounded-full border px-3 py-1 text-[10px] transition ${
                    fabric === item
                      ? "border-[#7D1111] bg-[#7D1111] text-white"
                      : "border-[#CDBCA9] text-[#5F5148] hover:border-[#7D1111] hover:text-[#7D1111]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#D8CABB] pt-6">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#24110D]">Occasion</p>
            <div className="flex flex-wrap gap-2">
              {occasions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setOccasion(occasion === item ? "" : item)}
                  className={`rounded-full border px-3 py-1 text-[10px] transition ${
                    occasion === item
                      ? "border-[#7D1111] bg-[#7D1111] text-white"
                      : "border-[#CDBCA9] text-[#5F5148] hover:border-[#7D1111] hover:text-[#7D1111]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#D8CABB] pt-6">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span className="font-semibold uppercase tracking-[0.2em] text-[#24110D]">
                Blouse included
              </span>
              <input
                type="checkbox"
                checked={blouseIncluded}
                onChange={(event) => setBlouseIncluded(event.target.checked)}
                className="h-4 w-4 accent-[#7D1111]"
              />
            </label>
          </div>

          <div className="border-t border-[#D8CABB] pt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-semibold uppercase tracking-[0.2em] text-[#24110D]">Price range</p>
              <span className="text-[10px] text-[#7D1111]">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step="1000"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="w-full accent-[#7D1111]"
              aria-label="Maximum price"
            />
            <div className="mt-4 flex justify-between text-[10px] text-[#6F6258]">
              <span>{formatPrice(MIN_PRICE)}</span>
              <span>{formatPrice(MAX_PRICE)}+</span>
            </div>
          </div>
        </aside>

        <div className="order-2">
          <div className="mb-7 flex flex-col gap-4 text-xs text-[#6F6258] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing <span className="text-[#24110D]">{visibleProducts.length}</span> of{" "}
              <span className="text-[#24110D]">{totalMatches}</span> items
            </p>

            <label className="flex items-center gap-3">
              <span>Sort by:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="bg-transparent font-semibold text-[#24110D] outline-none"
              >
                <option value="latest">Newest Arrival</option>
                <option value="low">Price Low to High</option>
                <option value="high">Price High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </label>
          </div>

          {loading && (
            <div className="grid grid-cols-2 gap-x-7 gap-y-11 md:grid-cols-3">
              {[...Array(9)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && visibleProducts.length === 0 && (
            <div className="border border-[#D8CABB] px-8 py-16 text-center">
                <h2 className="font-[var(--font-editorial)] text-3xl text-[#7D1111]">
                No sarees found
              </h2>
              <p className="mt-3 text-sm text-[#6F6258]">
                Try another category or search term.
              </p>
            </div>
          )}

          {!loading && visibleProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => {
                const saved = isSaved(product.id);
                const soldOut = isOutOfStock(product);
                const availableStock = getAvailableStock(product);

                return (
                  <article
                    key={product.id}
                    className="group rounded-[1.5rem] border border-[#E7DDD1] bg-white p-3 shadow-[0_12px_34px_rgba(61,24,16,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(61,24,16,0.16)] flex flex-col"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.15rem] bg-[#E8DED3]">
                      <Link href={`/shop/${product.id}`} className="absolute inset-0 z-10">
                        <span className="sr-only">View {product.name}</span>
                      </Link>

                      <Image
                        src={product.imageUrl}
                        alt={`${product.name}${product.fabric ? ` — ${product.fabric} saree` : ""}${product.color ? ` in ${product.color}` : ""}, buy online at Luxe&Glow`}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className={`object-cover transition duration-700 group-hover:scale-105 ${
                          soldOut ? "grayscale" : ""
                        }`}
                      />

                      {soldOut && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1D0B08]/50">
                          <span className="rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7D1111]">
                            Out of stock
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3">
                        <span className="rounded-full bg-white/85 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.24em] text-[#7D1111]">
                          {soldOut
                            ? "Sold out"
                            : availableStock !== null
                              ? `${availableStock} left`
                              : "New edit"}
                        </span>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveClick(product)}
                            className="rounded-full bg-white/85 p-2 text-[#7D1111] transition hover:bg-white"
                            aria-label={`${saved ? "Remove" : "Save"} ${product.name} wishlist`}
                          >
                            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={soldOut}
                            className="rounded-full bg-[#7D1111] p-2 text-white transition hover:bg-[#5A0F1C] disabled:cursor-not-allowed disabled:bg-[#9B8C83]"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <Link href={`/shop/${product.id}`} className="block pt-4 text-left flex-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8A7667]">
                        {product.fabric || "Luxe&Glow"}
                      </p>
                      <h2 className="mt-1 line-clamp-2 font-[var(--font-editorial)] text-lg font-semibold leading-tight text-[#24110D]">
                        {product.name}
                      </h2>
                      <p className="mt-2 text-sm text-[#7D1111]">{formatPrice(product.price)}</p>
                    </Link>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={soldOut}
                        className="rounded-md bg-[#7D1111] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5A0F1C] disabled:cursor-not-allowed disabled:bg-[#9B8C83]"
                      >
                        {soldOut ? "Out of stock" : "Add to cart"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveClick(product)}
                        className="text-sm text-[#7D1111] underline"
                      >
                        Save
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && totalMatches > 0 && (
            <div className="mt-16 flex flex-col items-center gap-5">
              <div className="flex items-center gap-3">
                <button
                  disabled={pageParam === 1}
                  onClick={goPrev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CABB] text-[#24110D] transition hover:border-[#7D1111] disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => goPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs transition ${
                      pageParam === page
                        ? "bg-[#8A5A18] text-white"
                        : "border border-[#D8CABB] text-[#24110D] hover:border-[#7D1111]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {hasNextPage && <span className="text-xs text-[#8A7667]">...</span>}

                <button
                  disabled={!hasNextPage}
                  onClick={goNext}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8CABB] text-[#24110D] transition hover:border-[#7D1111] disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <Link
                href="/shop?page=1"
                className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A5A18]"
              >
                Explore more
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How long does saree delivery take in India?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We dispatch within 1-2 business days. Metro orders typically arrive in 2-4 days and rest-of-India in 4-7 days, with a tracking link shared on dispatch.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I return or exchange a saree?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Unworn sarees in original packaging can be returned or exchanged within 7 days of delivery for a full refund or size exchange.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is the blouse included with the saree?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Many of our sarees come with a blouse piece included. You can filter by 'Blouse included' to see which styles ship with fabric for stitching.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How should I care for my silk saree?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Dry-clean silk and zari sarees, store them flat in a cotton or muslin wrap, and keep them away from direct sunlight and moisture to preserve colour and sheen.",
                  },
                },
              ],
            }),
          }}
        />
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
            Good to know
          </p>
          <h2 className="mt-3 font-[var(--font-editorial)] text-4xl font-semibold text-[#24110D]">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-4">
          {[
            {
              q: "How long does saree delivery take in India?",
              a: "We dispatch within 1-2 business days. Metro orders typically arrive in 2-4 days and rest-of-India in 4-7 days, with a tracking link shared the moment your order ships.",
            },
            {
              q: "Can I return or exchange a saree?",
              a: "Yes. Unworn sarees in their original packaging can be returned or exchanged within 7 days of delivery for a full refund or size exchange. See our Refund Policy for details.",
            },
            {
              q: "Is the blouse included with the saree?",
              a: "Many of our sarees ship with a blouse piece for stitching. Use the 'Blouse included' filter in the sidebar to see which styles include it.",
            },
            {
              q: "How should I care for my silk saree?",
              a: "Dry-clean silk and zari sarees, store them flat in a cotton or muslin wrap, and keep them away from direct sunlight and moisture to preserve colour and sheen.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-[#D8CABB] bg-white px-6 py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#24110D]">
                {item.q}
                <span className="text-[#8A5A18] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#5F5148]">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[#6F6258]">
          Have another question?{" "}
          <Link href="/contact" className="font-semibold text-[#7D1111] underline">
            Contact our team
          </Link>
        </p>
      </section>

      <section className="bg-[#F0EAE2] px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
            Our heritage
          </p>
          <h2 className="mt-4 font-[var(--font-editorial)] text-4xl font-semibold text-[#24110D]">
              The Art of the Silent Loom
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-sm italic leading-8 text-[#5F5148]">
            Every thread is a whisper of history, every weave a testament to craft.
            Our sarees carry the quiet grace of Indian artistry into wardrobes made for today.
          </p>
          <Link
            href="/about"
            className="mt-12 inline-flex text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A5A18]"
          >
            Read the artisan stories
          </Link>
        </div>
      </section>

      <AuthPromptModal
        action={authPrompt?.action}
        open={Boolean(authPrompt)}
        onClose={() => setAuthPrompt(null)}
        redirect={authPrompt?.redirect}
        title={authPrompt?.title}
        description={authPrompt?.description}
      />
    </main>
  );
}
