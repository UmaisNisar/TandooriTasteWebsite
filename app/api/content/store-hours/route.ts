import { storeHoursQueries, holidayQueries, query } from "@/lib/db-helpers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const hours = await storeHoursQueries.findMany();

    const result = await query(
      'SELECT * FROM "Holiday" WHERE date >= NOW() ORDER BY date ASC'
    );
    const holidays = result.rows;

    return NextResponse.json({ hours, holidays });
  } catch (error) {
    console.error('Error fetching store hours:', error);
    return NextResponse.json({ hours: [], holidays: [] }, { status: 200 });
  }
}

