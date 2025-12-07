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
  const { text, bgColor, startDate, endDate, isActive } = body;

  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      ...(text !== undefined && { text }),
      ...(bgColor !== undefined && { bgColor }),
      ...(startDate !== undefined && {
        startDate: startDate ? new Date(startDate) : null
      }),
      ...(endDate !== undefined && {
        endDate: endDate ? new Date(endDate) : null
      }),
      ...(isActive !== undefined && { isActive })
    }
  });

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

  await prisma.announcement.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ success: true });
}

