import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  const where = page ? { page } : {};
  const blocks = await prisma.contentBlock.findMany({
    where,
    orderBy: { order: "asc" }
  });

  return NextResponse.json(blocks);
}

