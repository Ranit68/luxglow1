"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";

const statusContent = {
  success: {
    eyebrow: "Order Confirmed",
    title: "Payment received successfully",
    description:
      "Your order is confirmed and we will prepare it for shipping. You can continue shopping or return to the home page.",
    panelClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  failed: {
    eyebrow: "Payment Failed",
    title: "We could not confirm your payment",
    description:
      "No paid order is created unless Instamojo confirms the payment. You can return to shopping and try again.",
    panelClass: "border-rose-200 bg-rose-50 text-rose-900",
  },
  pending: {
    eyebrow: "Verifying Payment",
    title: "We are checking your payment status",
    description:
      "Please wait while we verify the payment and create your order. Do not close this page yet.",
    panelClass: "border-amber-200 bg-amber-50 text-amber-900",
  },
};

function getDraftStorageKey(userId) {
  return `checkout:draft:${userId}`;
}

export default function CheckoutStatusPage() {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const [statusKey, setStatusKey] = useState(
    statusContent[statusParam] ? statusParam : "pending"
  );
  const [message, setMessage] = useState("");
  const [createdOrderRef, setCreatedOrderRef] = useState(
    searchParams.get("orderRef") || ""
  );
  const paymentRequestId = searchParams.get("payment_request_id");
  const paymentId = searchParams.get("payment_id");
  const paymentStatus = searchParams.get("payment_status");
  const hasFinalizedPayment = useRef(false);

  useEffect(() => {
    const finalizeInstamojoOrder = async () => {
      if (!paymentRequestId || !paymentId) {
        return;
      }

      if (hasFinalizedPayment.current) {
        return;
      }

      hasFinalizedPayment.current = true;

      if (!user) {
        setStatusKey("failed");
        setMessage("Please log in again to finish order confirmation.");
        return;
      }

      const rawDraft = localStorage.getItem(getDraftStorageKey(user.uid));

      if (!rawDraft) {
        setStatusKey("failed");
        setMessage("Payment was received, but the checkout draft is missing on this device.");
        return;
      }

      const draft = JSON.parse(rawDraft);

      if (paymentStatus && paymentStatus !== "Credit") {
        setStatusKey("failed");
        setMessage("Instamojo reported that this payment was not successful.");
        return;
      }

      const verifyResponse = await fetch("/api/payments/instamojo/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentRequestId,
          paymentId,
          expectedAmount: draft.total,
          expectedOrderRef: draft.orderRef,
          expectedEmail: draft.userEmail,
          expectedPhone: draft.address?.phone,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.verified) {
        setStatusKey("failed");
        setMessage(verifyData.error || "Payment verification failed.");
        return;
      }

      const existingOrderQuery = query(
        collection(db, "orders"),
        where("paymentRequestId", "==", paymentRequestId),
        limit(1)
      );
      const existingOrderSnapshot = await getDocs(existingOrderQuery);

      if (!existingOrderSnapshot.empty) {
        const existingOrder = existingOrderSnapshot.docs[0].data();
        setCreatedOrderRef(existingOrder.orderRef || draft.orderRef || "");
        setStatusKey("success");
        setMessage("Your order was already confirmed.");
        clearCart();
        localStorage.removeItem(getDraftStorageKey(user.uid));
        return;
      }

      await addDoc(collection(db, "orders"), {
        orderRef: draft.orderRef,
        userId: user.uid,
        userEmail: draft.userEmail || "",
        address: draft.address,
        items: draft.items,
        total: draft.total,
        status: "Confirmed",
        paymentMethod: "Instamojo",
        paymentStatus: "Paid",
        paymentId,
        paymentRequestId,
        createdAt: Timestamp.now(),
      });

      setCreatedOrderRef(draft.orderRef || "");
      setStatusKey("success");
      setMessage("Your order has been confirmed and recorded successfully.");
      clearCart();
      localStorage.removeItem(getDraftStorageKey(user.uid));
    };

    finalizeInstamojoOrder().catch(() => {
      setStatusKey("failed");
      setMessage("We could not finish payment confirmation. Please contact support if money was debited.");
    });
  }, [clearCart, paymentId, paymentRequestId, paymentStatus, user]);

  const content = statusContent[statusKey] || statusContent.pending;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F6F3] to-white px-4 pt-28 md:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#E8D5C4] bg-white p-8 shadow-[0_24px_60px_rgba(62,25,18,0.10)] md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8E2437]">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[#3E0E18] md:text-4xl">{content.title}</h1>
        <p className="mt-4 text-sm leading-7 text-[#5B4038]">{content.description}</p>

        <div className={`mt-8 rounded-3xl border p-5 text-sm ${content.panelClass}`}>
          <p>Status: {statusKey}</p>
          {createdOrderRef && <p className="mt-2">Order Ref: {createdOrderRef}</p>}
          {paymentRequestId && <p className="mt-2">Payment Request ID: {paymentRequestId}</p>}
          {paymentId && <p className="mt-2">Payment ID: {paymentId}</p>}
          {message && <p className="mt-2">{message}</p>}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full bg-[#5A0F1C] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Return Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-[#5A0F1C] px-6 py-3 text-sm font-semibold text-[#5A0F1C] transition hover:bg-[#5A0F1C] hover:text-white"
          >
            Buy More
          </Link>
        </div>
      </div>
    </main>
  );
}
