import { auth } from "@/lib/auth";
import { homeSliderQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slides = await homeSliderQueries.findMany();
  return NextResponse.json(slides);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { imageUrl, caption, altText, order } = body;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  const slide = await homeSliderQueries.create({
    imageUrl,
    caption: caption || undefined,
    altText: altText || undefined,
    order: order || 0
  });

  return NextResponse.json(slide);
}

