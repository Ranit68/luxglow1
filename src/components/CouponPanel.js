"use client";

import { useState } from "react";
import { CheckCircle2, TicketPercent, XCircle } from "lucide-react";

export default function CouponPanel({ subtotal, onCouponChange }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setStatus({ type: "error", message: "Enter a coupon code to continue." });
      setAppliedCoupon(null);
      onCouponChange(null);
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.valid) {
        setAppliedCoupon(null);
        setStatus({ type: "error", message: data?.error || "Coupon not valid." });
        onCouponChange(null);
        return;
      }

      setAppliedCoupon(data.coupon);
      setStatus({ type: "success", message: `${data.coupon.code} applied successfully.` });
      onCouponChange(data.coupon);
    } catch {
      setAppliedCoupon(null);
      setStatus({ type: "error", message: "Coupon could not be verified right now." });
      onCouponChange(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setStatus({ type: "idle", message: "" });
    onCouponChange(null);
  };

  return (
    <div className="rounded-[1.2rem] border border-[#E7DDD1] bg-[#FCF8F3] p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A7667]">
        <TicketPercent className="h-3.5 w-3.5" />
        Coupon code
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
          placeholder="Enter coupon"
          className="flex-1 rounded-full border border-[#D9CDBD] bg-white px-4 py-2.5 text-sm text-[#24110D] outline-none placeholder:text-[#9A8A7B]"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="rounded-full bg-[#7D1111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5A0F1C] disabled:opacity-60"
        >
          {loading ? "Checking..." : "Apply"}
        </button>
      </div>

      {status.message ? (
        <div
          className={`mt-3 flex items-center gap-2 text-sm ${
            status.type === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span>{status.message}</span>
        </div>
      ) : null}

      {appliedCoupon ? (
        <button
          type="button"
          onClick={handleRemove}
          className="mt-3 text-sm font-medium text-[#7D1111] underline"
        >
          Remove coupon
        </button>
      ) : null}
    </div>
  );
}
