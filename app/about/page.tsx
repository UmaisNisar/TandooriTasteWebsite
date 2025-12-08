import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { contentBlockQueries } from "@/lib/db-helpers";

export const metadata: Metadata = {
  title: "About Us | Tandoori Tastes · Pakistani Heart in Sudbury",
  description:
    "Discover the story of Tandoori Tastes in Sudbury: our Pakistani roots, chef, and philosophy behind every tandoori, curry and biryani we serve."
};

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  let blocks: any[] = [];
  
  try {
    blocks = await contentBlockQueries.findMany({ page: "about" });
  } catch (error) {
    console.error('Database error on about page:', error);
    // Continue with empty array - page will still render
  }

  const storyBlock = blocks.find((b) => b.section === "story");
  const chefBlock = blocks.find((b) => b.section === "chef");
  const missionBlock = blocks.find((b) => b.section === "mission");

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="A slice of Pakistan in Northern Ontario"
        subtitle="Tandoori Tastes is inspired by the bustling food streets of Lahore and Karachi, brought to life in Sudbury with warmth and care."
      />

      <section className="section-padding pt-0">
        <div className="container-section grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6 text-sm sm:text-base text-gray-200">
            {storyBlock?.content && (
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: storyBlock.content.replace(/\n/g, "<br />")
                }}
              />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {chefBlock?.content && (
                <div className="card-surface p-4">
                  <h3 className="mb-2 font-heading text-base text-gold">
                    Chef&apos;s Philosophy
                  </h3>
                  <div
                    className="text-sm text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: chefBlock.content
                    }}
                  />
                </div>
              )}
              {missionBlock?.content && (
                <div className="card-surface p-4">
                  <h3 className="mb-2 font-heading text-base text-gold">
                    Mission / Values
                  </h3>
                  <div
                    className="text-sm text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: missionBlock.content
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="card-surface relative h-40 sm:h-52 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/5371695/pexels-photo-5371695.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Chef preparing spices for Pakistani cuisine"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="card-surface relative h-40 sm:h-52 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/1117867/pexels-photo-1117867.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Colorful Pakistani and Indian curries on a table"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="card-surface relative h-32 sm:h-40 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/1487515/pexels-photo-1487515.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Biryani rice being garnished with herbs"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="card-surface relative h-32 sm:h-40 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/4109130/pexels-photo-4109130.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Freshly baked naan bread in a basket"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              All images are high-quality stock placeholders. Replace them with
              your own restaurant photos for a truly authentic feel.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}




