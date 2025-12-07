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
  const { imageUrl, caption, altText, order, isActive } = body;

  const slide = await prisma.homeSlider.update({
    where: { id: params.id },
    data: {
      ...(imageUrl !== undefined && { imageUrl }),
      ...(caption !== undefined && { caption }),
      ...(altText !== undefined && { altText }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive })
    }
  });

  return NextResponse.json(slide);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.homeSlider.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ success: true });
}

