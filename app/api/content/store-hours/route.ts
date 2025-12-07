import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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
}

