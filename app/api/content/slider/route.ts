import { homeSliderQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await homeSliderQueries.findMany();
    const activeSlides = slides.filter(s => s.isActive).sort((a, b) => a.order - b.order);
    return NextResponse.json(activeSlides);
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json([], { status: 200 });
  }
}

