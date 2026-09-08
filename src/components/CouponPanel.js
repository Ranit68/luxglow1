"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, TicketPercent, XCircle } from "lucide-react";

export const COUPON_STORAGE_KEY = "lxg.appliedCoupon";

export function clearStoredCoupon() {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  } catch {
    /* storage unavailable — non-fatal */
  }
}

function readStoredCoupon() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredCoupon(coupon) {
  try {
    if (coupon) {
      window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  } catch {
    /* storage unavailable — non-fatal */
  }
}

function formatDiscountLabel(coupon) {
  if (coupon.discountType === "fixed") {
    return `₹${Number(coupon.discountValue).toLocaleString("en-IN")} off`;
  }
  return `${coupon.discountValue}% off`;
}

export default function CouponPanel({ subtotal, onCouponChange }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [suggestedCoupons, setSuggestedCoupons] = useState([]);

  const validateCoupon = useCallback(
    async (code, subtotalValue) => {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: subtotalValue }),
      });
      const data = await response.json().catch(() => null);
      return { ok: response.ok && !!data?.valid, data };
    },
    []
  );

  const handleApply = async (overrideCode) => {
    const code = (typeof overrideCode === "string" ? overrideCode : couponCode)
      .trim()
      .toUpperCase();

    if (!code) {
      setStatus({ type: "error", message: "Enter a coupon code to continue." });
      setAppliedCoupon(null);
      writeStoredCoupon(null);
      onCouponChange(null);
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const { ok, data } = await validateCoupon(code, subtotal);

      if (!ok || !data) {
        setAppliedCoupon(null);
        writeStoredCoupon(null);
        setStatus({ type: "error", message: data?.error || "Coupon not valid." });
        onCouponChange(null);
        return;
      }

      setAppliedCoupon(data.coupon);
      writeStoredCoupon(data.coupon);
      setStatus({ type: "success", message: `${data.coupon.code} applied successfully.` });
      onCouponChange(data.coupon);
    } catch {
      setAppliedCoupon(null);
      writeStoredCoupon(null);
      setStatus({ type: "error", message: "Coupon could not be verified right now." });
      onCouponChange(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    writeStoredCoupon(null);
    setStatus({ type: "idle", message: "" });
    onCouponChange(null);
  };

  useEffect(() => {
    const stored = readStoredCoupon();
    if (!stored) return;

    let active = true;

    (async () => {
      try {
        const { ok, data } = await validateCoupon(stored.code, subtotal);
        if (!active) return;

        if (ok && data) {
          setAppliedCoupon(data.coupon);
          writeStoredCoupon(data.coupon);
          setStatus({ type: "success", message: `${data.coupon.code} applied.` });
          onCouponChange(data.coupon);
        } else {
          setAppliedCoupon(null);
          writeStoredCoupon(null);
          onCouponChange(null);
        }
      } catch {
        if (!active) return;
        setAppliedCoupon(null);
        writeStoredCoupon(null);
        onCouponChange(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [subtotal, validateCoupon, onCouponChange]);

  useEffect(() => {
    let active = true;
    fetch("/api/coupons/list")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (active && Array.isArray(data?.coupons)) setSuggestedCoupons(data.coupons);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const eligibleCoupons = useMemo(
    () =>
      suggestedCoupons.filter(
        (coupon) => Number(coupon.minimumOrderValue || 0) <= subtotal
      ),
    [suggestedCoupons, subtotal]
  );

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
          onClick={() => handleApply()}
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
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-emerald-700">{appliedCoupon.code}</p>
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-[#7D1111] underline"
          >
            Remove coupon
          </button>
        </div>
      ) : eligibleCoupons.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A7667]">
            Offers for you
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {eligibleCoupons.map((coupon) => (
              <button
                key={coupon.code}
                type="button"
                onClick={() => handleApply(coupon.code)}
                disabled={loading}
                className="rounded-full border border-dashed border-[#7D1111] bg-white px-3 py-1.5 text-xs font-semibold text-[#7D1111] transition hover:bg-[#7D1111] hover:text-white disabled:opacity-60"
              >
                {coupon.code} · {formatDiscountLabel(coupon)}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}