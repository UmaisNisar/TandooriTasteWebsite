import { NextResponse } from "next/server";
import { categoryQueries, menuItemQueries } from "@/lib/db-helpers";
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

  const category = await categoryQueries.update(params.id, { name, slug });

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

  const count = await menuItemQueries.count({ categoryId: params.id });

  if (count > 0) {
    return NextResponse.json(
      { error: "Cannot delete a category that is in use." },
      { status: 400 }
    );
  }

  await categoryQueries.delete(params.id);
  return new NextResponse(null, { status: 204 });
}




