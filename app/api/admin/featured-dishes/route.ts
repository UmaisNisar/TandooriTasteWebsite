import { auth } from "@/lib/auth";
import { featuredDishQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const featured = await featuredDishQueries.findMany(true);
  return NextResponse.json(featured);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { menuItemId, order } = body;

  if (!menuItemId) {
    return NextResponse.json(
      { error: "Menu item ID is required" },
      { status: 400 }
    );
  }

  const featured = await featuredDishQueries.create({
    menuItemId,
    order: order || 0
  });

  return NextResponse.json(featured);
}

