import crypto from "crypto";

function trimTrailingSlash(value) {
  return value?.replace(/\/+$/, "") || "";
}

function getAppUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000"
  );
}

export function getRazorpayConfig() {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    appUrl: getAppUrl(),
  };
}

export function getRazorpayCredentialsError() {
  const config = getRazorpayConfig();
  const missing = [
    !config.keyId && "RAZORPAY_KEY_ID",
    !config.keySecret && "RAZORPAY_KEY_SECRET",
  ].filter(Boolean);

  return missing.length ? `Missing Razorpay environment variables: ${missing.join(", ")}` : "";
}

export function buildRazorpayCallbackUrl(orderRef, options = {}) {
  const callbackBase =
    trimTrailingSlash(process.env.RAZORPAY_CALLBACK_URL) ||
    trimTrailingSlash(options.appUrlOverride) ||
    `${getRazorpayConfig().appUrl}/checkout/status`;
  const url = new URL(callbackBase);

  if (orderRef) {
    url.searchParams.set("orderRef", orderRef);
  }

  return url.toString();
}

export async function createRazorpayOrder(payload) {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.description ||
      data?.error?.reason ||
      data?.error?.code ||
      `Razorpay API returned ${response.status}.`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  if (!data?.id) {
    throw new Error("Razorpay did not return an order ID.");
  }

  return data;
}

export async function createRazorpayPaymentLink(payload) {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error?.description ||
      data?.error?.reason ||
      data?.error?.code ||
      `Razorpay API returned ${response.status}.`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  if (!data?.short_url) {
    throw new Error("Razorpay did not return a payment link URL.");
  }

  return data;
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const { keySecret } = getRazorpayConfig();

  if (!keySecret || !orderId || !paymentId || !signature) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");
  const generated = Buffer.from(generatedSignature);
  const received = Buffer.from(signature);

  return generated.length === received.length && crypto.timingSafeEqual(generated, received);
}

export function verifyPaymentLinkSignature({
  paymentLinkId,
  paymentLinkReferenceId,
  paymentLinkStatus,
  paymentId,
  signature,
}) {
  const { keySecret } = getRazorpayConfig();

  if (!keySecret || !paymentLinkId || !paymentLinkReferenceId || !paymentLinkStatus || !paymentId || !signature) {
    return false;
  }

  const payload = `${paymentLinkId}|${paymentLinkReferenceId}|${paymentLinkStatus}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");
  const generated = Buffer.from(generatedSignature);
  const received = Buffer.from(signature);

  return generated.length === received.length && crypto.timingSafeEqual(generated, received);
}
