import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const featured = await prisma.featuredDish.findMany({
    include: {
      menuItem: {
        include: { category: true }
      }
    },
    orderBy: { order: "asc" }
  });
  return NextResponse.json(featured);
}

