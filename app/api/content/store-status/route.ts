import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Check for holidays
  const holiday = await prisma.holiday.findFirst({
    where: {
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  });

  if (holiday) {
    if (holiday.isClosed) {
      return NextResponse.json({
        isOpen: false,
        reason: holiday.title,
        message: holiday.description || `Closed: ${holiday.title}`
      });
    } else if (holiday.overrideOpenTime && holiday.overrideCloseTime) {
      const [openHour, openMin] = holiday.overrideOpenTime.split(":").map(Number);
      const [closeHour, closeMin] = holiday.overrideCloseTime.split(":").map(Number);
      const openTime = new Date(now);
      openTime.setHours(openHour, openMin, 0, 0);
      const closeTime = new Date(now);
      closeTime.setHours(closeHour, closeMin, 0, 0);

      return NextResponse.json({
        isOpen: now >= openTime && now < closeTime,
        reason: holiday.title,
        openTime: holiday.overrideOpenTime,
        closeTime: holiday.overrideCloseTime,
        message: `Special hours: ${holiday.title}`
      });
    }
  }

  // Get regular hours
  const hours = await prisma.storeHours.findUnique({
    where: { dayOfWeek }
  });

  if (!hours || hours.isClosed) {
    return NextResponse.json({
      isOpen: false,
      reason: "Closed today"
    });
  }

  if (!hours.openTime || !hours.closeTime) {
    return NextResponse.json({
      isOpen: false,
      reason: "Hours not set"
    });
  }

  const [openHour, openMin] = hours.openTime.split(":").map(Number);
  const [closeHour, closeMin] = hours.closeTime.split(":").map(Number);
  const openTime = new Date(now);
  openTime.setHours(openHour, openMin, 0, 0);
  const closeTime = new Date(now);
  closeTime.setHours(closeHour, closeMin, 0, 0);

  // Handle closing time past midnight
  if (closeTime < openTime) {
    closeTime.setDate(closeTime.getDate() + 1);
  }

  const isOpen = now >= openTime && now < closeTime;

  return NextResponse.json({
    isOpen,
    openTime: hours.openTime,
    closeTime: hours.closeTime,
    reason: isOpen ? "Open now" : "Closed"
  });
}

