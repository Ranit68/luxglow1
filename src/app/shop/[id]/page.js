"use client";

import { useEffect, useRef, useState } from "react";
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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);

  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [checking, setChecking] = useState(false);

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCameraPrompt, setShowCameraPrompt] = useState(false);
  const [tryOnImage, setTryOnImage] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);

  const isInCart = cart?.some((item) => item.id === id);

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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!product) {
    return <ProductSkeleton />;
  }

  const images = product?.images?.length ? product.images : [product?.imageUrl];

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  const requestCameraAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "This browser does not support camera access. Try Chrome or Safari on a secure site."
      );
      setShowCameraPrompt(false);
      return;
    }

    if (
      typeof window !== "undefined" &&
      !window.isSecureContext &&
      window.location.hostname !== "localhost"
    ) {
      setCameraError(
        "Camera permission works only on HTTPS or localhost. Open this site securely, then try again."
      );
      setShowCameraPrompt(false);
      return;
    }

    try {
      setCameraLoading(true);
      setCameraError("");
      setShowCameraPrompt(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      if (error?.name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Use your browser address bar settings to allow camera access, then try again."
        );
      } else if (error?.name === "NotFoundError") {
        setCameraError("No camera was found on this device.");
      } else {
        setCameraError(
          "Unable to start the camera right now. You can still upload a photo to preview the saree."
        );
      }

      setCameraOpen(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const handleOpenCameraClick = async () => {
    setCameraError("");

    if (navigator.permissions?.query) {
      try {
        const permission = await navigator.permissions.query({
          name: "camera",
        });

        if (permission.state === "granted") {
          await requestCameraAccess();
          return;
        }
      } catch {
      }
    }

    setShowCameraPrompt(true);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setTryOnImage(canvas.toDataURL("image/png"));
    stopCamera();
  };

  const handleTryOnUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTryOnImage(reader.result?.toString() || "");
      setCameraError("");
    };
    reader.readAsDataURL(file);
  };

  const openUploadPicker = () => {
    fileInputRef.current?.click();
  };

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
    <main className="min-h-screen bg-[#FAF6F0] pt-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-12 md:px-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="relative flex aspect-square items-center justify-center rounded-3xl bg-white p-6 shadow-xl">
            <Image
              src={images[currentImg]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="max-h-full object-contain"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${product.name} view ${i + 1}`}
                width={80}
                height={80}
                onClick={() => setCurrentImg(i)}
                className={`h-20 w-20 cursor-pointer rounded-xl border-2 ${
                  i === currentImg ? "border-[#5A0F1C]" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="rounded-full bg-[#5A0F1C]/10 px-4 py-1 text-sm text-[#5A0F1C]">
            {product.category}
          </span>

          <h1 className="mt-4 text-4xl font-semibold text-[#5A0F1C]">
            {product.name}
          </h1>

          <p className="mt-4 text-4xl font-bold text-[#5A0F1C]">
            Rs. {product.price}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex text-lg text-yellow-500">
              {"★".repeat(Math.floor(product.rating || 4))}
              {"☆".repeat(5 - Math.floor(product.rating || 4))}
            </div>

            <p className="text-sm text-gray-600">
              {product.rating || 4.0} ({product.ratingCount || 0} reviews)
            </p>
          </div>

          {product.color && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-500">Color</p>

              <div className="inline-flex items-center gap-3 rounded-2xl border bg-white px-5 py-3 shadow-sm">
                <span
                  className="h-5 w-5 rounded-full border"
                  style={{ backgroundColor: product.color.toLowerCase() }}
                />

                <span className="font-medium text-gray-800">
                  {product.color}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 font-medium">Check Delivery Availability</p>

            <div className="flex gap-3">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="flex-1 rounded-xl border px-4 py-3"
              />

              <button
                onClick={checkDelivery}
                className="rounded-xl bg-[#5A0F1C] px-6 text-white"
              >
                {checking ? "..." : "Check"}
              </button>
            </div>

            {deliveryMsg && <p className="mt-3 text-sm">{deliveryMsg}</p>}
          </div>

          <div className="mt-10 flex gap-4">
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
                className="flex-1 rounded-full border-2 border-[#5A0F1C] py-4 text-[#5A0F1C] transition hover:bg-[#5A0F1C] hover:text-white"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-4 text-white shadow-lg transition hover:scale-[1.02]"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">
            <h3 className="mb-3 text-xl font-semibold">Product Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      <section className="mx-auto mt-4 max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#5A0F1C]/10 bg-white shadow-xl">
            <div className="border-b border-[#5A0F1C]/10 bg-gradient-to-r from-[#5A0F1C] to-[#8E2437] px-6 py-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                AI Try-On Studio
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Preview the saree with your camera
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                This beta section lets shoppers use a live camera or upload a
                photo now. A true AI drape-on-body pipeline can plug into this
                panel later.
              </p>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#F6EEE7]">
                  {tryOnImage ? (
                    <Image
                      src={tryOnImage}
                      alt="Your try-on preview"
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  ) : cameraOpen ? (
                    <video
                      ref={videoRef}
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="max-w-xs text-center">
                      <p className="text-lg font-semibold text-[#5A0F1C]">
                        Start a virtual preview
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Open your camera or upload a front-facing photo to test
                        this saree visually.
                      </p>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {cameraError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {cameraError}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {!cameraOpen ? (
                    <button
                      onClick={handleOpenCameraClick}
                      disabled={cameraLoading}
                      className="rounded-full bg-[#5A0F1C] px-5 py-3 text-sm font-medium text-white"
                    >
                      {cameraLoading ? "Opening..." : "Open Camera"}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={capturePhoto}
                        className="rounded-full bg-[#5A0F1C] px-5 py-3 text-sm font-medium text-white"
                      >
                        Capture Look
                      </button>
                      <button
                        onClick={stopCamera}
                        className="rounded-full border border-[#5A0F1C] px-5 py-3 text-sm font-medium text-[#5A0F1C]"
                      >
                        Close Camera
                      </button>
                    </>
                  )}

                  <button
                    onClick={openUploadPicker}
                    className="rounded-full border border-[#D4AF37] bg-[#FFF8E6] px-5 py-3 text-sm font-medium text-[#5A0F1C]"
                  >
                    Upload Photo
                  </button>

                  {tryOnImage && (
                    <button
                      onClick={() => setTryOnImage("")}
                      className="rounded-full border px-5 py-3 text-sm font-medium text-gray-700"
                    >
                      Reset Preview
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleTryOnUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] bg-[#FAF6F0] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E2437]">
                    Exact Saree Selected
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
                    <div className="relative h-36 overflow-hidden rounded-2xl bg-white">
                      <Image
                        src={images[currentImg]}
                        alt={product.name}
                        fill
                        sizes="120px"
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-[#5A0F1C]">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        This is the exact product currently selected. When you
                        connect an AI try-on engine, this panel is the right
                        place to render the dressed result.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#5A0F1C]/10 p-5">
                  <h3 className="text-lg font-semibold text-[#5A0F1C]">
                    What users can do right now
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <p>1. Use the front camera for a quick live preview.</p>
                    <p>2. Upload an existing photo from mobile or desktop.</p>
                    <p>3. Compare their image with the exact saree selection.</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-[#111111] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                    Next Upgrade
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    AI drape simulation / AR mirror
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    For real body-mapped try-on, you will need a dedicated model
                    or API. I can wire this page to that service once you pick
                    the provider.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#FFF8E6] to-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E2437]">
              Wear Preview
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#5A0F1C]">
              How this saree looks when worn
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              This section highlights the exact saree the customer is viewing,
              so they can imagine the drape, styling mood, and occasion fit.
            </p>

            <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-white shadow-lg">
              <div className="relative aspect-[4/5]">
                <Image
                  src={images[currentImg]}
                  alt={`${product.name} wear preview`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-contain"
                />
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold text-[#5A0F1C]">
                    Styled in {product.color || "signature tones"}
                  </h3>
                  <span className="rounded-full bg-[#5A0F1C]/10 px-3 py-1 text-xs font-medium text-[#5A0F1C]">
                    {product.category}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  Designed for {product.category?.toLowerCase() || "special"}{" "}
                  occasions, this piece works best with a polished blouse,
                  statement earrings, and a clean drape that keeps the fabric in
                  focus.
                </p>

                <div className="grid gap-3 rounded-2xl bg-[#FAF6F0] p-4 text-sm text-gray-700">
                  <p>Best lighting: soft daylight or warm indoor lighting.</p>
                  <p>Best angle: full front or slight side pose.</p>
                  <p>Best styling note: keep the pallu visible for impact.</p>
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

      {showCameraPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E2437]">
              Camera Permission
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#5A0F1C]">
              Allow camera access
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              After you continue, your browser will show the real camera
              permission popup. Click <span className="font-medium">Allow</span>{" "}
              to open the front camera for virtual preview.
            </p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowCameraPrompt(false)}
                className="flex-1 rounded-full border py-3"
              >
                Cancel
              </button>
              <button
                onClick={requestCameraAccess}
                className="flex-1 rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-3 text-white"
              >
                Continue
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
