import { NextResponse } from "next/server";
import { menuItemQueries } from "@/lib/db-helpers";
import { auth } from "@/lib/auth";

export const runtime = 'nodejs';

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

  const updateData: any = {};
  if (name !== undefined) updateData.name = String(name);
  if (description !== undefined) updateData.description = String(description);
  if (price !== undefined) updateData.price = Number(price);
  if (categoryId !== undefined) updateData.categoryId = String(categoryId);
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? String(imageUrl) : null;

  const item = await menuItemQueries.update(params.id, updateData);

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

  await menuItemQueries.delete(params.id);
  return new NextResponse(null, { status: 204 });
}




