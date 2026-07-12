"use client";

import { useEffect, useMemo, useState } from "react";
import { Hourglass } from "lucide-react";

const PUJO_START = "2026-10-16T00:00:00+05:30";

function getRemainingTime() {
  const distance = new Date(PUJO_START).getTime() - Date.now();
  const safeDistance = Math.max(distance, 0);

  return {
    days: Math.floor(safeDistance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safeDistance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safeDistance / (1000 * 60)) % 60),
    seconds: Math.floor((safeDistance / 1000) % 60),
    finished: distance <= 0,
  };
}

export default function DurgaPujoExperience() {
  return null;
}

export function PujoCountdown({ compact = false }) {
  const [remaining, setRemaining] = useState(getRemainingTime);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemainingTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = useMemo(
    () => [
      ["Days", remaining.days],
      ["Hours", remaining.hours],
      ["Min", remaining.minutes],
      ["Sec", remaining.seconds],
    ],
    [remaining]
  );

  return (
    <div className={compact ? "text-center" : "mx-auto max-w-md text-center"}>
      <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center text-[#8A5A18]">
        <Hourglass className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
        Awaiting the goddess
      </p>
      {remaining.finished ? (
        <p className="mt-3 font-[var(--font-playfair)] text-2xl text-[#7D1111]">
          Subho Pujo. The festive edit is live.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-4 gap-4">
          {units.map(([label, value]) => (
            <div key={label} className="border-t border-[#B9965B] pt-4">
              <p className="font-[var(--font-playfair)] text-3xl leading-none text-[#7D1111]">
                {String(value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#6F5A46]">{label}</p>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs leading-6 text-[#6F5A46]">
        Prepared for Maha Shashthi, Oct 16, 2026.
      </p>
    </div>
  );
}

export { PUJO_START };
