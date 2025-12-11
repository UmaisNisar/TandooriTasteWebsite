import { contentBlockQueries, featuredDishQueries } from "@/lib/db-helpers";
import { fetchSliderData, fetchReviewsData } from "@/lib/content-helpers";
import Image from "next/image";
import Link from "next/link";
import BestSellers from "@/components/BestSellers";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import StoreStatus from "@/components/StoreStatus";
import HomeSlider from "@/components/HomeSlider";

// Use ISR for better performance - revalidate every 30 seconds
export const revalidate = 30;

export default async function HomePage() {
  let blocks: any[] = [];
  let featured: any[] = [];
  let slides: any[] = [];
  let reviews: any[] = [];
  
  try {
    [blocks, featured, slides, reviews] = await Promise.all([
      contentBlockQueries.findMany({ page: "home" }),
      featuredDishQueries.findMany(true), // Include menu items with category info
      fetchSliderData(),
      fetchReviewsData()
    ]);
  } catch (error) {
    console.error('Database error on homepage:', error);
    // Continue with empty arrays - page will still render
    blocks = blocks || [];
    featured = featured || [];
    slides = slides || [];
    reviews = reviews || [];
  }

  const heroBlock = blocks.find((b) => b.section === "hero");
  let heroData = heroBlock ? JSON.parse(heroBlock.content || "{}") : null;

  // Default hero data if not found
  if (!heroData || Object.keys(heroData).length === 0) {
    heroData = {
      title: "Fire-kissed tandoori and slow-cooked curries",
      subtitle: "Tandoori Tastes brings the warmth of Pakistani hospitality and charcoal-fired flavour to Northern Ontario.",
      cta1: "Order Now",
      cta2: "View Full Menu"
    };
  }

  const featuredDishes = featured
    .filter((f) => f.menuItem) // Only include featured dishes with valid menu items
    .map((f) => ({
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
            <HomeSlider initialSlides={slides} />
          </div>
        </div>
      </section>
      {featuredDishes.length > 0 && <BestSellers dishes={featuredDishes} />}
      {whyChooseUsData?.items && whyChooseUsData.items.length > 0 && (
        <WhyChooseUs items={whyChooseUsData.items} />
      )}
      <Testimonials initialReviews={reviews} />
      <CTASection />
    </>
  );
}




