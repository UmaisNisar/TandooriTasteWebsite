import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany();
    const settingsMap = Object.fromEntries(
      settings.map((s) => [s.key, s.value])
    );
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({}, { status: 200 });
  }
}

