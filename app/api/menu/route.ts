import { NextResponse } from "next/server";
import { fetchMenuData } from "@/lib/menu-helpers";

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

// Unified menu endpoint - returns all categories, items, and featured dishes in one query
export async function GET() {
  try {
    const menuData = await fetchMenuData();

    return NextResponse.json({
      ...menuData,
      // Metadata for caching
      cached: true,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ 
      categories: [], 
      items: [],
      featuredDishes: [],
      error: error.message 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
