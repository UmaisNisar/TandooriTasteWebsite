import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/90">
      <div className="container-section py-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-heading text-lg text-gold">
              Tandoori Tastes · Sudbury
            </p>
            <p className="mt-1 text-xs text-gray-300">
              Authentic Pakistani &amp; Indian cuisine crafted with charcoal
              tandoor and slow-cooked curries.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:gap-8">
            <div className="flex flex-col gap-1 text-gray-300">
              <span className="font-semibold text-white">Visit Us</span>
              <span>96 Larch St, Greater Sudbury, ON P3E 1C1</span>
              <span>Phone: (705) 675-7777</span>
              <span>info@tandooritastes.ca</span>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex gap-3">
                <Link
                  href="https://instagram.com"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gray-100 transition hover:border-gold/60 hover:bg-gold/10"
                >
                  Instagram
                </Link>
                <Link
                  href="https://facebook.com"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gray-100 transition hover:border-gold/60 hover:bg-gold/10"
                >
                  Facebook
                </Link>
              </div>
              <p className="text-[11px] text-gray-400">
                © {new Date().getFullYear()} Tandoori Tastes. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


