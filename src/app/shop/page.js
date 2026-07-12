"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, getDocs, query } from "firebase/firestore";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import AuthPromptModal from "@/components/AuthPromptModal";
import { useAuth } from "@/context/AuthContext";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { auth, db } from "@/lib/firebase";

const categories = ["All", "Silk", "Cotton", "Wedding", "Festive", "Daily Wear", "Party Wear"];
const occasions = ["Wedding", "Festive", "Corporate", "Casual"];
const MIN_PRICE = 700;
const MAX_PRICE = 150000;

function formatPrice(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function ShopPage() {
  const PRODUCTS_PER_PAGE = 12;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isSaved, toggleSavedProduct } = useSavedProducts();
  const pageParam = Number(searchParams.get("page")) || 1;

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState("latest");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const [authPrompt, setAuthPrompt] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      setLoading(true);

      const snapshot = await getDocs(query(collection(db, "products")));
      let data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      if (category !== "All") {
        data = data.filter((product) => product.category === category);
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

      data = data.filter((product) => Number(product.price || 0) <= maxPrice);

      const start = (pageParam - 1) * PRODUCTS_PER_PAGE;
      const paginated = data.slice(start, start + PRODUCTS_PER_PAGE);

      if (ignore) {
        return;
      }

      setVisibleProducts(paginated);
      setTotalMatches(data.length);
      setHasNextPage(start + PRODUCTS_PER_PAGE < data.length);
      setLoading(false);
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [PRODUCTS_PER_PAGE, category, maxPrice, pageParam, search, sort]);

  const pageNumbers = useMemo(() => {
    const maxPage = Math.max(1, Math.ceil(totalMatches / PRODUCTS_PER_PAGE));
    return Array.from({ length: Math.min(maxPage, 4) }, (_, index) => index + 1);
  }, [PRODUCTS_PER_PAGE, totalMatches]);

  const goNext = () => router.push(`/shop?page=${pageParam + 1}`);
  const goPrev = () => router.push(`/shop?page=${pageParam - 1}`);
  const goPage = (page) => router.push(`/shop?page=${page}`);

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

  return (
    <main className="min-h-screen bg-[#F7F3EE] pt-24 text-[#2D1712]">
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-10">
        <div className="mb-9 text-[10px] uppercase tracking-[0.24em] text-[#7D6B5D]">
          Home <span className="px-2 text-[#B6A89A]">/</span> Collections
        </div>

        <div className="flex flex-col gap-8 border-b border-[#D8CABB] pb-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-[var(--font-editorial)] text-4xl font-semibold leading-tight text-[#24110D] md:text-5xl">
              The Heritage Series
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#5F5148]">
              Discover a curated collection of Bengal&apos;s finest weaves, from the
              ethereal transparency of Jamdani to the regal drape of pure silk.
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

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[230px_1fr]">
        <aside className="space-y-8 text-xs">
          <div className="flex items-center justify-between border-b border-[#D8CABB] pb-3">
            <p className="font-semibold uppercase tracking-[0.22em] text-[#24110D]">Filter by</p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setSearch("");
                setMaxPrice(MAX_PRICE);
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
                    onChange={() => setCategory(item)}
                    className="h-3.5 w-3.5 accent-[#7D1111]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-[#D8CABB] pt-6">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#24110D]">Fabric</p>
            <button className="text-left text-[#7D1111]">Pure silk</button>
          </div>

          <div className="border-t border-[#D8CABB] pt-6">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#24110D]">Occasion</p>
            <div className="flex flex-wrap gap-2">
              {occasions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full border border-[#CDBCA9] px-3 py-1 text-[10px] text-[#5F5148] transition hover:border-[#7D1111] hover:text-[#7D1111]"
                >
                  {item}
                </button>
              ))}
            </div>
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

        <div>
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
            <div className="grid grid-cols-2 gap-x-7 gap-y-12 md:grid-cols-3">
              {visibleProducts.map((product) => {
                const saved = isSaved(product.id);

                return (
                  <article key={product.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-[#E8DED3]">
                      <Link href={`/shop/${product.id}`} className="absolute inset-0 z-10">
                        <span className="sr-only">View {product.name}</span>
                      </Link>

                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3">
                        <span className="bg-[#F7F3EE]/86 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#7D1111]">
                          {product.category || "Collection"}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleSaveClick(product)}
                          className="bg-[#F7F3EE]/86 p-2 text-[#7D1111] transition hover:bg-white"
                          aria-label={`${saved ? "Remove" : "Save"} ${product.name} wishlist`}
                        >
                          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <Link href={`/shop/${product.id}`} className="block pt-4 text-center">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8A7667]">
                        {product.fabric || product.category || "Luxe&Glow"}
                      </p>
                      <h2 className="mx-auto mt-1 line-clamp-2 max-w-[15rem] font-[var(--font-editorial)] text-xl font-semibold leading-tight text-[#24110D]">
                        {product.name}
                      </h2>
                      <p className="mt-2 text-sm text-[#7D1111]">{formatPrice(product.price)}</p>
                    </Link>
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
