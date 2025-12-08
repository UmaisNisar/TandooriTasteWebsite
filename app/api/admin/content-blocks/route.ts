import { auth } from "@/lib/auth";
import { contentBlockQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blocks = await contentBlockQueries.findMany(page ? { page } : undefined);
  return NextResponse.json(blocks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { page, section, content, order } = body;

  if (!page || !section) {
    return NextResponse.json(
      { error: "Page and section are required" },
      { status: 400 }
    );
  }

  const block = await contentBlockQueries.upsert({
    page,
    section,
    content: content || "",
    order: order || 0
  });

  return NextResponse.json(block);
}

