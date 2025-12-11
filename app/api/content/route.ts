import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    let result;
    if (page) {
      // Use template literal for parameterized query
      result = await sql`
        SELECT * FROM "ContentBlock" 
        WHERE page = ${page}
        ORDER BY "order" ASC
      `;
    } else {
      result = await sql`
        SELECT * FROM "ContentBlock" 
        ORDER BY "order" ASC
      `;
    }

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
