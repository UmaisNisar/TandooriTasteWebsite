import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
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

  const category = await prisma.category.create({
    data: { name, slug }
  });

  return NextResponse.json(category, { status: 201 });
}




