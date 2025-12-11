import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    // Fetch featured dishes with menu items in one query
    const result = await sql`
      SELECT 
        fd.*,
        mi.id as "menuItem_id",
        mi.name as "menuItem_name",
        mi.description as "menuItem_description",
        mi.price as "menuItem_price",
        mi."imageUrl" as "menuItem_imageUrl",
        c.id as "menuItem_category_id",
        c.name as "menuItem_category_name",
        c.slug as "menuItem_category_slug"
      FROM "FeaturedDish" fd
      JOIN "MenuItem" mi ON fd."menuItemId" = mi.id
      JOIN "Category" c ON mi."categoryId" = c.id
      ORDER BY fd."order" ASC
    `;

    // Transform to nested structure
    const featured = result.rows.map((row: any) => ({
      id: row.id,
      menuItemId: row.menuItem_id,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      menuItem: {
        id: row.menuItem_id,
        name: row.menuItem_name,
        description: row.menuItem_description,
        price: parseFloat(row.menuItem_price),
        imageUrl: row.menuItem_imageUrl,
        category: {
          id: row.menuItem_category_id,
          name: row.menuItem_category_name,
          slug: row.menuItem_category_slug,
        },
      },
    }));

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
