import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, categoryId, imageUrl } = body;

  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data: {
      name: name ? String(name) : undefined,
      description: description ? String(description) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      imageUrl: imageUrl !== undefined ? String(imageUrl) : undefined
    }
  });

  return NextResponse.json(item);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.menuItem.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}




