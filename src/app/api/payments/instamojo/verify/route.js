import { getInstamojoCredentialsError, getPaymentDetails } from "@/lib/instamojo";

function toFixedAmount(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : "";
}

export async function POST(req) {
  try {
    const credentialsError = getInstamojoCredentialsError();

    if (credentialsError) {
      return Response.json({ error: credentialsError }, { status: 503 });
    }

    const {
      paymentRequestId,
      paymentId,
      expectedAmount,
      expectedOrderRef,
      expectedEmail,
      expectedPhone,
    } = await req.json();

    if (!paymentRequestId || !paymentId) {
      return Response.json(
        { verified: false, error: "Payment request ID and payment ID are required." },
        { status: 400 }
      );
    }

    const data = await getPaymentDetails(paymentRequestId, paymentId);
    const payment = data.payment || {};
    const paymentRequest = data.payment_request || {};

    const normalizedAmount = toFixedAmount(payment.amount || paymentRequest.amount);
    const normalizedExpectedAmount = toFixedAmount(expectedAmount);
    const normalizedPurpose = paymentRequest.purpose || payment.purpose || "";
    const normalizedEmail = String(payment.buyer || payment.email || "").trim().toLowerCase();
    const normalizedPhone = String(payment.phone || payment.buyer_phone || "").trim();

    const amountMatches =
      !normalizedExpectedAmount || normalizedAmount === normalizedExpectedAmount;
    const purposeMatches = !expectedOrderRef || normalizedPurpose === expectedOrderRef;
    const emailMatches =
      !expectedEmail || normalizedEmail === String(expectedEmail).trim().toLowerCase();
    const phoneMatches = !expectedPhone || normalizedPhone === String(expectedPhone).trim();
    const isCredit = payment.status === "Credit";

    return Response.json({
      verified: isCredit && amountMatches && purposeMatches && emailMatches && phoneMatches,
      status: payment.status || "Unknown",
      payment,
      paymentRequest,
      checks: {
        amountMatches,
        purposeMatches,
        emailMatches,
        phoneMatches,
      },
    });
  } catch (error) {
    return Response.json(
      { verified: false, error: error.message || "Could not verify payment." },
      { status: 500 }
    );
  }
}
