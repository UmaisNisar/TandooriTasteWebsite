import { fetchContentBlocks, fetchStoreHours } from "@/lib/content-helpers";
import DeliveryLinks from "./DeliveryLinks";

export default async function ContactSection() {
  let blocks: any[] = [];
  let storeData: any[] = [];
  
  try {
    [blocks, storeData] = await Promise.all([
      fetchContentBlocks("contact"),
      fetchStoreHours()
    ]);
  } catch (error) {
    console.error('Database error on contact page:', error);
    // Continue with empty arrays - page will still render with fallback content
  }

  const infoBlock = blocks.find((b) => b.section === "info");
  const contactData = infoBlock ? JSON.parse(infoBlock.content || "{}") : null;

  // Provide fallback content if database data is not available
  if (!contactData) {
    return (
      <section className="section-padding">
        <div className="container-section grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div>
              <h2 className="section-heading">Visit or reach out</h2>
              <p className="section-subtitle">
                Join us in downtown Sudbury for lunch or dinner, or call ahead for
                takeout and catering enquiries.
              </p>
            </div>
            <div className="card-surface p-5 text-sm text-gray-200">
              <h3 className="mb-2 font-heading text-base text-gold">Location</h3>
              <p className="text-gray-400">Contact information will be available soon.</p>
            </div>
            <div className="pt-4">
              <DeliveryLinks />
            </div>
          </div>
          <div className="space-y-6">
            <form className="card-surface space-y-4 p-5 sm:p-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-xs font-semibold text-gold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                  placeholder="Your full name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-gold"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold text-gold"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold text-gold"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="min-h-[120px] rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                  placeholder="Share details about your reservation, catering needs, or questions."
                />
              </div>
              <p className="text-[11px] text-gray-400">
                This form is front-end only. Connect it to your preferred email or
                form service (e.g., Formspree, Netlify Forms) before going live.
              </p>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-section grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Info + hours */}
        <div className="space-y-6">
          <div>
            <h2 className="section-heading">Visit or reach out</h2>
            <p className="section-subtitle">
              Join us in downtown Sudbury for lunch or dinner, or call ahead for
              takeout and catering enquiries.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card-surface p-5 text-sm text-gray-200">
              <h3 className="mb-2 font-heading text-base text-gold">Location</h3>
              {contactData.address && (
                <div className="whitespace-pre-line">{contactData.address}</div>
              )}
              {contactData.phone && <p className="mt-2">Phone: {contactData.phone}</p>}
              {contactData.email && <p>Email: {contactData.email}</p>}
              {(contactData.facebook ||
                contactData.instagram ||
                contactData.tiktok) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {contactData.facebook && (
                    <a
                      href={contactData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                  {contactData.instagram && (
                    <a
                      href={contactData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {contactData.tiktok && (
                    <a
                      href={contactData.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold hover:underline"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="card-surface p-5 text-sm text-gray-200">
              <h3 className="mb-2 font-heading text-base text-gold">Hours</h3>
              {storeData.length > 0 ? (
                <ul className="space-y-1">
                  {storeData.map((day) => {
                    const dayNames = [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday"
                    ];
                    if (day.isClosed) {
                      return (
                        <li key={day.dayOfWeek}>
                          {dayNames[day.dayOfWeek]}: Closed
                        </li>
                      );
                    }
                    return (
                      <li key={day.dayOfWeek}>
                        {dayNames[day.dayOfWeek]}: {day.openTime} - {day.closeTime}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">Hours not set</p>
              )}
              <p className="mt-3 text-xs text-gray-400">
                Hours are based on publicly available information. Always check
                for holiday or seasonal changes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-200">
            <span className="rounded-full bg-white/5 px-3 py-1">
              Dine-in &amp; Takeout
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1">
              Catering &amp; Events
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1">Halal</span>
          </div>

          <div className="pt-4">
            <DeliveryLinks />
          </div>
        </div>

        {/* Map + form */}
        <div className="space-y-6">
          {contactData.mapUrl && (
            <div className="card-surface overflow-hidden">
              <div className="relative h-64 w-full sm:h-72">
                <iframe
                  title="Tandoori Tastes location map"
                  src={contactData.mapUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          <form className="card-surface space-y-4 p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs font-semibold text-gold">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                placeholder="Your full name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-gold"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold text-gold"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="message"
                className="text-xs font-semibold text-gold"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="min-h-[120px] rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1"
                placeholder="Share details about your reservation, catering needs, or questions."
              />
            </div>
            <p className="text-[11px] text-gray-400">
              This form is front-end only. Connect it to your preferred email or
              form service (e.g., Formspree, Netlify Forms) before going live.
            </p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}


