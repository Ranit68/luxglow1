import crypto from "crypto";

const DEFAULT_BASE_URL = "https://www.instamojo.com";

function trimTrailingSlash(value) {
  return value?.replace(/\/+$/, "") || "";
}

function getAppUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://luxeglow.in"
  );
}

export function getInstamojoConfig() {
  return {
    apiKey: process.env.INSTAMOJO_API_KEY || "",
    authToken: process.env.INSTAMOJO_AUTH_TOKEN || "",
    privateSalt: process.env.INSTAMOJO_PRIVATE_SALT || "",
    baseUrl: trimTrailingSlash(process.env.INSTAMOJO_PAYMENT_BASE_URL) || DEFAULT_BASE_URL,
    appUrl: getAppUrl(),
  };
}

export function getInstamojoCredentialsError() {
  const config = getInstamojoConfig();
  const missing = [
    !config.apiKey && "INSTAMOJO_API_KEY",
    !config.authToken && "INSTAMOJO_AUTH_TOKEN",
  ].filter(Boolean);

  if (missing.length === 0) {
    return "";
  }

  return `Missing Instamojo environment variables: ${missing.join(", ")}`;
}

export function buildRedirectUrl(orderRef) {
  const config = getInstamojoConfig();
  const baseUrl =
    trimTrailingSlash(process.env.INSTAMOJO_REDIRECT_URL) ||
    `${config.appUrl}/checkout/status`;
  const url = new URL(baseUrl);

  if (orderRef) {
    url.searchParams.set("orderRef", orderRef);
  }

  return url.toString();
}

export function buildWebhookUrl() {
  const config = getInstamojoConfig();
  return (
    trimTrailingSlash(process.env.INSTAMOJO_WEBHOOK_URL) ||
    `${config.appUrl}/api/payments/instamojo/webhook`
  );
}

export function buildInstamojoHeaders() {
  const config = getInstamojoConfig();

  return {
    "X-Api-Key": config.apiKey,
    "X-Auth-Token": config.authToken,
  };
}

export function buildInstamojoCreatePayload({
  amount,
  buyerName,
  email,
  phone,
  purpose,
  redirectUrl,
  webhookUrl,
}) {
  const payload = new URLSearchParams();

  payload.set("amount", Number(amount).toFixed(2));
  payload.set("purpose", purpose);
  payload.set("buyer_name", buyerName);
  payload.set("email", email);
  payload.set("phone", phone);
  payload.set("send_email", "false");
  payload.set("send_sms", "false");
  payload.set("allow_repeated_payments", "false");
  payload.set("redirect_url", redirectUrl);

  if (webhookUrl) {
    payload.set("webhook", webhookUrl);
  }

  return payload;
}

export async function createPaymentRequest(payload) {
  const config = getInstamojoConfig();
  const response = await fetch(`${config.baseUrl}/api/1.1/payment-requests/`, {
    method: "POST",
    headers: {
      ...buildInstamojoHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const message =
      data?.message || data?.error || "Instamojo payment request creation failed.";
    throw new Error(message);
  }

  return data;
}

export async function getPaymentDetails(paymentRequestId, paymentId) {
  const config = getInstamojoConfig();
  const response = await fetch(
    `${config.baseUrl}/api/1.1/payment-requests/${paymentRequestId}/${paymentId}/`,
    {
      method: "GET",
      headers: buildInstamojoHeaders(),
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const message =
      data?.message || data?.error || "Instamojo payment verification failed.";
    throw new Error(message);
  }

  return data;
}

export function verifyWebhookMac(fields) {
  const { privateSalt } = getInstamojoConfig();

  if (!privateSalt) {
    return false;
  }

  const entries = Object.entries(fields)
    .filter(([key]) => key !== "mac")
    .sort(([left], [right]) => left.localeCompare(right, undefined, { sensitivity: "base" }));

  const message = entries.map(([, value]) => value).join("|");
  const calculatedMac = crypto
    .createHmac("sha1", privateSalt)
    .update(message)
    .digest("hex");

  return calculatedMac === fields.mac;
}

export function inferInstamojoMode() {
  const config = getInstamojoConfig();
  return config.baseUrl.includes("test.instamojo.com") ? "sandbox" : "live";
}
