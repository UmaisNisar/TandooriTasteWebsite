import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const settings = await prisma.siteSettings.findMany();
  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );
  return NextResponse.json(settingsMap);
}

