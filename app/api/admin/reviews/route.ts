import { auth } from "@/lib/auth";
import { reviewQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await reviewQueries.findMany();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { reviewerName, reviewerImageUrl, rating, text, isVisible } = body;

  if (!reviewerName || !text) {
    return NextResponse.json(
      { error: "Reviewer name and text are required" },
      { status: 400 }
    );
  }

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const review = await reviewQueries.create({
    reviewerName,
    reviewerImageUrl: reviewerImageUrl || undefined,
    rating: parseInt(rating),
    text,
    isVisible: isVisible !== undefined ? isVisible : true
  });

  return NextResponse.json(review);
}

