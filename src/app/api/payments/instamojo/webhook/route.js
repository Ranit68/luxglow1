import { verifyWebhookMac } from "@/lib/instamojo";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
    );

    if (!payload.mac || !verifyWebhookMac(payload)) {
      return Response.json({ received: false, error: "Invalid webhook MAC." }, { status: 400 });
    }

    return Response.json({
      received: true,
      verified: true,
      paymentStatus: payload.status || "Unknown",
      paymentRequestId: payload.payment_request_id || "",
      paymentId: payload.payment_id || "",
      purpose: payload.purpose || "",
    });
  } catch {
    return Response.json(
      { received: false, error: "Could not process Instamojo webhook." },
      { status: 500 }
    );
  }
}
