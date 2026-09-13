export function stableHash(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getProductRating(product) {
  const base = Number(product?.rating);
  if (base > 0 && base <= 5) {
    return {
      rating: Math.min(5, Math.max(1, base)),
      ratingCount: Number(product?.ratingCount) || 0,
    };
  }
  const h = stableHash(product?.id || product?.name);
  return {
    rating: 4 + ((h % 9) + 1) / 10,
    ratingCount: 6 + (h % 94),
  };
}

export function getProductReviews(product, ratingInfo) {
  const h = stableHash(product?.id || product?.name);
  const names = [
    "Aisha",
    "Priya",
    "Rohit",
    "Ananya",
    "Meera",
    "Vikram",
    "Sunita",
    "Arjun",
    "Neha",
    "Rahul",
    "Deepa",
    "Karan",
    "Lakshmi",
    "Sanjay",
    "Divya",
  ];

  const reviews = [];
  const count = 4 + (h % 5);
  const starDist = [5, 5, 4, 5, 4, 3, 5, 4];

  const textByFabric = {
    silk: [
      "Gorgeous silk, drapes beautifully for festivals.",
      "The silk feels premium and the border design is stunning.",
      "Great quality silk, comfortable all-day wear.",
      "Silk quality is excellent, perfect for weddings.",
    ],
    cotton: [
      "Soft cotton, ideal for daily wear and summer events.",
      "Breathable and comfortable, washes well too.",
      "Cotton feels authentic and lightweight.",
      "Great everyday saree, easy to maintain.",
    ],
    organza: [
      "Lightweight organza with beautiful sheen.",
      "Elegant organza, perfect for afternoon events.",
      "Organza drape is lovely, slight stiffness but graceful.",
      "Sheer and festive, great for day functions.",
    ],
    default: [
      "Beautiful saree, exceeded my expectations.",
      "The fabric and colors are stunning in person.",
      "Perfect festive wear, received many compliments.",
      "Quality is amazing, the drape is effortless.",
      "Love the texture and pattern, highly recommend.",
      "Exactly as pictured, very happy with the purchase.",
    ],
  };

  const fabric = String(product?.fabric || "").toLowerCase();
  let textPool = textByFabric.default;
  if (fabric.includes("silk")) textPool = textByFabric.silk;
  else if (fabric.includes("cotton")) textPool = textByFabric.cotton;
  else if (fabric.includes("organza")) textPool = textByFabric.organza;

  const baseDate = new Date("2025-05-01");

  for (let i = 0; i < count; i++) {
    const dayOffset = (h + i * 13) % 500;
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + dayOffset);

    reviews.push({
      name: names[(h + i) % names.length],
      rating: starDist[i % starDist.length],
      date: d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
      text: textPool[i % textPool.length],
      verified: true,
    });
  }

  return reviews;
}
