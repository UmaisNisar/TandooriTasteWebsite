import { auth } from "@/lib/auth";
import { homeSliderQueries } from "@/lib/db-helpers";
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

  const updateData: any = {};
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (caption !== undefined) updateData.caption = caption;
  if (altText !== undefined) updateData.altText = altText;
  if (order !== undefined) updateData.order = order;
  if (isActive !== undefined) updateData.isActive = isActive;

  const slide = await homeSliderQueries.update(params.id, updateData);

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

  await homeSliderQueries.delete(params.id);

  return NextResponse.json({ success: true });
}

