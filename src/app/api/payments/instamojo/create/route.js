import {
  buildInstamojoCreatePayload,
  buildRedirectUrl,
  buildWebhookUrl,
  createPaymentRequest,
  getInstamojoCredentialsError,
  inferInstamojoMode,
} from "@/lib/instamojo";

function sanitizePurpose(value) {
  return String(value || "")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 30);
}

export async function POST(req) {
  try {
    const credentialsError = getInstamojoCredentialsError();

    if (credentialsError) {
      return Response.json({ error: credentialsError }, { status: 503 });
    }

    const { amount, buyerName, email, phone, orderRef } = await req.json();

    if (!buyerName?.trim()) {
      return Response.json({ error: "Buyer name is required." }, { status: 400 });
    }

    if (!/^[0-9]{10}$/.test(String(phone || ""))) {
      return Response.json({ error: "Valid 10 digit phone number is required." }, { status: 400 });
    }

    if (!email?.trim()) {
      return Response.json({ error: "Buyer email is required for online payment." }, { status: 400 });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) < 9) {
      return Response.json(
        { error: "Instamojo requires an amount of at least Rs. 9.00." },
        { status: 400 }
      );
    }

    const purpose = sanitizePurpose(orderRef || `LG${Date.now()}`);
    const redirectUrl = buildRedirectUrl(purpose);
    const webhookUrl = buildWebhookUrl();
    const payload = buildInstamojoCreatePayload({
      amount,
      buyerName: buyerName.trim(),
      email: email.trim(),
      phone: String(phone),
      purpose,
      redirectUrl,
      webhookUrl,
    });

    const data = await createPaymentRequest(payload);
    const paymentRequest = data.payment_request || {};

    return Response.json({
      success: true,
      mode: inferInstamojoMode(),
      orderRef: purpose,
      paymentRequestId: paymentRequest.id,
      paymentUrl: paymentRequest.longurl,
      redirectUrl,
      webhookUrl,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Could not start Instamojo payment." },
      { status: 500 }
    );
  }
}
