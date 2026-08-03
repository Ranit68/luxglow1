import { getRazorpayCredentialsError, verifyRazorpaySignature } from "@/lib/razorpay";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { createOrderWithStockReservationAdmin } from "@/lib/orderStockAdmin";
import { StockError } from "@/lib/orderStock";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const credentialsError = getRazorpayCredentialsError();

    if (credentialsError) {
      return Response.json({ verified: false, error: credentialsError }, { status: 503 });
    }

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      expectedOrderRef,
      expectedAmount,
      address,
      items,
      userId,
      userEmail,
    } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return Response.json(
        { verified: false, error: "Razorpay payment details are incomplete." },
        { status: 400 }
      );
    }

    if (!verifyRazorpaySignature({ orderId, paymentId, signature })) {
      return Response.json(
        { verified: false, error: "Razorpay payment signature mismatch." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(expectedAmount || 0) * 100);
    if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
      return Response.json(
        { verified: false, error: "Invalid checkout amount." },
        { status: 400 }
      );
    }

    const orderRef = String(expectedOrderRef || "").trim();
    if (!orderRef) {
      return Response.json({ verified: false, error: "Order reference is missing." }, { status: 400 });
    }

    await createOrderWithStockReservationAdmin(getAdminDb(), orderRef, {
      orderRef,
      userId: userId || "",
      userEmail: userEmail || "",
      address: address || null,
      items: Array.isArray(items) ? items : [],
      total: Number(expectedAmount || 0),
      status: "Confirmed",
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      createdAt: new Date().toISOString(),
    });

    return Response.json({
      verified: true,
      orderRef,
    });
  } catch (error) {
    const status = error instanceof StockError ? 409 : 500;
    return Response.json(
      { verified: false, error: error.message || "Could not verify Razorpay payment." },
      { status }
    );
  }
}
