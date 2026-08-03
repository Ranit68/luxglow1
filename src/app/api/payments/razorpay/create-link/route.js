import {
  buildRazorpayCallbackUrl,
  createRazorpayPaymentLink,
  getRazorpayConfig,
  getRazorpayCredentialsError,
} from "@/lib/razorpay";

export const runtime = "nodejs";

function sanitizeReference(value) {
  return String(value || `LG${Date.now()}`)
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 40);
}

function getRequestOrigin(req) {
  try {
    const requestUrl = new URL(req.url);
    return requestUrl.origin;
  } catch (error) {
    const host = req.headers.get("host");
    if (!host) {
      return "";
    }

    const forwardedProto = req.headers.get("x-forwarded-proto");
    const protocol = forwardedProto ? forwardedProto.split(",")[0].trim() : "http";
    return `${protocol}://${host}`;
  }
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

    const referenceId = sanitizeReference(orderRef);
    const requestOrigin =
      !process.env.RAZORPAY_CALLBACK_URL && !process.env.NEXT_PUBLIC_APP_URL
        ? getRequestOrigin(req) || getRazorpayConfig().appUrl
        : undefined;

    const callbackUrl = buildRazorpayCallbackUrl(referenceId, {
      appUrlOverride: requestOrigin,
    });

    const paymentLink = await createRazorpayPaymentLink({
      amount: amountInPaise,
      currency,
      reference_id: referenceId,
      description: `Luxe&Glow order ${referenceId}`,
      customer: {
        name: String(buyerName || "").trim(),
        email: String(email || "").trim(),
        contact: String(phone || "").trim(),
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: false,
      callback_url: callbackUrl,
      callback_method: "get",
      notes: {
        orderRef: referenceId,
      },
    });

    return Response.json({
      paymentLinkId: paymentLink.id,
      paymentUrl: paymentLink.short_url,
      amount: paymentLink.amount,
      currency: paymentLink.currency,
      referenceId: paymentLink.reference_id,
      status: paymentLink.status,
      callbackUrl,
    });
  } catch (error) {
    const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;

    return Response.json(
      {
        error:
          error?.error?.description ||
          error.message ||
          "Could not create Razorpay payment link.",
      },
      { status }
    );
  }
}
