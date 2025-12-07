import Link from "next/link";

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary/90 via-primary to-black">
      <div className="container-section flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl sm:text-3xl text-gold">
            Ready for a tandoori night?
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-offwhite/80">
            Reserve a cozy table, order ahead for pickup, or talk to us about
            catering your next event. We&apos;ll help you plan the perfect
            menu.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white"
          >
            Book a Table
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-gold/70 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-black/20"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}




