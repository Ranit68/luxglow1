"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavedProducts } from "@/context/SavedProductsContext";
import AuthPromptModal from "@/components/AuthPromptModal";
import { useState } from "react";

export default function SavedProductsPage() {
  const { user } = useAuth();
  const { loadingSaved, savedError, savedProducts, toggleSavedProduct } =
    useSavedProducts();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [actionError, setActionError] = useState("");

  if (!user) {
    return (
      <>
        <main className="min-h-screen bg-[#F7F1EA] px-4 pt-28">
          <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_60px_rgba(62,25,18,0.10)] md:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6E7D9] text-[#8E2437]">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-[#4E1320]">
              Save favorites to your account
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5B4038]">
              Register or login to build a personal shortlist before you add products to cart.
            </p>
            <button
              onClick={() => setShowAuthPrompt(true)}
              className="mt-8 rounded-full bg-gradient-to-r from-[#7A1C2B] to-[#C7893C] px-8 py-4 text-sm font-medium text-white"
            >
              Login to view saved products
            </button>
          </section>
        </main>

        <AuthPromptModal
          action="save"
          open={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          redirect="/saved"
          title="Save products with your account"
          description="Saved products are only available after login or registration."
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F1EA] px-4 pt-28">
      <section className="mx-auto max-w-7xl py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8E2437]">
              Saved Edit
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-[#4E1320]">
              Your favorite sarees
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#5B4038]">
            Keep your shortlist ready before checkout. Saved items stay linked to your account.
          </p>
        </div>

        {loadingSaved ? (
          <div className="rounded-[2rem] bg-white p-10 shadow-[0_18px_45px_rgba(62,25,18,0.08)]">
            <p className="text-sm text-[#5B4038]">Loading saved products...</p>
          </div>
        ) : savedError ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-10 shadow-[0_18px_45px_rgba(62,25,18,0.08)]">
            <h2 className="text-2xl font-semibold text-red-700">Could not load saved products</h2>
            <p className="mt-3 text-sm text-red-600">{savedError}</p>
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-[0_18px_45px_rgba(62,25,18,0.08)]">
            <h2 className="text-2xl font-semibold text-[#4E1320]">No saved products yet</h2>
            <p className="mt-3 text-sm text-[#5B4038]">
              Browse the collection and tap the heart icon to keep products here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-[#4E1320] px-6 py-3 text-sm font-medium text-white"
            >
              Explore shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {savedProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_45px_rgba(62,25,18,0.08)]"
              >
                <Link href={`/shop/${product.id}`} className="relative block aspect-[4/5] bg-[#F6EDE5]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </Link>
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8E2437]">
                        {product.category}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-[#4E1320]">
                        {product.name}
                      </h2>
                    </div>
                    <button
                      onClick={async () => {
                        setActionError("");

                        try {
                          await toggleSavedProduct(product);
                        } catch (error) {
                          setActionError(
                            error?.message || "Could not update saved products."
                          );
                        }
                      }}
                      className="rounded-full bg-[#FBF6F1] p-3 text-[#8E2437] transition hover:bg-[#F1DFD3]"
                      aria-label={`Remove ${product.name} from saved products`}
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-[#4E1320]">Rs. {product.price}</p>
                    <Link
                      href={`/shop/${product.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#4E1320] px-4 py-2 text-sm font-medium text-white"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {actionError && (
          <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {actionError}
          </div>
        )}
      </section>
    </main>
  );
}
