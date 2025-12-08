import { auth } from "@/lib/auth";
import { storeHoursQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hours = await storeHoursQueries.findMany();
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

  const hours = await storeHoursQueries.upsert({
    dayOfWeek,
    openTime: isClosed ? undefined : (openTime || undefined),
    closeTime: isClosed ? undefined : (closeTime || undefined),
    isClosed: isClosed || false
  });

  return NextResponse.json(hours);
}

