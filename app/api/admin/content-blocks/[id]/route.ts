import { auth } from "@/lib/auth";
import { contentBlockQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { content, order } = body;

  const updateData: any = {};
  if (content !== undefined) updateData.content = content;
  if (order !== undefined) updateData.order = order;

  const block = await contentBlockQueries.update(params.id, updateData);

  return NextResponse.json(block);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await contentBlockQueries.delete(params.id);

  return NextResponse.json({ success: true });
}

