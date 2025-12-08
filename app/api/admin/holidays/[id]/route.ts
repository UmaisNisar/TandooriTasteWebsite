import { auth } from "@/lib/auth";
import { holidayQueries } from "@/lib/db-helpers";
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
  const { date, title, description, isClosed, overrideOpenTime, overrideCloseTime } = body;

  const updateData: any = {};
  if (date) updateData.date = new Date(date);
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (isClosed !== undefined) updateData.isClosed = isClosed;
  if (overrideOpenTime !== undefined) updateData.overrideOpenTime = overrideOpenTime;
  if (overrideCloseTime !== undefined) updateData.overrideCloseTime = overrideCloseTime;

  const holiday = await holidayQueries.update(params.id, updateData);

  return NextResponse.json(holiday);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await holidayQueries.delete(params.id);

  return NextResponse.json({ success: true });
}

