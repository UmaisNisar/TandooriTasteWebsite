import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slides = await prisma.homeSlider.findMany({
    orderBy: { order: "asc" }
  });
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

  const slide = await prisma.homeSlider.create({
    data: {
      imageUrl,
      caption: caption || null,
      altText: altText || null,
      order: order || 0
    }
  });

  return NextResponse.json(slide);
}

