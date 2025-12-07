import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findMany();
  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
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

  await prisma.siteSettings.upsert({
    where: { key },
    update: { value: String(value || "") },
    create: { key, value: String(value || "") }
  });

  return NextResponse.json({ success: true });
}

