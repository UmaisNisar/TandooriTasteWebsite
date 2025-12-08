import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hours = await prisma.storeHours.findMany({
      orderBy: { dayOfWeek: "asc" }
    });

    const holidays = await prisma.holiday.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: { date: "asc" }
    });

    return NextResponse.json({ hours, holidays });
  } catch (error) {
    console.error('Error fetching store hours:', error);
    return NextResponse.json({ hours: [], holidays: [] }, { status: 200 });
  }
}

