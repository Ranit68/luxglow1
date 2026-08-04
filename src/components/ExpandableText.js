"use client";

import { useState } from "react";

export default function ExpandableText({ text = "", maxChars = 300, className = "" }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > maxChars;
  const preview = shouldTruncate ? text.slice(0, maxChars).trimEnd() : text;

  return (
    <div>
      <p className={className}>
        {expanded || !shouldTruncate ? text : preview + "..."}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded((s) => !s)}
          className="mt-3 inline-block text-sm font-semibold text-[#7A1C2B] underline-offset-2 hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
