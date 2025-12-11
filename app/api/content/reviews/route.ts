import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM "Review" 
      WHERE "isVisible" = true
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
