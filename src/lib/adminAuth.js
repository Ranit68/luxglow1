import { getAuth } from "firebase-admin/auth";
import { getApp } from "firebase-admin/app";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function requireAdminToken(req) {
  const authHeader =
    req?.headers?.get?.("authorization") ||
    req?.headers?.authorization ||
    "";
  const token = String(authHeader).replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return { error: { status: 401, message: "Admin token is required." } };
  }

  try {
    const decoded = await getAuth(getApp()).verifyIdToken(token);

    const db = getAdminDb();
    const [adminTokens, admins] = await Promise.all([
      db.collection("adminTokens").doc(decoded.uid).get(),
      db.collection("admins").doc(decoded.uid).get(),
    ]);

    if (!adminTokens.exists && !admins.exists) {
      return { error: { status: 403, message: "This account is not authorized as admin." } };
    }

    return { uid: decoded.uid, email: decoded.email || null };
  } catch (e) {
    return { error: { status: 401, message: "Invalid admin token." } };
  }
}
