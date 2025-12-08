import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await prisma.homeSlider.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json([], { status: 200 });
  }
}

