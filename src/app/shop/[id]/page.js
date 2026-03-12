"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetails() {
  const { cart, addToCart, buyNow } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);

  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const isInCart = cart?.some((item) => item.id === id);
  const images = useMemo(() => {
    if (product?.images?.length) {
      return product.images;
    }

    return product?.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  const detailHighlights = useMemo(
    () => [
      {
        label: "Category",
        value: product?.category || "Premium Saree",
      },
      {
        label: "Color",
        value: product?.color || "Signature tone",
      },
      {
        label: "Occasion",
        value:
          product?.category === "Wedding"
            ? "Wedding and festive styling"
            : "Celebration and occasion wear",
      },
    ],
    [product]
  );

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setProduct(snap.data());
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <ProductSkeleton />;
  }

  const checkDelivery = async () => {
    if (pincode.length !== 6) {
      return setDeliveryMsg("Enter valid 6 digit pincode");
    }

    setChecking(true);

    try {
      const res = await fetch("/api/check-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });

      const data = await res.json();

      if (!data.serviceable) {
        setDeliveryMsg("Not deliverable");
      } else {
        setDeliveryMsg(`Delivery to ${data.city} in ${data.tat} days`);
      }
    } catch {
      setDeliveryMsg("Error checking delivery");
    }

    setChecking(false);
  };

  const handleAddToCart = () => {
    if (!user) {
      return setShowAuthDialog(true);
    }

    addToCart({ id, ...product });
    setShowCartSuccess(true);

    setTimeout(() => {
      setShowCartSuccess(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    if (!user) {
      return setShowAuthDialog(true);
    }

    buyNow({ id, ...product });
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#F7F1EA] pt-24 text-[#2C1A16]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(62,25,18,0.10)]">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F2E1D1] to-transparent" />
              <div className="relative flex aspect-[4/5] items-center justify-center p-8">
                {images[0] && (
                  <Image
                    src={images[currentImg]}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-8"
                    priority
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition ${
                    i === currentImg
                      ? "border-[#7A1C2B] shadow-md"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
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
                  <p className="mt-3 text-sm font-medium text-[#3A2622]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(62,25,18,0.10)]">
              <div className="bg-gradient-to-r from-[#7A1C2B] via-[#8E2437] to-[#C7893C] px-7 py-7 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
                  Signature Selection
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/12 px-4 py-1 text-sm">
                    {product.category}
                  </span>
                  <span className="rounded-full bg-white/12 px-4 py-1 text-sm">
                    {product.color || "Timeless shade"}
                  </span>
                </div>
              </div>

              <div className="space-y-6 px-7 py-8">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-[#4E1320]">
                    {product.name}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <p className="text-4xl font-bold text-[#4E1320]">
                      Rs. {product.price}
                    </p>

                    <div className="flex items-center gap-3 rounded-full bg-[#F8F1EA] px-4 py-2">
                      <div className="flex text-lg text-[#C7893C]">
                        {"★".repeat(Math.floor(product.rating || 4))}
                        {"☆".repeat(5 - Math.floor(product.rating || 4))}
                      </div>
                      <p className="text-sm text-[#6B4A42]">
                        {product.rating || 4.0} ({product.ratingCount || 0} reviews)
                      </p>
                    </div>
                  </div>
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
                      Styling Mood
                    </p>
                    <p className="mt-3 text-sm text-[#5B4038]">
                      Perfect for weddings, receptions, and special evenings.
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
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter pincode"
                      className="flex-1 rounded-xl border border-[#D9C6BA] bg-[#FBF7F2] px-4 py-3 outline-none transition focus:border-[#7A1C2B]"
                    />

                    <button
                      onClick={checkDelivery}
                      className="rounded-xl bg-[#4E1320] px-6 py-3 text-white"
                    >
                      {checking ? "Checking..." : "Check"}
                    </button>
                  </div>

                  {deliveryMsg && (
                    <p className="mt-3 text-sm text-[#5B4038]">{deliveryMsg}</p>
                  )}
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
                      className="flex-1 rounded-full border-2 border-[#7A1C2B] py-4 text-[#7A1C2B] transition hover:bg-[#7A1C2B] hover:text-white"
                    >
                      Add to Cart
                    </button>
                  )}

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 rounded-full bg-gradient-to-r from-[#7A1C2B] to-[#C7893C] py-4 text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Buy Now
                  </button>
                </div>
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
                <p className="mt-4 text-sm leading-7 text-[#5B4038]">
                  {product.description}
                </p>
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

      {showAuthDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-md animate-scaleIn rounded-3xl bg-white p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-semibold text-[#5A0F1C]">
              Login Required
            </h2>

            <p className="mb-6 mt-2 text-gray-600">
              Please login to continue shopping.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAuthDialog(false)}
                className="flex-1 rounded-full border py-3"
              >
                Cancel
              </button>

              <button
                onClick={() => router.push(`/login?redirect=/shop/${id}`)}
                className="flex-1 rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-3 text-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {showCartSuccess && (
        <div className="fixed right-6 top-24 z-50 animate-slideIn">
          <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              ✓
            </div>

            <p className="text-sm font-medium">Added to cart successfully</p>
          </div>
        </div>
      )}
    </main>
  );
}
