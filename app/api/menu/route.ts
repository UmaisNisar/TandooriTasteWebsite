import { NextResponse } from "next/server";
import { categoryQueries, menuItemQueries, query } from "@/lib/db-helpers";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const categories = await categoryQueries.findMany();
    
    const itemsResult = await query(
      `SELECT 
        mi.*,
        c.id as "category_id",
        c.name as "category_name",
        c.slug as "category_slug"
      FROM "MenuItem" mi
      JOIN "Category" c ON mi."categoryId" = c.id
      ORDER BY mi.name ASC`
    );
    
    const items = itemsResult.rows.map((row: { id: string; name: string; description: string; price: number | string; imageUrl: string | null; categoryId: string; isAvailable: boolean; order: number; createdAt: string; updatedAt: string; category_id: string; category_name: string; category_slug: string }) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
      imageUrl: row.imageUrl,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      }
    }));

    return NextResponse.json({
      categories,
      items
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ categories: [], items: [] }, { status: 200 });
  }
}




