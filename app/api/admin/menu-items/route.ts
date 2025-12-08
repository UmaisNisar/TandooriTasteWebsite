import { NextResponse } from "next/server";
import { menuItemQueries } from "@/lib/db-helpers";
import { auth } from "@/lib/auth";

export async function GET() {
  const items = await menuItemQueries.findMany(undefined, true);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  const { name, description, price, categoryId, imageUrl } = body;

  if (!name || !description || !price || !categoryId) {
    return NextResponse.json(
      { error: "Name, description, price and category are required." },
      { status: 400 }
    );
  }

  const item = await menuItemQueries.create({
    name: String(name),
    description: String(description),
    price: Number(price),
    categoryId: String(categoryId),
    imageUrl: imageUrl ? String(imageUrl) : undefined
  });

  return NextResponse.json(item, { status: 201 });
}




