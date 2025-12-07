import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  const items = await prisma.menuItem.findMany({
    orderBy: { name: "asc" },
    include: { category: true }
  });

  return NextResponse.json({
    categories,
    items
  });
}




