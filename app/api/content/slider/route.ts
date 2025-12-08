import { homeSliderQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const slides = await homeSliderQueries.findMany();
    const activeSlides = slides.filter((s: { isActive: boolean }) => s.isActive).sort((a: { order: number }, b: { order: number }) => a.order - b.order);
    return NextResponse.json(activeSlides);
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json([], { status: 200 });
  }
}

