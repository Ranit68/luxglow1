"use client";

import { useEffect, useState } from "react";
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
const isInCart =
  cart?.some(item => item.id === id);
  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setProduct(snap.data());
    };
    fetchProduct();
  }, [id]);

  if (!product) return <ProductSkeleton />;

  const images =
    product?.images?.length ? product.images : [product?.imageUrl];

  /* ================= DELIVERY CHECK ================= */

  const checkDelivery = async () => {

    if (pincode.length !== 6)
      return setDeliveryMsg("Enter valid 6 digit pincode");

    setChecking(true);

    try {
      const res = await fetch("/api/check-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });

      const data = await res.json();

      if (!data.serviceable)
        setDeliveryMsg("❌ Not deliverable");
      else
        setDeliveryMsg(
          `🚚 Delivery to ${data.city} in ${data.tat} days`
        );

    } catch {
      setDeliveryMsg("Error checking delivery");
    }

    setChecking(false);
  };

  /* ================= AUTH PROTECTION ================= */

  const handleAddToCart = () => {
    if (!user) return setShowAuthDialog(true);

    addToCart({ id, ...product });

setShowCartSuccess(true);

setTimeout(() => {
  setShowCartSuccess(false);
}, 2500);
  };

  const handleBuyNow = () => {
    if (!user) return setShowAuthDialog(true);

    buyNow({ id, ...product });
    router.push("/checkout");
  };

  /* ================= UI ================= */

  return (
    <main className="pt-24 bg-[#FAF6F0] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12
      grid lg:grid-cols-2 gap-14">

        {/* ================= IMAGE SECTION ================= */}

        <div className="space-y-5">

          <div className="bg-white rounded-3xl shadow-xl p-6 aspect-square flex items-center justify-center">
            <img
              src={images[currentImg]}
              className="max-h-full object-contain"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setCurrentImg(i)}
                className={`w-20 h-20 rounded-xl cursor-pointer border-2
                ${i === currentImg
                    ? "border-[#5A0F1C]"
                    : "border-transparent"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ================= DETAILS ================= */}

        <div>

          <span className="bg-[#5A0F1C]/10 text-[#5A0F1C]
          px-4 py-1 rounded-full text-sm">
            {product.category}
          </span>

          <h1 className="text-4xl mt-4 text-[#5A0F1C] font-semibold">
            {product.name}
          </h1>

          <p className="text-4xl font-bold mt-4 text-[#5A0F1C]">
            ₹{product.price}
          </p>
<div className="flex items-center gap-3 mt-3">

  <div className="flex text-yellow-500 text-lg">
    {"★".repeat(Math.floor(product.rating || 4))}
    {"☆".repeat(5 - Math.floor(product.rating || 4))}
  </div>

  <p className="text-sm text-gray-600">
    {product.rating || 4.0} ({product.ratingCount || 0} reviews)
  </p>

</div>
{/* ================= PRODUCT COLOR ================= */}

{/* ================= PRODUCT COLOR ================= */}

{product.color && (
  <div className="mt-6">

    <p className="text-sm text-gray-500 mb-2">
      Color
    </p>

    <div className="inline-flex items-center gap-3
    px-5 py-3 rounded-2xl
    bg-white border shadow-sm">

      {/* Color Preview Dot */}
      <span
        className="w-5 h-5 rounded-full border"
        style={{
          backgroundColor: product.color.toLowerCase()
        }}
      />

      {/* Color Name */}
      <span className="font-medium text-gray-800">
        {product.color}
      </span>

    </div>

  </div>
)}
          {/* DELIVERY CHECK */}

          <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm">

            <p className="font-medium mb-3">
              Check Delivery Availability
            </p>

            <div className="flex gap-3">
              <input
                value={pincode}
                onChange={(e)=>setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="border px-4 py-3 rounded-xl flex-1"
              />

              <button
                onClick={checkDelivery}
                className="bg-[#5A0F1C] text-white px-6 rounded-xl"
              >
                {checking ? "..." : "Check"}
              </button>
            </div>

            {deliveryMsg && (
              <p className="mt-3 text-sm">{deliveryMsg}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}

          <div className="flex gap-4 mt-10">

          {isInCart ? (

  <button
    onClick={() => router.push("/cart")}
    className="flex-1 py-4 rounded-full
    bg-green-600 text-white
    hover:bg-green-700 transition"
  >
    Go to Cart 🛒
  </button>

) : (

  <button
    onClick={handleAddToCart}
    className="flex-1 py-4 rounded-full
    border-2 border-[#5A0F1C]
    text-[#5A0F1C]
    hover:bg-[#5A0F1C]
    hover:text-white transition"
  >
    Add to Cart
  </button>

)}

            <button
              onClick={handleBuyNow}
              className="flex-1 py-4 rounded-full text-white
              bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]
              shadow-lg hover:scale-[1.02] transition"
            >
              Buy Now
            </button>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-12 bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              Product Description
            </h3>
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>
{/* ================= RATING ================= */}


        </div>
      </div>

      {/* ================= LOGIN DIALOG ================= */}

      {showAuthDialog && (
        <div className="fixed inset-0 bg-black/40
        flex items-center justify-center z-50 backdrop-blur-sm">

          <div className="bg-white rounded-3xl p-8
          w-[90%] max-w-md text-center shadow-2xl animate-scaleIn">

            <h2 className="text-2xl font-semibold text-[#5A0F1C]">
              Login Required
            </h2>

            <p className="text-gray-600 mt-2 mb-6">
              Please login to continue shopping.
            </p>

            <div className="flex gap-4">

              <button
                onClick={()=>setShowAuthDialog(false)}
                className="flex-1 py-3 rounded-full border"
              >
                Cancel
              </button>

              <button
                onClick={()=>router.push(`/login?redirect=/shop/${id}`)}
                className="flex-1 py-3 rounded-full text-white
                bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]"
              >
                Login
              </button>

            </div>

          </div>
        </div>
      )}

{showCartSuccess && (
  <div className="fixed top-24 right-6 z-50 animate-slideIn">

    <div className="bg-white shadow-2xl rounded-2xl
    px-6 py-4 flex items-center gap-3 border">

      <div className="w-8 h-8 rounded-full
      bg-green-100 flex items-center justify-center">
        ✅
      </div>

      <p className="font-medium text-sm">
        Added to cart successfully
      </p>

    </div>

  </div>
)}
    </main>
  );
}