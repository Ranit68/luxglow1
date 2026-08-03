import { createRazorpayOrder, getRazorpayConfig, getRazorpayCredentialsError } from "@/lib/razorpay";

export const runtime = "nodejs";

function sanitizeReference(value) {
  return String(value || `LG${Date.now()}`)
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 40);
}

export async function POST(req) {
  try {
    const credentialsError = getRazorpayCredentialsError();

    if (credentialsError) {
      return Response.json({ error: credentialsError }, { status: 503 });
    }

    const {
      amount,
      currency = "INR",
      orderRef,
      buyerName,
      email,
      phone,
    } = await req.json();

    const amountInPaise = Math.round(Number(amount) * 100);

    if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
      return Response.json(
        { error: "Razorpay payment amount must be at least Rs. 1." },
        { status: 400 }
      );
    }

    if (!orderRef) {
      return Response.json({ error: "Order reference is required." }, { status: 400 });
    }

    const receipt = sanitizeReference(orderRef);
    const order = await createRazorpayOrder({
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        orderRef: receipt,
      },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: getRazorpayConfig().keyId,
      status: order.status,
    });
  } catch (error) {
    const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;

    return Response.json(
      {
        error:
          error?.error?.description ||
          error.message ||
          "Could not initialize Razorpay checkout.",
      },
      { status }
    );
  }
}
