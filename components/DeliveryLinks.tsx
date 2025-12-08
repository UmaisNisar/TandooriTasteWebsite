import { storeSettingsQueries } from "@/lib/db-helpers";
import Link from "next/link";

export default async function DeliveryLinks() {
  try {
    const settings = await storeSettingsQueries.findMany();
    const settingsMap = Object.fromEntries(
      settings.map((s: { key: string; value: string }) => [s.key, s.value])
    );

    const links = [
      { key: "uberEatsUrl", label: "Uber Eats", icon: "🚗" },
      { key: "doorDashUrl", label: "DoorDash", icon: "📦" },
      { key: "skipTheDishesUrl", label: "SkipTheDishes", icon: "🍽️" },
      { key: "customOrderUrl", label: "Order Online", icon: "🛒" }
    ].filter((link) => settingsMap[link.key]);

    if (links.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.key}
            href={settingsMap[link.key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-gold hover:bg-gold/5"
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    return null;
  }
}

