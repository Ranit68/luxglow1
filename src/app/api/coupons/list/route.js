import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("coupons").get();

    const coupons = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.active === false) return;
      const visibility = String(data.visibility || "public").toLowerCase();
      if (visibility !== "public") return;
      coupons.push({
        code: doc.id,
        discountType: data.discountType || "percent",
        discountValue: Number(data.discountValue || 0),
        minimumOrderValue: Number(data.minimumOrderValue || 0),
      });
    });

    coupons.sort(
      (a, b) => b.discountValue - a.discountValue
    );

    return Response.json({ coupons });
  } catch (error) {
    return Response.json({ coupons: [] });
  }
}