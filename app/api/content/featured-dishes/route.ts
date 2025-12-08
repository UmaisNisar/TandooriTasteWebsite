import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const featured = await prisma.featuredDish.findMany({
      include: {
        menuItem: {
          include: { category: true }
        }
      },
      orderBy: { order: "asc" }
    });
    return NextResponse.json(featured);
  } catch (error) {
    console.error('Error fetching featured dishes:', error);
    return NextResponse.json([], { status: 200 });
  }
}

