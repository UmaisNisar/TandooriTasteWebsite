import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(announcements);
}

