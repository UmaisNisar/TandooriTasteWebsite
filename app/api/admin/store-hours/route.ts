import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hours = await prisma.storeHours.findMany({
    orderBy: { dayOfWeek: "asc" }
  });
  return NextResponse.json(hours);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { dayOfWeek, openTime, closeTime, isClosed } = body;

  if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
    return NextResponse.json(
      { error: "Invalid dayOfWeek (0-6)" },
      { status: 400 }
    );
  }

  const hours = await prisma.storeHours.upsert({
    where: { dayOfWeek },
    update: {
      openTime: isClosed ? null : openTime || null,
      closeTime: isClosed ? null : closeTime || null,
      isClosed: isClosed || false
    },
    create: {
      dayOfWeek,
      openTime: isClosed ? null : openTime || null,
      closeTime: isClosed ? null : closeTime || null,
      isClosed: isClosed || false
    }
  });

  return NextResponse.json(hours);
}

