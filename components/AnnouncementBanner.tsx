import { announcementQueries } from "@/lib/db-helpers";

export default async function AnnouncementBanner() {
  try {
    const announcements = await announcementQueries.findMany({
      isActive: true,
      dateFilter: true
    });

    if (announcements.length === 0) return null;

    const ann = announcements[0];

    return (
      <div
        className="border-b border-white/10 px-4 py-2 text-center text-sm text-white"
        style={{ backgroundColor: ann.bgColor }}
      >
        {ann.text}
      </div>
    );
  } catch (error) {
    // Database not set up yet or Prisma client not generated
    // Silently fail - no announcement banner will show
    return null;
  }
}

