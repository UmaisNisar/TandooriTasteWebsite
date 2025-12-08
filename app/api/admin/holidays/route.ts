import { auth } from "@/lib/auth";
import { holidayQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const holidays = await holidayQueries.findMany();
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

  const holiday = await holidayQueries.create({
    date: new Date(date),
    title,
    description: description || undefined,
    isClosed: isClosed !== undefined ? isClosed : true,
    overrideOpenTime: overrideOpenTime || undefined,
    overrideCloseTime: overrideCloseTime || undefined
  });

  return NextResponse.json(holiday);
}

