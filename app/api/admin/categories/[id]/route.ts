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
  const name = String(body.name || "").trim();

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name, slug }
  });

  return NextResponse.json(category);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const count = await prisma.menuItem.count({
    where: { categoryId: params.id }
  });

  if (count > 0) {
    return NextResponse.json(
      { error: "Cannot delete a category that is in use." },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}




