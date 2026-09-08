"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  MapPin,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Truck,
  X,
  ChevronRight,
  Check,
  Gift,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavedProducts } from "@/context/SavedProductsContext";
import { db } from "@/lib/firebase";
import {
  RETURN_WINDOW_DAYS,
  getReturnWindow,
  formatReturnCountdown,
  isReturnRequested,
} from "@/lib/returnWindow";
import { STEP_LABELS, orderStep, isTerminal } from "@/lib/orderStatus";

function formatDate(value) {
  if (!value) return null;
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return null;
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentMethodLabel(order) {
  return order.paymentMethod || "Not recorded";
}

function getPaymentStatusLabel(order) {
  if (order.paymentStatus) return order.paymentStatus;
  if (order.paymentMethod === "Cash on Delivery") return "Pending";
  return "Not recorded";
}

function statusBadgeClasses(order) {
  const status = String(order.status || "").toLowerCase();
  if (status.includes("deliver") || status.includes("return"))
    return "bg-green-100 text-green-800";
  if (status.includes("ship")) return "bg-blue-100 text-blue-800";
  if (status.includes("accept") || status.includes("confirm"))
    return "bg-amber-100 text-amber-800";
  if (status.includes("reject") || status.includes("cancel"))
    return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

function ScanStatusPill({ status }) {
  const s = status || "";
  let cls = "bg-stone-100 text-stone-600";
  if (s.toLowerCase().includes("deliver")) cls = "bg-green-100 text-green-800";
  else if (s.toLowerCase().includes("out for delivery")) cls = "bg-blue-100 text-blue-800";
  else if (s.toLowerCase().includes("transit")) cls = "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {s || "In Transit"}
    </span>
  );
}

function StatusStepper({ order }) {
  const step = orderStep(order);
  const isRejected = String(order.status || "").toLowerCase().includes("reject");
  const isCancelled = String(order.status || "").toLowerCase().includes("cancel");

  if (isRejected || isCancelled) {
    return (
      <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
        This order was {isRejected ? "rejected" : "cancelled"}.
      </div>
    );
  }

  return (
    <div>
      <ol className="flex items-center gap-1">
        {STEP_LABELS.map((label, index) => {
          const active = index === step;
          const done = index <= step;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                    done
                      ? active
                        ? "bg-[#7A1C2B] text-white ring-4 ring-[#7A1C2B]/15"
                        : "bg-[#C7893C] text-white"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {done && !active ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={`mt-2 hidden text-center text-[9px] font-semibold uppercase tracking-wide sm:block ${
                    done ? "text-[#5A0F1C]" : "text-stone-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <span
                  className={`mx-1 mb-6 h-0.5 flex-1 rounded ${
                    index < step ? "bg-[#C7893C]" : "bg-stone-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-[#5F5148]">
        Current status:{" "}
        <span className="font-semibold text-[#7A1C2B]">{order.status || "Pending"}</span>
      </p>
    </div>
  );
}

function TrackingTimeline({ shipment }) {
  const scans = Array.isArray(shipment?.scans) ? shipment.scans : [];
  const latest = scans[scans.length - 1];

  if (scans.length === 0) {
    return (
      <div className="rounded-2xl bg-stone-50 p-4 text-sm text-[#7A6B5F]">
        Tracking updates will appear here once the courier picks up your parcel.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="mb-2 flex items-center gap-2">
        <Truck className="h-4 w-4 text-[#C7893C]" />
        <ScanStatusPill status={latest?.statusText || latest?.status} />
        {latest?.location && (
          <span className="text-xs text-[#7A6B5F]">at {latest.location}</span>
        )}
      </div>
      <ol className="relative ml-3 border-l border-stone-200 pl-6">
        {[...scans].reverse().map((scan, index) => (
          <li key={index} className="relative pb-5 last:pb-0">
            <span
              className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${
                index === 0 ? "bg-[#7A1C2B]" : "bg-[#C7893C]"
              }`}
            />
            <p className="text-sm font-semibold text-[#24110D]">
              {scan.statusText || scan.status || "Update"}
            </p>
            <p className="mt-0.5 text-xs text-[#7A6B5F]">
              {scan.location ? `${scan.location} · ` : ""}
              {formatTime(scan.dateTime) || ""}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReturnSection({ order, userId }) {
  const windowInfo = getReturnWindow(order);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const requested = isReturnRequested(order);

  if (!windowInfo.delivered) return null;

  const submitReturn = async () => {
    setSubmitting(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/orders/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not request a return.");
        return;
      }
      setResult("Return requested successfully. Our team will contact you soon.");
      setOpen(false);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (requested) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
        <p className="font-semibold">Return requested</p>
        <p className="mt-1 text-xs text-amber-700">
          Our team will reach out to you to arrange the pickup.
        </p>
      </div>
    );
  }

  if (!windowInfo.withinWindow) return null;

  return (
    <div className="rounded-2xl border border-[#C7893C]/30 bg-[#FBF3E7] px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#24110D]">Eligible for return</p>
          <p className="mt-1 text-xs text-[#7A6B5F]">
            {RETURN_WINDOW_DAYS}-day return window.{" "}
            <span className="font-medium text-[#C7893C]">
              {formatReturnCountdown(windowInfo.remainingMs)}
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            setError("");
            setResult("");
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7A1C2B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5A0F1C]"
        >
          <RotateCcw className="h-4 w-4" />
          Return / Exchange
        </button>
      </div>

      {(error || result) && (
        <p className={`mt-3 text-xs ${error ? "text-red-600" : "text-green-700"}`}>
          {error || result}
        </p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="font-[var(--font-editorial)] text-xl font-semibold text-[#24110D]">
                Request a return
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:text-stone-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5F5148]">
              You're requesting a return for order{" "}
              <span className="font-semibold">#{order.id.slice(0, 10)}</span>. Please keep
              the saree unworn and in its original packaging for pickup.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-[#D8C4B8] py-3 text-sm font-semibold text-[#5A0F1C]"
              >
                Cancel
              </button>
              <button
                onClick={submitReturn}
                disabled={submitting}
                className="flex-1 rounded-full bg-[#7A1C2B] py-3 text-sm font-semibold text-white transition hover:bg-[#5A0F1C] disabled:opacity-50"
              >
                {submitting ? "Requesting..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, userId }) {
  const shipped = order.shipment?.awb || order.shipment?.waybill;
  const displayAwb = order.shipment?.awb || order.shipment?.waybill;
  const scanStatus = order.shipment?.status;

  return (
    <article className="overflow-hidden rounded-3xl border border-[#E7D8CC] bg-white shadow-[0_10px_30px_rgba(61,24,16,0.06)]">
      <div className="border-b border-[#F0E6DB] px-6 py-4 sm:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A08D7D]">
              Order ID
            </p>
            <p className="font-semibold text-[#24110D]">#{order.id.slice(0, 12)}</p>
          </div>
          <span
            className={`w-fit rounded-full px-4 py-1.5 text-xs font-semibold ${statusBadgeClasses(order)}`}
          >
            {order.status || "Pending"}
          </span>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {!isTerminal(order) && (
          <div className="mb-6">
            <StatusStepper order={order} />
          </div>
        )}

        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0E8DE]">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="h-5 w-5 text-[#A08D7D]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#24110D]">{item.name}</p>
                  <p className="mt-0.5 text-xs text-[#7A6B5F]">
                    Qty {item.qty} · ₹{item.price}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-semibold text-[#24110D]">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#E7D8CC] pt-4 text-sm">
          <span className="text-[#7A6B5F]">Order Total</span>
          <span className="text-lg font-bold text-[#5A0F1C]">₹{order.total}</span>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-[#5F5148] sm:grid-cols-2">
          <div className="rounded-2xl bg-[#FAF6F0] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A08D7D]">
              Payment
            </p>
            <p className="mt-2">
              {getPaymentMethodLabel(order)}{" "}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  String(getPaymentStatusLabel(order)).toLowerCase().includes("paid")
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {getPaymentStatusLabel(order)}
              </span>
            </p>
          </div>
          <div className="rounded-2xl bg-[#FAF6F0] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A08D7D]">
              Delivery Address
            </p>
            <p className="mt-2 flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A08D7D]" />
              <span>
                {order.address?.name ? `${order.address.name}, ` : ""}
                {order.address?.line1}, {order.address?.city} - {order.address?.pincode}
              </span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-[#A08D7D]">
          Ordered on {formatDate(order.createdAt)}
        </p>

        {shipped && (
          <div className="mt-6 rounded-2xl border border-[#E7D8CC] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#24110D]">
                <PackageCheck className="h-4 w-4 text-[#C7893C]" />
                Live Tracking
              </p>
              <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#7A6B5F]">
                AWB {displayAwb}
              </span>
            </div>
            <TrackingTimeline shipment={order.shipment} />
          </div>
        )}

        <div className="mt-6">
          <ReturnSection order={order} userId={userId} />
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { savedProducts } = useSavedProducts();
  const router = useRouter();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (user === null) router.push("/login?redirect=/profile");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        setOrders(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      },
      () => setOrders([])
    );

    return unsubscribe;
  }, [user]);

  const orderStats = useMemo(() => {
    if (!orders) return null;
    let shipped = 0;
    let inTransit = 0;
    let delivered = 0;
    let pending = 0;
    let returnable = 0;
    for (const o of orders) {
      const s = String(o.status || "").toLowerCase();
      if (s.includes("deliver") || s.includes("return")) {
        delivered += 1;
        if (getReturnWindow(o).withinWindow && !isReturnRequested(o)) returnable += 1;
      } else if (s.includes("ship")) {
        shipped += 1;
        inTransit += 1;
      } else {
        pending += 1;
      }
    }
    return { shipped, inTransit, delivered, pending, returnable, total: orders.length };
  }, [orders]);

  if (user === null) return null;

  if (orders === null) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-28">
        <p className="text-lg">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28 md:px-8">
      <div className="mx-auto max-w-5xl py-14">
        <div className="mb-10 flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-[#5A0F1C] to-[#7A1C2B] p-8 text-white shadow-xl md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-semibold text-white ring-2 ring-white/30">
              {user.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {user.displayName || "User"}
              </h1>
              <p className="text-sm text-white/70">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/saved"
              className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-medium transition hover:bg-white/20"
            >
              Saved Products ({savedProducts.length})
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#5A0F1C] transition hover:bg-[#F3EBE2]"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-6 rounded-3xl border border-[#C7893C]/30 bg-gradient-to-br from-[#FBF3E7] to-[#F3E3CC] p-7 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#7A1C2B] text-white">
              <Gift className="h-6 w-6" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C7893C]">
                <Megaphone className="h-3.5 w-3.5" />
                Your rewards
              </p>
              <h2 className="mt-1.5 text-xl font-semibold text-[#24110D]">
                Post your saree look &amp; get up to 50% OFF your next order
              </h2>
              <p className="mt-1 text-sm text-[#6F6258]">
                Received your saree? Share a photo wearing it on Instagram or Facebook,
                tag @luxeglow, and we&apos;ll send you a discount code worth up to 50% off.
                First order? Use code{" "}
                <span className="rounded border border-dashed border-[#7A1C2B] bg-white px-1.5 py-0.5 font-semibold text-[#7A1C2B]">
                  FIRST100
                </span>{" "}
                for ₹200 off.
              </p>
            </div>
          </div>
          <Link
            href="/offers"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#7A1C2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5A0F1C]"
          >
            See all offers
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold text-[#5A0F1C]">My Orders</h2>
            <p className="mt-1 text-sm text-[#7A6B5F]">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
          {orderStats && (
            <div className="flex flex-wrap gap-2">
              <StatPill label="In transit" value={orderStats.inTransit} />
              <StatPill label="Delivered" value={orderStats.delivered} />
              <StatPill label="Returnable" value={orderStats.returnable} />
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D8C4B8] bg-white p-16 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-[#C7893C]" />
            <h3 className="mt-4 text-2xl font-semibold text-[#24110D]">No orders yet</h3>
            <p className="mt-2 text-gray-500">Start shopping to see your orders here.</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7A1C2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5A0F1C]"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop sarees
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} userId={user.uid} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-[#A08D7D]">
          Tracking updates automatically every few minutes from Delhivery.
        </p>
      </div>
    </main>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-full border border-[#D8C4B8] bg-white px-4 py-2 text-xs">
      <span className="font-semibold text-[#5A0F1C]">{value}</span>{" "}
      <span className="text-[#7A6B5F]">{label}</span>
    </div>
  );
}
