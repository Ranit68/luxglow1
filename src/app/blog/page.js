import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createMetadata, siteConfig, absoluteUrl } from "@/lib/seo";
import { blogPosts } from "@/content/blog";

export const metadata = createMetadata({
  title: "Saree Journal & Styling Blog",
  description:
    "Read Luxe&Glow's saree journal: tips on how to drape a saree for a wedding, silk vs organza, saree care and storage, and what to wear for Durga Puja & Diwali.",
  path: "/blog",
  keywords: [
    "saree styling blog",
    "how to drape a saree",
    "silk vs organza saree",
    "saree care tips",
    "what to wear for durga puja",
    "saree fashion journal india",
  ],
});

export default function BlogPage() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Saree Journal`,
    url: absoluteUrl("/blog"),
    description: "Styling, fabric and care guides for saree lovers across India.",
  };

  return (
    <main className="min-h-screen bg-[#F7F3EE] pt-28 text-[#2C1A16]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <section className="mx-auto max-w-4xl px-4 pb-6 pt-8 text-center sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8A5A18]">
          The Saree Journal
        </p>
        <h1 className="mt-3 font-[var(--font-editorial)] text-4xl font-semibold text-[#24110D] md:text-5xl">
          Styling, fabrics & care for saree lovers
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5F5148]">
          From draping a wedding saree to choosing between silk and organza, our journal
          helps you wear and care for your weaves with confidence.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-[2rem] border border-[#D8CABB] bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(61,24,16,0.10)]"
            >
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em]">
                <span className="rounded-full bg-[#7D1111] px-3 py-1 text-white">
                  {post.category}
                </span>
                <span className="text-[#8A7667]">{post.readTime}</span>
              </div>
              <h2 className="mt-4 font-[var(--font-editorial)] text-2xl font-semibold leading-tight text-[#24110D] group-hover:text-[#7D1111]">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5F5148]">{post.excerpt}</p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-[#8A5A18] pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A5A18]">
                Read the guide
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
