import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ categories: [], items: [] }, { status: 200 });
  }
}




