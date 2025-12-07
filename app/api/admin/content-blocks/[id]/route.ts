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
  const { content, order } = body;

  const block = await prisma.contentBlock.update({
    where: { id: params.id },
    data: {
      ...(content !== undefined && { content }),
      ...(order !== undefined && { order })
    }
  });

  return NextResponse.json(block);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.contentBlock.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ success: true });
}

