import { NextResponse } from "next/server";
import { getSupabase } from '@/lib/supabase-edge';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    // Fetch featured dishes with menu items in one query using Supabase's nested select
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('FeaturedDish')
      .select(`
        *,
        MenuItem (
          *,
          Category (
            *
          )
        )
      `)
      .order('order', { ascending: true });

    if (error) throw error;

    // Transform to nested structure
    const featured = (data || []).map((row: any) => ({
      id: row.id,
      menuItemId: row.menuItemId,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      menuItem: row.MenuItem ? {
        id: row.MenuItem.id,
        name: row.MenuItem.name,
        description: row.MenuItem.description,
        price: parseFloat(row.MenuItem.price),
        imageUrl: row.MenuItem.imageUrl,
        category: row.MenuItem.Category ? {
          id: row.MenuItem.Category.id,
          name: row.MenuItem.Category.name,
          slug: row.MenuItem.Category.slug,
        } : null,
      } : null,
    })).filter((f: any) => f.menuItem); // Filter out any with missing menu items

    return NextResponse.json(featured, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  } catch (error: any) {
    console.error('Error fetching featured dishes:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }
}
