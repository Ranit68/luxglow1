import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata, siteConfig, absoluteUrl } from "@/lib/seo";
import { blogPosts, getBlogPost } from "@/content/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return createMetadata({
      title: "Guide Not Found",
      path: "/blog",
      noIndex: true,
    });
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [
      post.title,
      post.category,
      "saree journal",
      "saree styling guide",
      "buy sarees online india",
    ],
  });
}

function Section({ children }) {
  return <p className="mt-5 text-sm leading-7 text-[#5F5148]">{children}</p>;
}

function Heading({ children }) {
  return <h2 className="mt-8 font-[var(--font-editorial)] text-2xl font-semibold text-[#24110D]">{children}</h2>;
}

function relatedLink(label, category, collection) {
  const cat = encodeURIComponent(category.split(" ")[0]);
  const href = collection
    ? `/shop?collection=${encodeURIComponent(collection)}`
    : `/shop?category=${cat}`;
  return (
    <Link
      key={collection || category}
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-[#7D1111] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_22px_rgba(125,17,17,0.28)] transition hover:-translate-y-0.5 hover:bg-[#5E0D0C]"
    >
      Shop Now — {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}

function shopNow(label, category, collection) {
  return (
    <span className="mx-1 mt-6 inline-flex flex-wrap items-center gap-3 align-middle">
      {relatedLink(`Shop ${label}`, category, collection)}
    </span>
  );
}

const topics = {
  "how-to-drape-a-saree-for-a-wedding": (
    <>
      <Section>
        A wedding is one of the few occasions where the saree still takes centre stage —
        and getting the drape right makes all the difference. Whether you are a bride, a
        bridesmaid or a guest, these steps will help you achieve a secure, flattering
        drape that lasts from the baraat to the last photograph.
      </Section>
      <Heading>Start with the right inner basics</Heading>
      <Section>
        Begin with a well-fitted petticoat and a blouse that supports you comfortably.
        A stiffened petticoat (made from cotton with a stiff lining) gives silk and heavy
        weaves the body they need, so your saree stays in place without constant adjusting.
      </Section>
      <Heading>Secure the saree at the waist</Heading>
      <Section>
        Tuck the plain end of the saree into the petticoat at your natural waist, working
        from right to left. Make sure the lower edge hangs evenly just above the ankle —
        checking the hem now saves you from an uneven drape later.
      </Section>
      <Heading>Pleat like a professional</Heading>
      <Section>
        Pleat the saree into neat, even folds (around 5–6 inches each), pinching them
        tightly so the pleats fall straight. Tuck the pleats slightly to the left of your
        navel, then fan them softly to the left so they fall naturally with the fabric.
      </Section>
      <Heading>Drape the pallu with confidence</Heading>
      <Section>
        Bring the remaining fabric around your back, over your left shoulder, and pin it
        at the shoulder for security. For weddings, arrange the pallu to showcase the
        border and zari — a gathered or pleated pallu over the shoulder always looks elegant
        and stays put longer.
      </Section>
      <Section>
        For heavier silk and banarasi weaves, consider asking a tailor or draping expert for
        help, or practise at home a day before. Ready to shop the look?
        <span className="mx-2 inline-flex flex-wrap gap-2 align-middle">
          {relatedLink("Wedding Sarees", "Wedding")}
          {relatedLink("Silk Sarees", "Silk")}
        </span>
      </Section>
    </>
  ),
  "silk-vs-organza-sarees-which-to-choose": (
    <>
      <Section>
        Two fabrics, two entirely different personalities. Silk is the undisputed icon of
        Indian tradition, while organza is the modern star of contemporary festive dressing.
        Here is how to choose between them for your next occasion.
      </Section>
      <Heading>Silk: rich, regal, timeless</Heading>
      <Section>
        Silk (including soft silk, mashru and banarasi) drapes with a heavy, luxurious
        fall and captures light beautifully. It is the classic choice for weddings,
        religious ceremonies and family celebrations where you want maximum elegance
        and heritage.
      </Section>
      <Heading>Organza: airy, modern, photogenic</Heading>
      <Section>
        Organza is crisp yet lightweight, with a subtle sheen that photographs wonderfully.
        It suits evening parties, receptions and contemporary festive looks — and it is far
        easier to travel with than heavy silk.
      </Section>
      <Heading>Which should you pick?</Heading>
      <Section>
        Choose silk when you want tradition, drape and longevity — think weddings, Pujo and
        heirloom moments. Choose organza when you want an airy, fashion-forward silhouette
        for parties and less-formal celebrations. Many wardrobes keep both.
        <span className="mx-2 inline-flex flex-wrap gap-2 align-middle">
          {relatedLink("Silk Sarees", "Silk")}
          {relatedLink("Party Wear Sarees", "Party")}
        </span>
      </Section>
    </>
  ),
  "saree-care-and-storage-tips": (
    <>
      <Section>
        A quality saree is an investment that can last generations — if you care for it
        properly. These simple habits protect colour, zari and drape for years.
      </Section>
      <Heading>Wash with care</Heading>
      <Section>
        Dry-clean silk, mashru and heavily zari-embroidered sarees. For cotton and
        lighter weaves, hand-wash gently in cold water with a mild detergent, and never
        wring or rub the fabric. Avoid soaking for long periods.
      </Section>
      <Heading>Dry the right way</Heading>
      <Section>
        Dry sarees in shade, away from direct sunlight to prevent fading. Avoid using a
        dryer for silk — air-drying on a flat surface or a padded hanger keeps the fabric
        from stretching.
      </Section>
      <Heading>Fold and store smartly</Heading>
      <Section>
        Fold sarees along the weave and store them flat in a muslin or cotton cloth to
        allow the fabric to breathe. Avoid plastic covers, which trap moisture and can
        dull zari. Add neem leaves or a sachet of cloves to keep insects away without
        harsh chemicals.
      </Section>
      <Heading>Refresh before wearing</Heading>
      <Section>
        Hang the saree for a few hours before wearing to release creases. For stubborn
        folds, steam gently at a distance — never iron directly over zari or embroidery.
        <span className="mx-2 inline-flex flex-wrap gap-2 align-middle">
          {relatedLink("Silk Sarees", "Silk")}
          {relatedLink("Cotton Sarees", "Cotton")}
        </span>
      </Section>
    </>
  ),
  "what-to-wear-a-saree-with-for-durga-puja-and-diwali": (
    <>
      <Section>
        Festive dressing is about the complete look — the saree, the blouse, the jewellery
        and the accessories. Here is how to build an outfit that feels ceremonial without
        looking overdone.
      </Section>
      <Heading>Blouse styling matters</Heading>
      <Section>
        A well-fitted blouse transforms a saree. For Pujo anjali, choose a clean,
        elegant blouse in a complementary tone. For Diwali evenings, a statement blouse
        with a back detail or delicate embellishment adds a festive lift.
      </Section>
      <Heading>Jewellery: let one element lead</Heading>
      <Section>
        If your saree has heavy zari or embroidery, pair it with classic gold — chandbali
        earrings or a jhumka set and a simple maang tikka. If your saree is plainer, a
        choker or layered necklace adds the required festive drama.
      </Section>
      <Heading>Finish the look</Heading>
      <Section>
        A potli or small clutch, a bindi, and comfortable festive footwear complete the
        silhouette. Keep hair neat — a low bun or soft waves work beautifully with both
        traditional and contemporary drapes.
      </Section>
      <Section>
        Build your festive wardrobe with the right picks:
        <span className="mx-2 inline-flex flex-wrap gap-2 align-middle">
          {relatedLink("Festive Sarees", "Festive")}
          {relatedLink("Wedding Sarees", "Wedding")}
        </span>
      </Section>
    </>
  ),
  "best-sarees-for-ganesh-chaturthi-2026": (
    <>
      <Section>
        Ganesh Chaturthi is a celebration of beginnings — and the saree you choose should
        feel fresh, auspicious and easy to move around in, from the morning aarti to the
        prasad distribution in the evening. Here is how to pick the perfect look for the day.
      </Section>
      <Heading>Start with lucky colours</Heading>
      <Section>
        Red, maroon, saffron, yellow and green are considered especially auspicious for
        Ganesh Chaturthi. A rich red or maroon saree with a gold or zari border instantly
        references tradition, while soft greens and yellows keep the look fresh and modern
        for younger celebrations at home or in the pandal.
      </Section>
      <Heading>Choose a fabric for the full day</Heading>
      <Section>
        Since the day involves sitting for aarti, preparing prasad and welcoming guests,
        comfort really matters. Light cotton and mashru weaves keep you cool and are easy
        to drape, while soft silk gives a more polished, festive feel without the weight of
        heavy wedding silk. For a middle ground, a banarasi cotton or a light tissue works
        beautifully.
      </Section>
      <Heading>Blouse and bling</Heading>
      <Section>
        A well-fitted blouse makes all the difference. Pair a zari-bordered saree with a
        simple elegant blouse, and add traditional gold jewellery — a chandbali or a small
        mangalsutra-style set keeps the focus on the drape.
      </Section>
      <Section>
        Looking to refresh your festive wardrobe?
        {shopNow("Ganpati Special Collection", "Festive", "ganesh-chaturthi")}
        {shopNow("Cotton Sarees", "Cotton")}
      </Section>
    </>
  ),
  "best-sarees-for-durga-puja-2026": (
    <>
      <Section>
        Durga Puja is the biggest saree celebration of the Bengali year. From the crisp
        white-and-red of Anjali to the rich silks of Ashtami, each day calls for a slightly
        different mood. Here is your complete Pujo saree guide.
      </Section>
      <Heading>The classic: white with a red border</Heading>
      <Section>
        For Sasthi to Ashtami anjali, nothing beats the traditional white or off-white saree
        with a red (laal) border. It is considered pure and auspicious, and it photographs
        beautifully in the morning light. Choose a cotton for comfort or a soft silk for a
        slightly richer drape.
      </Section>
      <Heading>Ashtami &amp; Navami: bring out the silk</Heading>
      <Section>
        As the festival peaks, this is the moment for your finest weaves. Red, maroon, deep
        green and gold banarasi or silk sarees — often with intricate zari and rich borders —
        capture the celebratory spirit for the evening aarti, Dhunuchi dance and pandal
        visits.
      </Section>
      <Heading>Dashami and Sindur Khela</Heading>
      <Section>
        For Dashami and Sindur Khela, deep reds and maroons are the emotional favourites —
        symbolic of the goddess and steeped in tradition. Choose a saree you feel beautiful
        and comfortable in, as the day is long and full of celebration.
      </Section>
      <Section>
        Build your full Pujo wardrobe in one place:
        {shopNow("Durga Puja Collection", "Festive", "durga-puja")}
        {shopNow("Silk Sarees", "Silk")}
        {shopNow("Cotton Sarees", "Cotton")}
      </Section>
    </>
  ),
  "navratri-saree-styles-guide": (
    <>
      <Section>
        Navratri brings nine nights of colour, dance and celebration. Each day has its own
        traditional colour and mood, so planning ahead means you never run out of festive
        drapes. Here is how to style sarees across all nine nights.
      </Section>
      <Heading>Let colour lead the way</Heading>
      <Section>
        Across India, Navratri nights follow a colour calendar — yellows, greens, reds,
        whites and purples each carry meaning. You can match your saree to the day&apos;s colour,
        or interpret it loosely in a lighter or darker tone that flatters your skin tone.
      </Section>
      <Heading>Fabrics that move with you</Heading>
      <Section>
        For Garba and Dandiya nights, choose fabrics that drape well and let you move —
        chiffon, georgette, organza and light silk twirl beautifully on the dance floor.
        For quieter family evenings, a rich cotton or soft silk keeps you elegant and
        comfortable.
      </Section>
      <Heading>From day to night</Heading>
      <Section>
        Simpler, lighter drapes work for daytime and Durga Puja visits, while sequinned,
        zari-rich and party weaves shine after dark. Keep one statement saree for the final
        two nights of the festival.
      </Section>
      <Section>
        Shop the Navratri looks here:
        {shopNow("Festive Sarees", "Festive")}
        {shopNow("Party Wear Sarees", "Party Wear")}
      </Section>
    </>
  ),
};

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F7F3EE] pt-28 text-[#2C1A16]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-[10px] uppercase tracking-[0.24em] text-[#7D6B5D]">
          <Link href="/" className="transition hover:text-[#7D1111]">Home</Link>
          <span className="px-2 text-[#B6A89A]">/</span>
          <Link href="/blog" className="transition hover:text-[#7D1111]">Blog</Link>
        </nav>

        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em]">
          <span className="rounded-full bg-[#7D1111] px-3 py-1 text-white">{post.category}</span>
          <span className="text-[#8A7667]">{post.readTime}</span>
        </div>

        <h1 className="mt-4 font-[var(--font-editorial)] text-4xl font-semibold leading-tight text-[#24110D] md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-xs text-[#8A7667]">Published {post.date} · Luxe&Glow Saree Journal</p>

        <div className="mt-8">{topics[post.slug]}</div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[#D8CABB] pt-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A5A18]">
            Shop the guide:
          </span>
          {post.relatedCategories.map((cat) => relatedLink(`${cat} Sarees`, cat))}
        </div>
      </article>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="font-[var(--font-editorial)] text-2xl font-semibold text-[#24110D]">
          More from the journal
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-2xl border border-[#D8CABB] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(61,24,16,0.10)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A5A18]">
                {item.category}
              </p>
              <h3 className="mt-2 line-clamp-2 font-[var(--font-editorial)] text-lg font-semibold leading-snug text-[#24110D]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-[#8A7667]">{item.readTime}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
