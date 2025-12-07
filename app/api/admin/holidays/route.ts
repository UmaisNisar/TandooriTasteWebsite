import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const holidays = await prisma.holiday.findMany({
    orderBy: { date: "asc" }
  });
  return NextResponse.json(holidays);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { date, title, description, isClosed, overrideOpenTime, overrideCloseTime } = body;

  if (!date || !title) {
    return NextResponse.json(
      { error: "Date and title are required" },
      { status: 400 }
    );
  }

  const holiday = await prisma.holiday.create({
    data: {
      date: new Date(date),
      title,
      description: description || null,
      isClosed: isClosed !== undefined ? isClosed : true,
      overrideOpenTime: overrideOpenTime || null,
      overrideCloseTime: overrideCloseTime || null
    }
  });

  return NextResponse.json(holiday);
}

