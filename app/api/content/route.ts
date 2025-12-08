import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    const where = page ? { page } : {};
    const blocks = await prisma.contentBlock.findMany({
      where,
      orderBy: { order: "asc" }
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json([], { status: 200 });
  }
}

