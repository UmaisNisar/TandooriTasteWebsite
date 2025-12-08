import { contentBlockQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    const blocks = await contentBlockQueries.findMany(page ? { page } : undefined);

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json([], { status: 200 });
  }
}

