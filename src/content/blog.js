import { siteConfig } from "@/lib/seo";

export const blogPosts = [
  {
    slug: "how-to-drape-a-saree-for-a-wedding",
    title: "How to Drape a Saree for a Wedding: A Step-by-Step Guide",
    excerpt:
      "Master the perfect wedding saree drape with our step-by-step guide — from pleating to pallu placement, so you look flawless from the baraat to the reception.",
    category: "Styling",
    readTime: "6 min read",
    date: "2026-08-20",
    relatedCategories: ["Wedding", "Silk"],
  },
  {
    slug: "silk-vs-organza-sarees-which-to-choose",
    title: "Silk vs Organza Sarees: Which One Should You Choose?",
    excerpt:
      "Silk drapes rich and regal; organza feels airy and modern. We break down texture, occasions, and styling so you can pick the right saree for every event.",
    category: "Fabrics",
    readTime: "5 min read",
    date: "2026-08-15",
    relatedCategories: ["Silk", "Organza", "Party Wear"],
  },
  {
    slug: "saree-care-and-storage-tips",
    title: "Saree Care and Storage Tips: Keep Your Weaves Looking New for Years",
    excerpt:
      "Protect your silk, mashru and cotton sarees with the right washing, folding and storage habits. Simple steps that preserve colour, zari and drape for decades.",
    category: "Care",
    readTime: "7 min read",
    date: "2026-08-08",
    relatedCategories: ["Silk", "Cotton"],
  },
  {
    slug: "what-to-wear-a-saree-with-for-durga-puja-and-diwali",
    title: "What to Wear a Saree With for Durga Puja & Diwali",
    excerpt:
      "From blouse styling to jewellery and accessories, here's how to build a complete festive look around your saree for Pujo anjali and Diwali nights.",
    category: "Festive",
    readTime: "5 min read",
    date: "2026-08-01",
    relatedCategories: ["Festive", "Wedding"],
  },
  {
    slug: "best-sarees-for-ganesh-chaturthi-2026",
    title: "Best Sarees for Ganesh Chaturthi 2026: Colours, Fabrics & Styling",
    excerpt:
      "Fresh, auspicious and easy to move around in — here are the sarees that bring the perfect festive touch to Ganesh Chaturthi, from morning aarti to prasad.",
    category: "Festive",
    readTime: "6 min read",
    date: "2026-09-04",
    relatedCategories: ["Festive", "Cotton"],
  },
  {
    slug: "best-sarees-for-durga-puja-2026",
    title: "Best Sarees for Durga Puja 2026: Anjali to Ashtami & Beyond",
    excerpt:
      "From crisp white-and-red for anjali to rich silk for ashtami, discover the best saree looks for every day of Durga Puja — plus what to wear for the idol visits.",
    category: "Festive",
    readTime: "7 min read",
    date: "2026-09-04",
    relatedCategories: ["Festive", "Silk", "Cotton"],
  },
  {
    slug: "navratri-saree-styles-guide",
    title: "Navratri Saree Styles: What to Wear Across All 9 Nights",
    excerpt:
      "A colour and style guide for all nine nights of Navratri — from Garba-ground fabrics to elegant evening drapes, plus how to shop each look in one place.",
    category: "Styling",
    readTime: "6 min read",
    date: "2026-09-04",
    relatedCategories: ["Festive", "Party Wear"],
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug) || null;
}
