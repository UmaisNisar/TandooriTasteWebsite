"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Review } from "@/lib/content-helpers";

type TestimonialsProps = {
  initialReviews: Review[];
};

export default function Testimonials({ initialReviews }: TestimonialsProps) {
  const [reviews] = useState<Review[]>(initialReviews);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length > 0) {
      const id = setInterval(
        () => setIndex((prev) => (prev + 1) % reviews.length),
        8000
      );
      return () => clearInterval(id);
    }
  }, [reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  const current = reviews[index];

  // Show grid view if more than 3 reviews, otherwise show slider
  const showGrid = reviews.length > 3;

  if (showGrid) {
    return (
      <section className="section-padding">
        <div className="container-section space-y-8">
          <div className="space-y-4">
            <h2 className="section-heading">Guests love our flavours</h2>
            <p className="section-subtitle">
              Whether it&apos;s a quiet dinner or a full celebration, our guests
              keep coming back for the warmth and consistency of our cooking.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((item) => (
              <div
                key={(item as any).id || item.reviewerName}
                className="card-surface relative overflow-hidden p-6"
              >
                <div className="pointer-events-none absolute right-4 top-4 text-4xl text-gold/20">
                  “
                </div>
                <div className="space-y-4 relative">
                  <p className="text-sm text-gray-100">{item.text}</p>
                  <div className="flex items-center gap-3">
                    {item.reviewerImageUrl && (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                        <Image
                          src={item.reviewerImageUrl}
                          alt={item.reviewerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm text-gold truncate">
                        {item.reviewerName}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < item.rating ? "text-gold" : "text-gray-500"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-section grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-center">
        <div className="space-y-4">
          <h2 className="section-heading">Guests love our flavours</h2>
          <p className="section-subtitle">
            Whether it&apos;s a quiet dinner or a full celebration, our guests
            keep coming back for the warmth and consistency of our cooking.
          </p>
        </div>

        <div className="card-surface relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute right-6 top-6 text-6xl text-gold/20">
            “
          </div>
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-gray-100">
              {current.text}
            </p>
            <div className="flex items-center gap-3">
              {current.reviewerImageUrl && (
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                  <Image
                    src={current.reviewerImageUrl}
                    alt={current.reviewerName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-heading text-base text-gold">
                    {current.reviewerName}
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < current.rating ? "text-gold" : "text-gray-500"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="mt-6 flex items-center justify-between gap-4 text-[11px] text-gray-400">
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-gold" : "w-2 bg-white/25"
                    }`}
                    aria-label={`Show testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}




