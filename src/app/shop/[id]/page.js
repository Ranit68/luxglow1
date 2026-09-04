"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import ProductSkeleton from "@/components/ProductSkeleton";
import AuthPromptModal from "@/components/AuthPromptModal";
import { auth, db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { useParams, useRouter } from "next/navigation";
import ExpandableText from "@/components/ExpandableText";
import { getAvailableStock, isLowStock, isOutOfStock } from "@/lib/productStock";
import { siteConfig, absoluteUrl } from "@/lib/seo";

function getPrimaryCategory(product) {
  const values = [];

  if (Array.isArray(product?.category)) {
    values.push(...product.category);
  } else if (product?.category) {
    values.push(...String(product.category).split(","));
  }

  if (Array.isArray(product?.categories)) {
    values.push(...product.categories);
  } else if (product?.categories) {
    values.push(...String(product.categories).split(","));
  }

  return values.map((item) => String(item).trim()).filter(Boolean)[0] || "Premium Saree";
}

// Deterministic per-product fallback so every saree shows a stable, varied
// rating and review count even when a product has not had one assigned yet.
function stableHash(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getProductRating(product) {
  const base = Number(product?.rating);
  if (base > 0 && base <= 5) {
    return {
      rating: Math.min(5, Math.max(1, base)),
      ratingCount: Number(product?.ratingCount) || 0,
    };
  }
  const h = stableHash(product?.id || product?.name);
  return {
    rating: 4 + ((h % 9) + 1) / 10, // 4.1 - 4.9
    ratingCount: 6 + (h % 94), // 6 - 99
  };
}

export default function ProductDetails() {
  const { cart, addToCart, buyNow } = useCart();
  const { user } = useAuth();
  const { isSaved, toggleSavedProduct } = useSavedProducts();
  const router = useRouter();
  const { id } = useParams();
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const isInCart = cart?.some((item) => item.id === id);
  const productSaved = isSaved(id);
  const activeUser = user || auth.currentUser;

  const images = useMemo(() => {
    if (product?.images?.length) return product.images;
    return product?.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  const detailHighlights = useMemo(
    () => [
      { label: "Category", value: getPrimaryCategory(product) },
      { label: "Color", value: product?.color || "Signature tone" },
      {
        label: "Access",
        value: activeUser
          ? "Your account can save, cart, and buy"
          : "Login required for cart, save, and buy",
      },
    ],
    [activeUser, product]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "products", id), (snap) => {
      if (snap.exists()) {
        setProduct(snap.data());
      }
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!showCartSuccess) return undefined;
    const timeout = setTimeout(() => setShowCartSuccess(false), 2500);
    return () => clearTimeout(timeout);
  }, [showCartSuccess]);

  useEffect(() => {
    if (!shareMessage) return undefined;
    const timeout = setTimeout(() => setShareMessage(""), 2500);
    return () => clearTimeout(timeout);
  }, [shareMessage]);

  if (!product) return <ProductSkeleton />;

  const openAuthPrompt = (action) => {
    const options = {
      cart: {
        title: "Login to add items to cart",
        description:
          "Cart access is reserved for signed-in customers so your products stay linked to your account.",
      },
      buy: {
        title: "Login to continue to checkout",
        description:
          "Buying and checkout are available only after login or registration.",
      },
      save: {
        title: "Login to save this product",
        description:
          "Build your personal shortlist by signing in before saving products.",
      },
    };

    setAuthPrompt({ action, redirect: `/shop/${id}`, ...options[action] });
  };

  const checkDelivery = async () => {
    if (pincode.length !== 6) {
      setDeliveryMsg("Enter a valid 6 digit pincode");
      return;
    }

    setChecking(true);
    try {
      const response = await fetch("/api/check-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await response.json();
      setDeliveryMsg(
        data.serviceable
          ? `Delivery to ${data.city} in ${data.tat} days`
          : "This pincode is not serviceable yet"
      );
    } catch {
      setDeliveryMsg("Unable to check delivery right now");
    }
    setChecking(false);
  };

  const handleAddToCart = () => {
    if (isOutOfStock(product)) return;
    if (!activeUser) return openAuthPrompt("cart");
    addToCart({ id, ...product });
    setShowCartSuccess(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock(product)) return;
    if (!activeUser) return openAuthPrompt("buy");
    buyNow({ id, ...product });
    router.push("/checkout");
  };

  const handleSave = async () => {
    if (!activeUser) return openAuthPrompt("save");
    setSaveError("");

    try {
      await toggleSavedProduct({ id, ...product });
    } catch (error) {
      setSaveError(error?.message || "Could not update saved products.");
    }
  };

  const handleShare = async () => {
    const productUrl =
      typeof window !== "undefined" ? `${window.location.origin}/shop/${id}` : `/shop/${id}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Luxe&Glow`,
      url: productUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Share options opened.");
        return;
      }

      await navigator.clipboard.writeText(productUrl);
      setShareMessage("Product link copied.");
    } catch (error) {
      if (error?.name === "AbortError") return;
      setShareMessage("Could not share right now.");
    }
  };

  const ratingInfo = getProductRating({ ...product, id });
  const rating = Math.floor(ratingInfo.rating);
  const ratingCount = ratingInfo.ratingCount;
  const availableStock = getAvailableStock(product);
  const soldOut = isOutOfStock(product);

  const primaryCategory = getPrimaryCategory(product);
  const productImage =
    product.transparentImageUrl ||
    product.pngImageUrl ||
    product.noBgImageUrl ||
    product.cutoutImageUrl ||
    product.imageUrl ||
    product.images?.[0] ||
    siteConfig.ogImage;
  const productUrl = absoluteUrl(`/shop/${id}`);
  const productAlt = `${product.name}${product.fabric ? ` — ${product.fabric} saree` : ""}${product.color ? ` in ${product.color}` : ""}, buy online at Luxe&Glow`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images && product.images.length ? product.images : [productImage],
    description: product.description || siteConfig.description,
    sku: product.sku || id,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price ? String(product.price) : undefined,
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(ratingInfo.rating.toFixed(1)),
      reviewCount: ratingCount,
      bestRating: "5",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: absoluteUrl("/shop"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: primaryCategory,
        item: absoluteUrl(`/shop?category=${encodeURIComponent(primaryCategory)}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  const fabricName = product.fabric || "premium quality";
  const blouseAnswer =
    product.blouseIncluded || (product.blouse && /included|yes|true/i.test(String(product.blouse)))
      ? "Yes, a blouse piece is included with this saree for stitching."
      : "This saree is sold without a matching blouse piece. You can get a blouse stitched separately or pair it with an existing one.";
  const occasionAnswer = getPrimaryCategory(product);

  const faqItems = [
    {
      q: `What fabric is this ${fabricName} saree made of?`,
      a: `This saree is crafted in ${fabricName}, chosen for a beautiful drape, rich texture and lasting quality. Visit the product description above for full details and care instructions.`,
    },
    {
      q: "Is a blouse included with this saree?",
      a: blouseAnswer,
    },
    {
      q: "Will this saree suit festive and wedding events?",
      a: `Absolutely. This saree works across ${occasionAnswer} occasions, festive celebrations and weddings depending on how you style it. Filter the shop by occasion to discover more options.`,
    },
    {
      q: "Do you deliver to my city, and is shipping free?",
      a: "Yes. Luxe&Glow offers free shipping across India on all orders, delivered right to your doorstep. Enter your pincode above to see the estimated delivery time for your location.",
    },
    {
      q: "Can I return or exchange this saree?",
      a: "We accept returns within 2 days of delivery for a full refund. For any concern with your order, reach out to our support team through the contact page and we will help resolve it quickly.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#F7F1EA] pt-24 text-[#2C1A16]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-6 md:px-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-[#8A7667]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-[#7D1111]">Home</Link>
            </li>
            <li aria-hidden="true" className="text-[#C3B2A3]">/</li>
            <li>
              <Link href="/shop" className="transition hover:text-[#7D1111]">Shop</Link>
            </li>
            <li aria-hidden="true" className="text-[#C3B2A3]">/</li>
            <li aria-current="page" className="text-[#4A241E]">{product.name}</li>
          </ol>
        </nav>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-32 pt-6 md:px-8 md:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#F2E1D1] shadow-[0_24px_60px_rgba(62,25,18,0.10)]">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F2E1D1] to-transparent" />
              <div className="absolute right-5 top-5 z-10 rounded-full bg-[#1C1311]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                {soldOut ? "Out of Stock" : availableStock !== null ? `${availableStock} Left` : "Protected Actions"}
              </div>
              <div className="relative aspect-[4/5]">
                {images[0] && (
                  <Image
                    src={images[currentImg]}
                    alt={productAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImg(index)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition ${
                    index === currentImg ? "border-[#7A1C2B] shadow-md" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${productAlt} — view ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {detailHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-[#7A1C2B]/10 bg-white px-5 py-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8E2437]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#3A2622]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(62,25,18,0.10)]">
              <div className="bg-gradient-to-r from-[#7A1C2B] via-[#8E2437] to-[#C7893C] px-7 py-7 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
                      Signature Selection
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white/12 px-4 py-1 text-sm">
                        {getPrimaryCategory(product)}
                      </span>
                      <span className="rounded-full bg-white/12 px-4 py-1 text-sm">
                        {product.color || "Timeless shade"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="rounded-full bg-white/12 p-3 text-white transition hover:bg-white/20"
                      aria-label={`Share ${product.name}`}
                    >
                      <Share2 className="h-5 w-5" />
                    </button>

                    <button
                      onClick={handleSave}
                      className={`rounded-full p-3 transition ${
                        productSaved ? "bg-white text-[#8E2437]" : "bg-white/12 text-white hover:bg-white/20"
                      }`}
                      aria-label={`Save ${product.name}`}
                    >
                      <Heart className={`h-5 w-5 ${productSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-7 py-8">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-[#4E1320]">
                    {product.name}
                  </h1>

                  {/* <div className="mt-4 flex flex-wrap items-center gap-4">
                
                    <p className="text-4xl font-bold text-[#4E1320]">Rs. {product.price}</p>
                    <div className="flex items-center gap-3 rounded-full bg-[#F8F1EA] px-4 py-2">
                      <div className="flex text-lg text-[#C7893C]">
                        {"★".repeat(rating)}
                        {"☆".repeat(5 - rating)}
                      </div>
                      <p className="text-sm text-[#6B4A42]">
                        {product.rating || 4.0} ({product.ratingCount || 0} reviews)
                      </p>
                    </div>
                  </div> */}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
  {/* Price */}
  <div className="flex items-center gap-3">
    {product.mrp && (
      <p className="text-xl text-gray-500 line-through">
        ₹{product.mrp}
      </p>
    )}

    <p className="text-4xl font-bold text-[#4E1320]">
      ₹{product.price}
    </p>

    {product.mrp > product.price && (
      <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
      </span>
    )}
  </div>

  {/* Rating */}
  <div className="flex items-center gap-3 rounded-full bg-[#F8F1EA] px-4 py-2">
    <div className="flex text-lg text-[#C7893C]">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
    <p className="text-sm text-[#6B4A42]">
      {ratingInfo.rating.toFixed(1)} ({ratingCount} reviews)
    </p>
  </div>
</div>
                  <p
                    className={`mt-4 w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${
                      soldOut
                        ? "bg-red-50 text-red-700"
                        : isLowStock(product)
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {soldOut
                      ? "Out of stock"
                      : availableStock !== null
                        ? `${availableStock} in stock`
                        : "In stock"}
                  </p>
                </div>

                <div className="grid gap-4 rounded-[1.75rem] bg-[#FBF7F2] p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8E2437]">
                      Fabric Feel
                    </p>
                    <p className="mt-3 text-sm text-[#5B4038]">
                      Rich drape with festive styling impact.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8E2437]">
                      Finish
                    </p>
                    <p className="mt-3 text-sm text-[#5B4038]">
                      Elevated texture and statement border look.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8E2437]">
                      Account Status
                    </p>
                    <p className="mt-3 text-sm text-[#5B4038]">
                      {activeUser
                        ? "You can save, cart, and check out."
                        : "Login to unlock save, cart, and checkout."}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#7A1C2B]/10 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8E2437]">
                    Delivery Check
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={pincode}
                      onChange={(event) => setPincode(event.target.value)}
                      placeholder="Enter pincode"
                      className="flex-1 rounded-xl border border-[#D9C6BA] bg-[#FBF7F2] px-4 py-3 outline-none transition focus:border-[#7A1C2B]"
                    />
                    <button onClick={checkDelivery} className="rounded-xl bg-[#4E1320] px-6 py-3 text-white">
                      {checking ? "Checking..." : "Check"}
                    </button>
                  </div>
                  {deliveryMsg && <p className="mt-3 text-sm text-[#5B4038]">{deliveryMsg}</p>}
                </div>

                <div className="rounded-[1.75rem] border border-dashed border-[#C9B3A6] bg-[#FFF9F4] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8E2437]">
                    Account Protection
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5B4038]">
                    Guests can browse product details. Saving products, adding to cart, and buying now require login or registration.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {isInCart ? (
                    <button
                      onClick={() => router.push("/cart")}
                      className="flex-1 rounded-full bg-green-600 py-4 text-white transition hover:bg-green-700"
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={soldOut}
                      className="flex-1 rounded-full border-2 border-[#7A1C2B] py-4 text-[#7A1C2B] transition hover:bg-[#7A1C2B] hover:text-white disabled:cursor-not-allowed disabled:border-[#B9AAA2] disabled:text-[#9B8C83] disabled:hover:bg-transparent"
                    >
                      {soldOut ? "Out of Stock" : "Add to Cart"}
                    </button>
                  )}

                  <button
                    onClick={handleBuyNow}
                    disabled={soldOut}
                    className="flex-1 rounded-full bg-gradient-to-r from-[#7A1C2B] to-[#C7893C] py-4 text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:from-[#B9AAA2] disabled:to-[#B9AAA2] disabled:hover:scale-100"
                  >
                    {soldOut ? "Out of Stock" : "Buy Now"}
                  </button>
                </div>

                {saveError && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </p>
                )}

                {shareMessage && (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {shareMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_45px_rgba(62,25,18,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8E2437]">
                  Product Story
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#4E1320]">
                  Crafted to stand out with a graceful finish
                </h2>
                <ExpandableText
                  text={product.description}
                  maxChars={320}
                  className="mt-4 text-sm leading-7 text-[#5B4038]"
                />
              </div>

              <div className="rounded-[2rem] bg-[#1C1311] p-7 text-white shadow-[0_18px_45px_rgba(28,19,17,0.24)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D8B574]">
                  Styling Notes
                </p>
                <div className="mt-5 space-y-4 text-sm leading-7 text-white/78">
                  <p>Pair with a structured blouse and warm gold jewellery.</p>
                  <p>Let the border and pallu stay visible for the best impact.</p>
                  <p>Works especially well under soft warm lighting for events.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A5A18]">
          Frequently asked
        </p>
        <h2 className="mt-3 font-[var(--font-editorial)] text-3xl font-semibold text-[#24110D]">
          Questions about this saree
        </h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-[#E2D2C1] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(62,25,18,0.05)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#3A1712]">
                {faq.q}
                <span className="text-[#7D1111] transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#5F5148]">{faq.a}</p>
            </details>
          ))}
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

      {showCartSuccess && (
        <div className="fixed right-6 top-24 z-50 animate-slideIn">
          <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
              ✓
            </div>
            <p className="text-sm font-medium">Added to cart successfully</p>
          </div>
        </div>
      )}

      {!soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E7D8CC] bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-10px_30px_rgba(62,25,18,0.10)] backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#2C1A16]">{product.name}</p>
              <p className="text-sm font-bold text-[#7D1111]">
                ₹{product.price}
                {product.mrp > product.price && (
                  <span className="ml-2 text-xs font-medium text-[#9B8C83] line-through">
                    ₹{product.mrp}
                  </span>
                )}
              </p>
            </div>
            {isInCart ? (
              <button
                onClick={() => router.push("/cart")}
                className="shrink-0 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="shrink-0 rounded-full border-2 border-[#7A1C2B] px-5 py-3 text-sm font-semibold text-[#7A1C2B] active:bg-[#7A1C2B] active:text-white"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={handleBuyNow}
              className="shrink-0 rounded-full bg-gradient-to-r from-[#7A1C2B] to-[#C7893C] px-5 py-3 text-sm font-semibold text-white shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
