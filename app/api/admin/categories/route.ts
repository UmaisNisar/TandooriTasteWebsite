import { NextResponse } from "next/server";
import { categoryQueries } from "@/lib/db-helpers";
import { auth } from "@/lib/auth";

export const runtime = 'nodejs';

export async function GET() {
  const categories = await categoryQueries.findMany();
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

  const category = await categoryQueries.create({ name, slug });

  return NextResponse.json(category, { status: 201 });
}




