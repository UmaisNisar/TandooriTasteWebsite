import { prisma } from "@/lib/prisma";

export default async function AnnouncementBanner() {
  try {
    const now = new Date();
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } }
        ]
      },
      orderBy: { createdAt: "desc" },
      take: 1
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

