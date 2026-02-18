"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useParams } from "next/navigation";

export default function ProductDetails() {
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [showViewer, setShowViewer] = useState(false);

  const [startX, setStartX] = useState(0);
  const [pinchStartDistance, setPinchStartDistance] = useState(0);
  const [zoom, setZoom] = useState(1);

  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProduct(docSnap.data());
    };
    fetchProduct();
  }, [id]);

  const images = product?.images?.length ? product.images : [product?.imageUrl];

  // swipe + pinch
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) setStartX(e.touches[0].clientX);
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchStartDistance(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistance > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / pinchStartDistance;
      setZoom(prev => Math.max(1, Math.min(5, prev * scale)));
      setPinchStartDistance(dist);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const delta = startX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        if (delta > 0)
          setCurrentImg(prev => prev === images.length - 1 ? 0 : prev + 1);
        else
          setCurrentImg(prev => prev === 0 ? images.length - 1 : prev - 1);
      }
    }
  };

  const checkDelivery = async () => {
    if (pincode.length !== 6) return setDeliveryMsg("Enter valid pincode");

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
        setDeliveryMsg(`🚚 Delivery to ${data.city} in ${data.tat} days`);
    } catch {
      setDeliveryMsg("Error checking delivery");
    }
    setChecking(false);
  };

  if (!product) return <ProductSkeleton />;

  return (
    <main className="pt-24 bg-[#FAF6F0] min-h-screen">

      {/* ================= MAIN GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14 
      grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* ================= IMAGE GALLERY ================= */}
        <div className="lg:sticky lg:top-28 h-fit">

          {/* MAIN IMAGE */}
          <div
            className="relative bg-white rounded-3xl shadow-xl 
            p-4 md:p-6 aspect-square flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* LEFT */}
            <button
              onClick={() => setCurrentImg(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 
              w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/90 shadow text-lg md:text-xl"
            >
              ❮
            </button>

            <img
              src={images[currentImg]}
              onClick={() => setShowViewer(true)}
              className="max-h-full max-w-full object-contain cursor-zoom-in"
            />

            {/* RIGHT */}
            <button
              onClick={() => setCurrentImg(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 
              w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/90 shadow text-lg md:text-xl"
            >
              ❯
            </button>
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImg(i)}
                className={`min-w-[65px] h-[65px] md:min-w-[80px] md:h-[80px] 
                rounded-xl overflow-hidden border-2 
                ${i === currentImg ? "border-[#5A0F1C]" : "border-transparent"}`}>
                <img src={img} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div>
          <span className="bg-[#5A0F1C]/10 text-[#5A0F1C] px-4 py-1 rounded-full text-sm">
            {product.category}
          </span>

          <h1 className="text-2xl md:text-4xl mt-4 text-[#5A0F1C]">{product.name}</h1>
          <p className="text-3xl md:text-4xl font-bold mt-4 text-[#5A0F1C]">₹{product.price}</p>

          {/* DELIVERY */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              value={pincode}
              onChange={(e)=>setPincode(e.target.value)}
              className="border px-4 py-3 rounded-xl w-full sm:w-44"
              placeholder="Enter pincode"
            />
            <button onClick={checkDelivery} className="bg-[#5A0F1C] text-white px-6 py-3 rounded-xl">
              {checking ? "Checking..." : "Check"}
            </button>
          </div>
          {deliveryMsg && <p className="mt-2">{deliveryMsg}</p>}

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={()=>addToCart({id,...product})}
              className="flex-1 py-4 rounded-full border-2 border-[#5A0F1C] text-[#5A0F1C]"
            >
              Add to Cart
            </button>

            <button className="flex-1 py-4 rounded-full text-white bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]">
              Buy Now
            </button>
          </div>

          <div className="mt-10 bg-white p-6 md:p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Product Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      {/* ================= FULLSCREEN VIEWER ================= */}
      {showViewer && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center"
          onClick={()=>{setShowViewer(false); setZoom(1);}}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]" onClick={(e)=>e.stopPropagation()}>

            <button
              onClick={()=>setCurrentImg(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 text-white text-4xl md:text-6xl"
            >
              ❮
            </button>

            <img
              src={images[currentImg]}
              className="max-h-[95vh] max-w-[95vw] object-contain"
              style={{ transform:`scale(${zoom})` }}
            />

            <button
              onClick={()=>setCurrentImg(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 text-white text-4xl md:text-6xl"
            >
              ❯
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
