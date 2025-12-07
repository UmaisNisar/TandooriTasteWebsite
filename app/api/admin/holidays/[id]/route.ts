import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  const holiday = await prisma.holiday.update({
    where: { id: params.id },
    data: {
      ...(date && { date: new Date(date) }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(isClosed !== undefined && { isClosed }),
      ...(overrideOpenTime !== undefined && { overrideOpenTime }),
      ...(overrideCloseTime !== undefined && { overrideCloseTime })
    }
  });

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

  await prisma.holiday.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ success: true });
}

