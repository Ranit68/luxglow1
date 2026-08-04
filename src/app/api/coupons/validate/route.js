import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();
    const normalizedCode = String(code || "").trim().toUpperCase();

    if (!normalizedCode) {
      return Response.json({ valid: false, error: "Enter a coupon code." }, { status: 400 });
    }

    const db = getAdminDb();
    const snapshot = await db.collection("coupons").doc(normalizedCode).get();

    if (!snapshot.exists) {
      return Response.json({ valid: false, error: "Coupon not valid." }, { status: 404 });
    }

    const coupon = snapshot.data();
    const minimumOrderValue = Number(coupon.minimumOrderValue || 0);
    const discountType = coupon.discountType || "percent";
    const discountValue = Number(coupon.discountValue || 0);
    const active = coupon.active !== false;

    if (!active) {
      return Response.json({ valid: false, error: "Coupon not valid." }, { status: 400 });
    }

    if (Number(subtotal || 0) < minimumOrderValue) {
      return Response.json(
        {
          valid: false,
          error: `This coupon requires a minimum order of Rs. ${minimumOrderValue.toLocaleString("en-IN")}.`,
        },
        { status: 400 }
      );
    }

    const computedDiscount =
      discountType === "fixed"
        ? Math.min(discountValue, Number(subtotal || 0))
        : Math.round((Number(subtotal || 0) * discountValue) / 100);

    return Response.json({
      valid: true,
      coupon: {
        code: normalizedCode,
        label: coupon.label || normalizedCode,
        discountType,
        discountValue,
        computedDiscount,
      },
    });
  } catch (error) {
    return Response.json(
      { valid: false, error: error.message || "Coupon could not be verified." },
      { status: 500 }
    );
  }
}
