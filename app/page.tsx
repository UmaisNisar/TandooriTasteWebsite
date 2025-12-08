import { contentBlockQueries, featuredDishQueries } from "@/lib/db-helpers";
import Image from "next/image";
import Link from "next/link";
import BestSellers from "@/components/BestSellers";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import StoreStatus from "@/components/StoreStatus";
import HomeSlider from "@/components/HomeSlider";

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let blocks: any[] = [];
  let featured: any[] = [];
  
  try {
    [blocks, featured] = await Promise.all([
      contentBlockQueries.findMany({ page: "home" }),
      featuredDishQueries.findMany()
    ]);
  } catch (error) {
    console.error('Database error on homepage:', error);
    // Continue with empty arrays - page will still render
  }

  const heroBlock = blocks.find((b) => b.section === "hero");
  const heroData = heroBlock ? JSON.parse(heroBlock.content || "{}") : null;

  const featuredDishes = featured.map((f) => ({
    name: f.menuItem.name,
    description: f.menuItem.description,
    price: `CAD ${f.menuItem.price.toFixed(2)}`,
    imageUrl: f.menuItem.imageUrl || "",
    badge: "Featured"
  }));

  const whyChooseUsBlock = blocks.find((b) => b.section === "why-choose-us");
  const whyChooseUsData = whyChooseUsBlock
    ? JSON.parse(whyChooseUsBlock.content || "{}")
    : null;

  if (!heroData) {
    return null;
  }

  return (
    <>
      <section className="section-padding">
        <div className="container-section grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="pill">Sudbury · Pakistani · Indian</span>
              <StoreStatus />
            </div>
            {heroData.title && (
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-6xl tracking-tight text-white">
                {heroData.title}
              </h1>
            )}
            {heroData.subtitle && (
              <p className="max-w-xl text-sm sm:text-base text-gray-200">
                {heroData.subtitle}
              </p>
            )}
            {(heroData.cta1 || heroData.cta2) && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {heroData.cta1 && (
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white"
                  >
                    {heroData.cta1}
                  </Link>
                )}
                {heroData.cta2 && (
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-gold hover:bg-gold/5"
                  >
                    {heroData.cta2}
                  </Link>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-6 pt-2 text-xs text-gray-300">
              <div>
                <p className="font-semibold text-white">Dine-in · Takeout</p>
                <p>Family friendly, halal kitchen.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Catering Available</p>
                <p>Corporate events, weddings &amp; parties.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <HomeSlider />
          </div>
        </div>
      </section>
      {featuredDishes.length > 0 && <BestSellers dishes={featuredDishes} />}
      {whyChooseUsData?.items && whyChooseUsData.items.length > 0 && (
        <WhyChooseUs items={whyChooseUsData.items} />
      )}
      <Testimonials />
      <CTASection />
    </>
  );
}




