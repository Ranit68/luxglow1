import { getRazorpayCredentialsError, verifyPaymentLinkSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const credentialsError = getRazorpayCredentialsError();

    if (credentialsError) {
      return Response.json({ verified: false, error: credentialsError }, { status: 503 });
    }

    const {
      razorpay_payment_id: paymentId,
      razorpay_payment_link_id: paymentLinkId,
      razorpay_payment_link_reference_id: paymentLinkReferenceId,
      razorpay_payment_link_status: paymentLinkStatus,
      razorpay_signature: signature,
      expectedOrderRef,
    } = await req.json();

    const missingFields = [];
    if (!paymentId) missingFields.push("razorpay_payment_id");
    if (!paymentLinkId) missingFields.push("razorpay_payment_link_id");
    if (!paymentLinkReferenceId) missingFields.push("razorpay_payment_link_reference_id");
    if (!paymentLinkStatus) missingFields.push("razorpay_payment_link_status");
    if (!signature) missingFields.push("razorpay_signature");

    if (missingFields.length) {
      return Response.json(
        {
          verified: false,
          error: `Razorpay callback details are incomplete: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (expectedOrderRef && paymentLinkReferenceId !== expectedOrderRef) {
      return Response.json(
        { verified: false, error: "Razorpay order reference does not match this checkout." },
        { status: 400 }
      );
    }

    if (paymentLinkStatus !== "paid") {
      return Response.json(
        { verified: false, error: "Razorpay has not marked this payment link as paid." },
        { status: 400 }
      );
    }

    const verified = verifyPaymentLinkSignature({
      paymentLinkId,
      paymentLinkReferenceId,
      paymentLinkStatus,
      paymentId,
      signature,
    });

    if (!verified) {
      return Response.json(
        { verified: false, error: "Razorpay payment signature mismatch." },
        { status: 400 }
      );
    }

    return Response.json({ verified: true });
  } catch (error) {
    return Response.json(
      { verified: false, error: error.message || "Could not verify Razorpay payment." },
      { status: 500 }
    );
  }
}
