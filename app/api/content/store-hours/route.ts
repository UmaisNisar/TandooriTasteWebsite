import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    // Fetch store hours and upcoming holidays in parallel
    const [hoursResult, holidaysResult] = await Promise.all([
      sql`SELECT * FROM "StoreHours" ORDER BY "dayOfWeek" ASC`,
      sql`SELECT * FROM "Holiday" WHERE date >= NOW() ORDER BY date ASC`
    ]);

    return NextResponse.json({
      hours: hoursResult.rows,
      holidays: holidaysResult.rows
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching store hours:', error);
    return NextResponse.json({ 
      hours: [], 
      holidays: [] 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
