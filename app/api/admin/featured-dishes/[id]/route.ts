import { auth } from "@/lib/auth";
import { featuredDishQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await featuredDishQueries.delete(params.id);

  return NextResponse.json({ success: true });
}

