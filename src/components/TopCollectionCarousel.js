"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { getProductRating } from "@/lib/ratings";

function formatPrice(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  return value || "";
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

export default function TopCollectionCarousel({ products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        aria-label="Scroll top collection left"
        className="absolute left-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2D2C1] bg-white/90 text-[#7D1111] shadow-[0_12px_28px_rgba(62,25,18,0.16)] backdrop-blur transition hover:bg-white disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-11 lg:-left-5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={emblaRef}
        className="overflow-hidden px-12 pb-6 lg:px-12"
        style={{ touchAction: "pan-y pinch-zoom" }}
      >
        <div className="flex items-end gap-5 sm:gap-6">
          {products.map((product, index) => {
            const featured = index === selectedIndex;
            const image = getProductImage(product);
            const discount =
              product.mrp && product.mrp > product.price
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;
            const fabric = formatList(product.fabric);
            const { rating: productRating, ratingCount: productRatingCount } = getProductRating(product);

            return (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group relative flex w-[16.5rem] shrink-0 flex-col items-center text-center transition duration-300 sm:w-[18.5rem] lg:w-[19.5rem]"
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
                    alt={`${product.name}${fabric ? ` — ${fabric} saree` : ""}, buy online at Luxe&Glow`}
                    fill
                    sizes="(min-width: 1024px) 19.5rem, 18.5rem"
                    className={`object-contain drop-shadow-[0_22px_32px_rgba(45,23,18,0.24)] transition duration-500 group-hover:-translate-y-1 ${
                      featured ? "scale-[1.035]" : "scale-100"
                    }`}
                  />
                  {discount > 0 && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#9B251C]/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(155,37,28,0.35)]">
                      {discount}% off
                    </span>
                  )}
                </div>

                <div className="-mt-3 w-full rounded-[1.25rem] border border-[#E2D2C1] bg-white/78 px-4 py-4 shadow-[0_18px_45px_rgba(62,25,18,0.08)] backdrop-blur">
                  {fabric && (
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8A5A18]">
                      {fabric}
                    </p>
                  )}
                  <p className="line-clamp-2 min-h-[2.75rem] font-[var(--font-playfair)] text-xl font-semibold leading-tight text-[#3A1712]">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <div className="flex items-center text-[#E0A93E]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= Math.round(productRating) ? "fill-current" : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#8A7561]">
                      ({productRatingCount})
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <p className="text-base font-bold text-[#7D1111]">
                      {formatPrice(product.price)}
                    </p>
                    {product.mrp > product.price && (
                      <p className="text-xs text-[#A9947F] line-through">
                        {formatPrice(product.mrp)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        aria-label="Scroll top collection right"
        className="absolute right-0 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2D2C1] bg-white/90 text-[#7D1111] shadow-[0_12px_28px_rgba(62,25,18,0.16)] backdrop-blur transition hover:bg-white disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-11 lg:-right-5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}