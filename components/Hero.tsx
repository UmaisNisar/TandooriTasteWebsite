import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  title?: string;
  subtitle?: string;
  cta1?: string;
  cta2?: string;
  imageUrl?: string;
};

export default function Hero({
  title = "Fire-kissed tandoori and slow-cooked curries",
  subtitle = "Tandoori Tastes brings the warmth of Pakistani hospitality and charcoal-fired flavour to Northern Ontario.",
  cta1 = "Order Now",
  cta2 = "View Full Menu",
  imageUrl = "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=1200"
}: HeroProps) {
  return (
    <section className="section-padding">
      <div className="container-section grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <span className="pill">Sudbury · Pakistani · Indian</span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-6xl tracking-tight text-white">
            {title}
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-gray-200">
            {subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white"
            >
              {cta1}
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-gold hover:bg-gold/5"
            >
              {cta2}
            </Link>
          </div>
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
          <div className="card-surface relative overflow-hidden">
            {/* Replace src with your own hero image URL or local asset */}
            <Image
              src={imageUrl}
              alt="Tandoori platter with naan and chutneys"
              width={900}
              height={700}
              className="h-full w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4 text-xs text-gray-100">
              <div>
                <p className="font-semibold uppercase tracking-[0.18em]">
                  Signature Platter
                </p>
                <p>Charcoal tandoori mix · Mint chutney · House naan</p>
              </div>
              <div className="rounded-full bg-black/70 px-3 py-1">
                <span className="font-semibold text-gold">Open late</span>{" "}
                &nbsp;·&nbsp; 7 days a week
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




