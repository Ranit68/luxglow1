"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
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
  ExternalLink,
  Gift,
  Megaphone,
  Send,
  Star,
  MessageSquare,
  Trash2,
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
              You&apos;re requesting a return for order{" "}
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

function SocialProofSection({ order, userId }) {
  const [socialUrl, setSocialUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [proof, setProof] = useState(null);
  const [proofLoading, setProofLoading] = useState(true);

  useEffect(() => {
    if (!userId || !order.id) return;
    const docId = `${userId}_${order.id}`;
    const unsub = onSnapshot(doc(db, "socialProofs", docId), (snap) => {
      setProof(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setProofLoading(false);
    }, () => setProofLoading(false));
    return unsub;
  }, [userId, order.id]);

  const isDelivered = String(order.status || "").toLowerCase().includes("deliver");
  if (!isDelivered) return null;

  const handleSubmit = async () => {
    const url = socialUrl.trim();
    if (!url) { setError("Please paste your post URL."); return; }
    if (!url.includes("instagram.com") && !url.includes("facebook.com") && !url.includes("fb.com") && !url.includes("meesho.com") && !url.includes("flipkart.com")) {
      setError("Please enter a valid Instagram, Facebook, Meesho, or Flipkart URL.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const docId = `${userId}_${order.id}`;
      await setDoc(doc(db, "socialProofs", docId), {
        userId,
        orderId: order.id,
        orderTotal: order.total,
        socialUrl: url,
        status: "pending",
        couponCode: null,
        createdAt: new Date().toISOString(),
        reviewedAt: null,
      });
      setSocialUrl("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (proofLoading) return null;

  if (proof && proof.status === "approved" && proof.couponCode) {
    return (
      <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">
              Your post was verified! Here&apos;s your reward:
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-lg border border-dashed border-[#7A1C2B] bg-white px-4 py-2 font-mono text-lg font-bold tracking-wider text-[#7A1C2B]">
                {proof.couponCode}
              </span>
              <a
                href={proof.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-700 underline"
              >
                Your post <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-2 text-xs text-green-700">
              Apply this code at checkout for a discount on your next order. This code is private and only visible to you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (proof && proof.status === "pending") {
    return (
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Megaphone className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Post submitted — under review</p>
            <p className="mt-1 text-xs text-amber-700">
              We&apos;ll verify your post and send you a discount code soon. Check back here for updates.
            </p>
            <a
              href={proof.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700 underline"
            >
              View your post <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (proof && proof.status === "rejected") {
    return (
      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <p className="text-sm font-semibold text-red-700">Post not eligible</p>
        <p className="mt-1 text-xs text-red-600">
          Your submitted post didn&apos;t meet the requirements. Please share a photo wearing the saree and tag @luxeglow161, then try again.
        </p>
        <button
          onClick={() => setProof(null)}
          className="mt-2 text-xs font-semibold text-red-700 underline"
        >
          Submit a new post
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#C7893C]/30 bg-[#FBF3E7] px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7A1C2B] text-white">
          <Gift className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#24110D]">Share your look, earn a discount</p>
          <p className="mt-1 text-xs leading-5 text-[#6F6258]">
            Post a story, reel, or photo on Instagram or Facebook wearing this saree,
            tag <span className="font-semibold">@luxeglow161</span>, and paste the link below.
            We&apos;ll send you a coupon code worth up to 50% off your next order.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={socialUrl}
              onChange={(e) => { setSocialUrl(e.target.value); setError(""); }}
              placeholder="Paste your Instagram / Facebook post URL"
              className="flex-1 rounded-xl border border-[#D9C6BA] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#7A1C2B]"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !socialUrl.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1C2B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5A0F1C] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ item, existing, userId, userName, onClose }) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [comment, setComment] = useState(existing?.comment || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const saveReview = async () => {
    setError("");
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short review.");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "reviews", `${userId}_${item.id}`), {
        userId,
        userName: userName || "Luxe&Glow customer",
        productId: item.id,
        productName: item.name,
        productImage: item.imageUrl || "",
        rating,
        comment: comment.trim(),
        orderId: existing?.orderId || null,
        verified: true,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setDone(true);
      setTimeout(onClose, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async () => {
    setSaving(true);
    try {
      await deleteDoc(doc(db, "reviews", existing.id));
      setDone(true);
      setTimeout(onClose, 800);
    } catch {
      setError("Could not delete your review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#7A1C2B] px-6 py-4">
          <p className="text-sm font-semibold text-white">
            {existing ? "Edit your review" : "Rate & Review"}
          </p>
          <button
            type="button"
            aria-label="Close review"
            onClick={onClose}
            className="text-white/80 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0E8DE]">
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
                {existing ? "You can update or delete this review." : "Share your experience with this saree."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                onClick={() => setRating(star)}
                className="text-3xl transition hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-[#E8A33C] text-[#E8A33C]"
                      : "fill-[#E5D9C9] text-[#E5D9C9]"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs font-medium text-[#7A6B5F]">
            {rating === 0
              ? "Tap a star to rate"
              : rating <= 2
              ? "Poor"
              : rating === 3
              ? "Average"
              : rating === 4
              ? "Good"
              : "Excellent"}
          </p>

          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError("");
            }}
            placeholder="How was the fabric, color, and fit? What did you use this saree for?"
            className="mt-5 min-h-28 w-full resize-none rounded-2xl border border-[#D9C6BA] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7A1C2B]"
          />

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {done && (
            <p className="mt-2 text-center text-xs font-semibold text-green-700">
              {existing ? "Review updated. Thank you!" : "Review published. Thank you!"}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            {existing && (
              <button
                type="button"
                onClick={deleteReview}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {saving && done ? "Deleting..." : "Delete"}
              </button>
            )}
            <button
              type="button"
              onClick={saveReview}
              disabled={saving}
              className="flex-1 rounded-full bg-[#7A1C2B] py-2.5 text-sm font-semibold text-white transition hover:bg-[#5A0F1C] disabled:opacity-50"
            >
              {saving ? "Saving..." : existing ? "Update Review" : "Publish Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemReviewRow({ item, existing, onOpen }) {
  if (!existing) {
    return (
      <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-[#FBF5EE] px-4 py-3">
        <p className="min-w-0 text-xs text-[#6F6258]">
          How was this saree? Share your experience.
        </p>
        <button
          onClick={onOpen}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#C7893C] bg-white px-4 py-2 text-xs font-semibold text-[#7A1C2B] transition hover:bg-[#7A1C2B] hover:text-white"
        >
          <Star className="h-3.5 w-3.5" />
          Rate &amp; Review
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-green-50 px-4 py-3">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-semibold text-[#24110D]">
          <span className="text-[#C7893C]">
            {"★".repeat(existing.rating)}
            {"☆".repeat(5 - existing.rating)}
          </span>
          Your review
          {existing.verified && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-800">
              Verified purchase
            </span>
          )}
        </p>
        {existing.comment && (
          <p className="mt-1 line-clamp-2 text-xs text-[#5F7A52]">{existing.comment}</p>
        )}
      </div>
      <button
        onClick={onOpen}
        className="shrink-0 text-xs font-semibold text-[#7A1C2B] underline"
      >
        Edit
      </button>
    </div>
  );
}

function OrderCard({ order, userId, myReviews, userName }) {
  const shipped = order.shipment?.awb || order.shipment?.waybill;
  const displayAwb = order.shipment?.awb || order.shipment?.waybill;
  const scanStatus = order.shipment?.status;
  const isDelivered = String(order.status || "").toLowerCase().includes("deliver");
  const [reviewItem, setReviewItem] = useState(null);

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
            <div key={index}>
              <div className="flex items-center justify-between gap-4">
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
              {isDelivered && item.id && (
                <ItemReviewRow
                  item={item}
                  existing={myReviews.get(item.id)}
                  onOpen={() => setReviewItem(item)}
                />
              )}
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

        <SocialProofSection order={order} userId={userId} />
      </div>

      {reviewItem && (
        <ReviewModal
          item={reviewItem}
          existing={myReviews.get(reviewItem.id)}
          userId={userId}
          userName={userName}
          onClose={() => setReviewItem(null)}
        />
      )}
    </article>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { savedProducts } = useSavedProducts();
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [myReviews, setMyReviews] = useState(new Map());
  const [editReviewProductId, setEditReviewProductId] = useState(null);

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

  useEffect(() => {
    if (!user) return;

    const reviewsQuery = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const map = new Map();
        for (const d of snapshot.docs) {
          map.set(d.data().productId, { id: d.id, ...d.data() });
        }
        setMyReviews(map);
      },
      () => setMyReviews(new Map())
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
                tag @luxeglow161, and we&apos;ll send you a discount code worth up to 50% off.
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
              <OrderCard
                key={order.id}
                order={order}
                userId={user.uid}
                myReviews={myReviews}
                userName={user.displayName}
              />
            ))}
          </div>
        )}

        {myReviews.size > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-semibold text-[#5A0F1C]">My Reviews</h2>
                <p className="mt-1 text-sm text-[#7A6B5F]">
                  Reviews you&apos;ve left on sarees you purchased.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from(myReviews.values()).map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-[#E7D8CC] bg-white p-5 shadow-[0_10px_30px_rgba(61,24,16,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0E8DE]">
                      {review.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.productImage}
                          alt={review.productName || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-5 w-5 text-[#A08D7D]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#24110D]">
                        {review.productName || "Product"}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-[#7A6B5F]">
                        <span className="text-[#C7893C]">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                        {formatDate(review.updatedAt || review.createdAt)}
                      </p>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5F5148]">
                      {review.comment}
                    </p>
                  )}
                  <button
                    onClick={() => setEditReviewProductId(review.productId)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C7893C] bg-white px-4 py-2 text-xs font-semibold text-[#7A1C2B] transition hover:bg-[#7A1C2B] hover:text-white"
                  >
                    <Star className="h-3.5 w-3.5" />
                    Edit Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {editReviewProductId && myReviews.has(editReviewProductId) && (
          <ReviewModal
            item={{
              id: myReviews.get(editReviewProductId).productId,
              name: myReviews.get(editReviewProductId).productName,
              imageUrl: myReviews.get(editReviewProductId).productImage,
            }}
            existing={myReviews.get(editReviewProductId)}
            userId={user.uid}
            userName={user.displayName}
            onClose={() => setEditReviewProductId(null)}
          />
        )}

        <p className="mt-10 text-center text-xs text-[#A08D7D]">
          Tracking updates automatically every day from Delhivery.
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
