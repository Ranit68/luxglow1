"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import AuthPromptModal from "@/components/AuthPromptModal";
import CouponPanel, { clearStoredCoupon } from "@/components/CouponPanel";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { getAvailableStock, isOutOfStock } from "@/lib/productStock";

const PAYMENT_METHODS = {
  cod: "Cash on Delivery",
  razorpay: "Razorpay",
};

const createEmptyForm = () => ({
  name: "",
  phone: "",
  line1: "",
  line2: "",
  pincode: "",
  city: "",
  district: "",
  state: "",
  codAvailable: true,
});

function getDraftStorageKey(userId) {
  return `checkout:draft:${userId}`;
}

function createOrderRef() {
  return `LG${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 30)
    .toUpperCase();
}

function loadRazorpayCheckoutScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Your browser is not available for secure checkout."));
      return;
    }

    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout at the moment."));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [orderError, setOrderError] = useState("");
  const [deliveryLookupError, setDeliveryLookupError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [form, setForm] = useState(createEmptyForm());
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;
  const shippingCharge = 0;
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "fixed"
      ? Math.min(appliedCoupon.computedDiscount || 0, subtotal)
      : appliedCoupon.computedDiscount || 0
    : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCharge);

  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      const snapshot = await getDocs(collection(db, "users", user.uid, "addresses"));
      setAddresses(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    };

    fetchAddresses();
  }, [user]);

  const fetchLocation = async (pin) => {
    if (pin.length !== 6) {
      setDeliveryLookupError("");
      return;
    }

    setDeliveryLookupError("");

    try {
      const response = await fetch("/api/check-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: pin }),
      });

      const data = await response.json();

      if (!response.ok || !data.serviceable) {
        setDeliveryLookupError(data.error || "This pincode is not serviceable.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        city: data.city,
        district: data.district,
        state: data.state || "",
        codAvailable: data.cod !== false,
      }));
    } catch {
      setDeliveryLookupError("Could not verify this pincode right now.");
    }
  };

  const validateAddressForm = () => {
    if (!form.name.trim()) return "Enter full name";
    if (!/^[0-9]{10}$/.test(form.phone)) return "Enter valid 10 digit phone number";
    if (!form.line1.trim()) return "Enter Address Line 1";
    if (!/^[0-9]{6}$/.test(form.pincode)) return "Enter valid 6 digit pincode";
    if (!form.city) return "Enter a serviceable pincode";
    if (addresses.length >= 3) return "Maximum 3 addresses allowed";
    return "";
  };

  const saveAddress = async () => {
    const validationError = validateAddressForm();
    setFormSuccess("");
    setFormError(validationError);

    if (validationError) {
      return;
    }

    setAddressSaving(true);

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
      };
      const docRef = await addDoc(collection(db, "users", user.uid, "addresses"), payload);
      setAddresses((prev) => [...prev, { id: docRef.id, ...payload }]);
      setForm(createEmptyForm());
      setDeliveryLookupError("");
      setFormSuccess("Address saved successfully.");
      setFormError("");
    } catch {
      setFormError("Failed to save address. Please try again.");
    }

    setAddressSaving(false);
  };

  const deleteAddress = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    setAddresses((prev) => prev.filter((address) => address.id !== id));

    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  const validateCheckout = () => {
    if (!selectedAddress) {
      return "Select a delivery address before placing the order.";
    }

    const unavailableItem = cart.find((item) => {
      const stock = getAvailableStock(item);
      return isOutOfStock(item) || (stock !== null && item.qty > stock);
    });

    if (unavailableItem) {
      return `${unavailableItem.name || "A product"} is out of stock or above available quantity. Please update your cart.`;
    }

    if (paymentMethod === "cod" && selectedAddress.codAvailable === false) {
      return "Cash on Delivery is not available for this pincode. Please choose Razorpay or another address.";
    }

    return "";
  };

  const createCodOrder = async () => {
    const orderRef = createOrderRef();

    const response = await fetch("/api/orders/cod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderRef,
        userId: user.uid,
        userEmail: user.email || "",
        address: selectedAddress,
        items: cart,
        total,
        paymentMethod: PAYMENT_METHODS.cod,
        paymentStatus: "Pending",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || "Could not place your COD order.");
    }

    clearCart();
    router.push(`/checkout/status?status=success&orderRef=${orderRef}`);
  };

  const startRazorpayPayment = async () => {
    const orderRef = createOrderRef();
    const draft = {
      orderRef,
      userId: user.uid,
      userEmail: user.email || "",
      address: selectedAddress,
      items: cart,
      total,
      paymentMethod: PAYMENT_METHODS.razorpay,
      createdAt: Date.now(),
    };

    localStorage.setItem(getDraftStorageKey(user.uid), JSON.stringify(draft));

    const response = await fetch("/api/payments/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        currency: "INR",
        orderRef,
        buyerName: selectedAddress.name,
        email: user.email || "",
        phone: selectedAddress.phone,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.orderId) {
      throw new Error(data.error || "Could not initialize Razorpay checkout.");
    }

    await loadRazorpayCheckoutScript();

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Luxe&Glow",
      description: `Order ${data.receipt}`,
      order_id: data.orderId,
      prefill: {
        name: selectedAddress.name,
        email: user.email || "",
        contact: selectedAddress.phone,
      },
      theme: {
        color: "#5A0F1C",
      },
      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              expectedOrderRef: orderRef,
              expectedAmount: total,
              address: selectedAddress,
              items: cart,
              userId: user.uid,
              userEmail: user.email || "",
            }),
          });

          const verifyData = await verifyResponse.json().catch(() => null);

          if (!verifyResponse.ok || !verifyData?.verified) {
            localStorage.removeItem(getDraftStorageKey(user.uid));
            router.replace(
              `/checkout/status?status=failed&orderRef=${encodeURIComponent(orderRef)}&message=${encodeURIComponent(
                verifyData?.error || "Payment verification failed."
              )}`
            );
            return;
          }

          clearCart();
          localStorage.removeItem(getDraftStorageKey(user.uid));
          clearStoredCoupon();
          router.replace(
            `/checkout/status?status=success&orderRef=${encodeURIComponent(orderRef)}&payment_id=${encodeURIComponent(
              paymentResponse.razorpay_payment_id
            )}`
          );
        } catch (error) {
          localStorage.removeItem(getDraftStorageKey(user.uid));
          router.replace(
            `/checkout/status?status=failed&orderRef=${encodeURIComponent(orderRef)}&message=${encodeURIComponent(
              error instanceof Error ? error.message : "Could not finish payment confirmation."
            )}`
          );
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          setOrderError("Payment was cancelled. You can try again.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
  };

  const placeOrder = async () => {
    setOrderError("");
    const validationError = validateCheckout();

    if (validationError) {
      setOrderError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        await createCodOrder();
        return;
      }

      await startRazorpayPayment();
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "Failed to continue checkout. Please try again."
      );
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <main className="min-h-screen bg-gradient-to-b from-[#F8F6F3] to-white px-4 pt-24 md:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_60px_rgba(62,25,18,0.10)] md:p-14">
            <h1 className="text-4xl font-semibold text-[#3E0E18]">Checkout requires an account</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5B4038]">
              Login or register to save delivery addresses, place orders, and keep your purchase history attached to your profile.
            </p>
            <button
              onClick={() => setShowAuthPrompt(true)}
              className="mt-8 rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] px-8 py-4 text-sm font-medium text-white"
            >
              Login to continue
            </button>
          </div>
        </main>

        <AuthPromptModal
          action="buy"
          open={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          redirect="/checkout"
          title="Login to access checkout"
          description="Checkout and address saving are available only after authentication."
        />
      </>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-28">
        <h1 className="mb-4 text-3xl">Your cart is empty</h1>
        <button onClick={() => router.push("/shop")} className="text-[#5A0F1C] underline">
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#F8F6F3] to-white px-4 pt-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 py-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8E2437]">
                Authenticated Checkout
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#3E0E18] md:text-4xl">
                Secure Checkout
              </h1>
              <p className="mt-3 text-sm text-[#6B4A42]">
                Name, phone, and delivery address will be saved for order confirmation and Delhivery shipment processing.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#5A0F1C]">Delivery Address</h2>

              <div className="space-y-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`cursor-pointer rounded-2xl border p-5 transition ${
                        isSelected
                          ? "border-[#5A0F1C] bg-[#5A0F1C]/5 shadow-md"
                          : "border-gray-200 hover:border-[#5A0F1C]/40"
                      }`}
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-semibold">{addr.name}</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.city}, {addr.district}
                            {addr.state ? `, ${addr.state}` : ""} - {addr.pincode}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">Phone: {addr.phone}</p>
                          {addr.codAvailable === false && (
                            <p className="mt-2 text-xs font-medium text-amber-700">
                              COD is not available for this pincode.
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteAddress(addr.id);
                          }}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 border-t pt-8">
                <h3 className="mb-4 text-lg font-semibold">Add New Address</h3>

                {(formError || formSuccess || deliveryLookupError) && (
                  <div className="mb-4 space-y-2 text-sm">
                    {formError && <p className="text-red-600">{formError}</p>}
                    {deliveryLookupError && <p className="text-red-600">{deliveryLookupError}</p>}
                    {formSuccess && <p className="text-green-600">{formSuccess}</p>}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Full Name"
                    className="input-modern"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                  <input
                    placeholder="Phone"
                    className="input-modern"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  />
                  <input
                    placeholder="Address Line 1"
                    className="input-modern md:col-span-2"
                    value={form.line1}
                    onChange={(event) => setForm({ ...form, line1: event.target.value })}
                  />
                  <input
                    placeholder="Address Line 2"
                    className="input-modern md:col-span-2"
                    value={form.line2}
                    onChange={(event) => setForm({ ...form, line2: event.target.value })}
                  />
                  <input
                    placeholder="Pincode"
                    className="input-modern"
                    value={form.pincode}
                    onChange={(event) => {
                      setForm({ ...form, pincode: event.target.value });
                      fetchLocation(event.target.value);
                    }}
                  />
                  <input value={form.city} disabled placeholder="City" className="input-modern bg-gray-100" />
                  <input
                    value={form.district}
                    disabled
                    placeholder="District"
                    className="input-modern bg-gray-100"
                  />
                  <input value={form.state} disabled placeholder="State" className="input-modern bg-gray-100" />
                </div>

                <button
                  onClick={saveAddress}
                  disabled={addressSaving}
                  className="mt-6 rounded-full bg-[#5A0F1C] px-8 py-3 text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {addressSaving ? "Saving Address..." : "Save Address"}
                </button>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-3xl border bg-white p-8 shadow-xl lg:sticky lg:top-28">
            <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>Rs. {item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="my-6 border-t" />

            <CouponPanel subtotal={subtotal} onCouponChange={setAppliedCoupon} />

            <div className="mt-4 rounded-2xl bg-[#F8F6F3] px-4 py-4 text-sm text-[#5A0F1C]">
              <p className="font-medium">Choose Payment Method</p>
              <div className="mt-4 grid gap-3">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-[#5A0F1C] bg-white shadow-sm"
                      : "border-transparent bg-white/60"
                  }`}
                >
                  <p className="font-semibold">{PAYMENT_METHODS.cod}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Order is created immediately with payment pending for delivery.
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    paymentMethod === "razorpay"
                      ? "border-[#5A0F1C] bg-white shadow-sm"
                      : "border-transparent bg-white/60"
                  }`}
                >
                  <p className="font-semibold">{PAYMENT_METHODS.razorpay}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Pay securely with cards, UPI, wallets, and net banking via Razorpay.
                  </p>
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#5B4038]">
              <div className="flex justify-between">
                <span>MRP</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-emerald-600">- Rs. {discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shippingCharge === 0 ? "text-emerald-600" : ""}>
                  {shippingCharge === 0 ? "Free" : `Rs. ${shippingCharge}`}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-lg font-medium">
              <span>Total</span>
              <span className="font-bold text-[#5A0F1C]">Rs. {total}</span>
            </div>

            {orderError && <p className="mt-4 text-sm text-red-600">{orderError}</p>}

            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-8 w-full rounded-full bg-[#5A0F1C] py-4 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? paymentMethod === "razorpay"
                  ? "Preparing secure payment..."
                  : "Placing COD Order..."
                : paymentMethod === "razorpay"
                  ? "Pay with Razorpay"
                  : "Place COD Order"}
            </button>

            <p className="mt-6 text-center text-xs text-gray-500">
              Secure checkout with account-linked address, payment verification, and order history.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
