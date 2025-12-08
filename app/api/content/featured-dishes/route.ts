import { featuredDishQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const featured = await featuredDishQueries.findMany();
    return NextResponse.json(featured);
  } catch (error) {
    console.error('Error fetching featured dishes:', error);
    return NextResponse.json([], { status: 200 });
  }
}

