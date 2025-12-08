import { auth } from "@/lib/auth";
import { announcementQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { text, bgColor, startDate, endDate, isActive } = body;

  const updateData: any = {};
  if (text !== undefined) updateData.text = text;
  if (bgColor !== undefined) updateData.bgColor = bgColor;
  if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
  if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
  if (isActive !== undefined) updateData.isActive = isActive;

  const announcement = await announcementQueries.update(params.id, updateData);

  return NextResponse.json(announcement);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await announcementQueries.delete(params.id);

  return NextResponse.json({ success: true });
}

