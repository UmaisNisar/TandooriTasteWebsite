import { auth } from "@/lib/auth";
import { storeSettingsQueries } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await storeSettingsQueries.findMany();
  const settingsMap = Object.fromEntries(
    settings.map((s: { key: string; value: string }) => [s.key, s.value])
  );
  return NextResponse.json(settingsMap);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { key, value } = body;

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  await storeSettingsQueries.upsert({
    key,
    value: String(value || "")
  });

  return NextResponse.json({ success: true });
}

