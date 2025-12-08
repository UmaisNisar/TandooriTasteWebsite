import { auth } from "@/lib/auth";
import { announcementQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const announcements = await announcementQueries.findMany();
  return NextResponse.json(announcements);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { text, bgColor, startDate, endDate } = body;

  if (!text) {
    return NextResponse.json(
      { error: "Text is required" },
      { status: 400 }
    );
  }

  const announcement = await announcementQueries.create({
    text,
    bgColor: bgColor || "#8B0000",
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined
  });

  return NextResponse.json(announcement);
}

