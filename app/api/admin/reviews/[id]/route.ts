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
  const {
    reviewerName,
    reviewerImageUrl,
    rating,
    text,
    isVisible
  } = body;

  const updateData: any = {};
  if (reviewerName !== undefined) updateData.reviewerName = reviewerName;
  if (reviewerImageUrl !== undefined)
    updateData.reviewerImageUrl = reviewerImageUrl || null;
  if (rating !== undefined) updateData.rating = parseInt(rating);
  if (text !== undefined) updateData.text = text;
  if (isVisible !== undefined) updateData.isVisible = isVisible;

  if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const review = await prisma.review.update({
    where: { id: params.id },
    data: updateData
  });

  return NextResponse.json(review);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.review.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ success: true });
}

