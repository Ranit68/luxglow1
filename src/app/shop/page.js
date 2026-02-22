"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function ShopPage() {

  const PRODUCTS_PER_PAGE = 12;

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam =
    Number(searchParams.get("page")) || 1;

  /* ================= STATES ================= */

  const [products,setProducts]=useState([]);
  const [visibleProducts,setVisibleProducts]=useState([]);
  const [loading,setLoading]=useState(true);

  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All");
  const [sort,setSort]=useState("latest");

  const [hasNextPage,setHasNextPage]=useState(false);

  /* ================= FETCH ================= */

  const fetchProducts = async () => {

    setLoading(true);

    const snapshot = await getDocs(
      query(collection(db,"products"))
    );

    let data = snapshot.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }));

    /* CATEGORY FILTER */
    if(category !== "All"){
      data = data.filter(
        p=>p.category === category
      );
    }

    /* SORTING */
    if(sort==="latest"){
      data.sort(
        (a,b)=>
          b.createdAt?.seconds -
          a.createdAt?.seconds
      );
    }

    if(sort==="low"){
      data.sort((a,b)=>a.price-b.price);
    }

    if(sort==="high"){
      data.sort((a,b)=>b.price-a.price);
    }

    if(sort==="name"){
      data.sort((a,b)=>
        a.name.localeCompare(b.name)
      );
    }

    /* SEARCH */
    if(search){
      data=data.filter(p=>
        p.name.toLowerCase()
        .includes(search.toLowerCase())
      );
    }

    /* PAGINATION */
    const start =
      (pageParam-1)*PRODUCTS_PER_PAGE;

    const paginated =
      data.slice(start,start+PRODUCTS_PER_PAGE);

    setProducts(data);
    setVisibleProducts(paginated);

    setHasNextPage(
      start+PRODUCTS_PER_PAGE<data.length
    );

    setLoading(false);
  };

  useEffect(()=>{
    fetchProducts();
  },[category,sort,pageParam,search]);

  /* ================= PAGE NAV ================= */

  const goNext=()=>router.push(`/shop?page=${pageParam+1}`);
  const goPrev=()=>router.push(`/shop?page=${pageParam-1}`);

  /* ================= UI ================= */

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 py-14">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row
        justify-between gap-6 mb-10">

          <h1 className="text-4xl text-[#5A0F1C]">
            Shop Sarees
          </h1>

          {/* FILTER BAR */}
          <div className="flex flex-wrap gap-4">

            {/* SEARCH */}
            <input
              placeholder="Search..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="px-5 py-3 rounded-full
              border shadow-sm"
            />

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              className="px-4 py-3 rounded-full border"
            >
              <option>All</option>
              <option>Silk</option>
              <option>Cotton</option>
              <option>Wedding</option>
              <option>Festive</option>
              <option>Daily Wear</option>
              <option>Party Wear</option>
            </select>

            {/* SORT */}
            <select
              value={sort}
              onChange={(e)=>setSort(e.target.value)}
              className="px-4 py-3 rounded-full border"
            >
              <option value="latest">
                Latest
              </option>
              <option value="low">
                Price Low → High
              </option>
              <option value="high">
                Price High → Low
              </option>
              <option value="name">
                Name A–Z
              </option>
            </select>

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_,i)=>
              <ProductCardSkeleton key={i}/>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && (
          <div className="grid grid-cols-2
          md:grid-cols-3 lg:grid-cols-4 gap-6">

            {visibleProducts.map(product=>(
              <Link key={product.id}
              href={`/shop/${product.id}`}>

                <div className="group bg-white
                rounded-3xl shadow-md
                hover:shadow-xl overflow-hidden">

                  <div className="relative h-64">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover
                      group-hover:scale-110
                      transition duration-500"
                    />
                  </div>

                  <div className="p-5">

                    <h2 className="font-semibold line-clamp-1">
                      {product.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>

                    <div className="flex justify-between mt-4">

                      <p className="font-bold text-[#5A0F1C]">
                        ₹{product.price}
                      </p>

                      <span className="px-4 py-1 rounded-full
                      text-white text-sm
                      bg-gradient-to-r
                      from-[#5A0F1C]
                      to-[#D4AF37]">
                        View
                      </span>

                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* PAGINATION */}
        {!loading && (
          <div className="flex justify-center gap-4 mt-14">
            <button
              disabled={pageParam===1}
              onClick={goPrev}
              className="px-6 py-3 border rounded-full">
              Previous
            </button>
            <span className="px-4 py-3">
              Page {pageParam}
            </span>
            <button
              disabled={!hasNextPage}
              onClick={goNext}
              className="px-6 py-3 rounded-full text-white
              bg-gradient-to-r
              from-[#5A0F1C]
              to-[#D4AF37]">
              Next
            </button>
          </div>
        )}

      </div>

    </main>
  );
}