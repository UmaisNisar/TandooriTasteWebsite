import { NextResponse } from "next/server";
import { categoryQueries, menuItemQueries, query } from "@/lib/db-helpers";

// Use Node.js runtime for Supabase compatibility
export const runtime = 'nodejs';
export const revalidate = 30; // Cache for 30 seconds

// Unified menu endpoint - returns all categories, items, and featured dishes in one query
export async function GET() {
  try {
    // Single optimized query that fetches everything at once
    const result = await query(
      `SELECT 
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c."createdAt" as category_createdAt,
        c."updatedAt" as category_updatedAt,
        mi.id as item_id,
        mi.name as item_name,
        mi.description as item_description,
        mi.price as item_price,
        mi."imageUrl" as item_imageUrl,
        mi."createdAt" as item_createdAt,
        mi."updatedAt" as item_updatedAt,
        fd.id as featured_id,
        fd."order" as featured_order
      FROM "Category" c
      LEFT JOIN "MenuItem" mi ON mi."categoryId" = c.id
      LEFT JOIN "FeaturedDish" fd ON fd."menuItemId" = mi.id
      ORDER BY c.name ASC, mi.name ASC, fd."order" ASC`
    );

    // Transform flat result into nested structure
    const categoryMap = new Map();
    const featuredItemIds = new Set<string>();

    result.rows.forEach((row: any) => {
      // Process category
      if (!categoryMap.has(row.category_id)) {
        categoryMap.set(row.category_id, {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          createdAt: row.category_createdAt,
          updatedAt: row.category_updatedAt,
          items: []
        });
      }

      // Process menu item (if exists)
      if (row.item_id) {
        const category = categoryMap.get(row.category_id);
        const existingItem = category.items.find((item: any) => item.id === row.item_id);
        
        if (!existingItem) {
          category.items.push({
            id: row.item_id,
            name: row.item_name,
            description: row.item_description,
            price: parseFloat(row.item_price),
            imageUrl: row.item_imageUrl,
            createdAt: row.item_createdAt,
            updatedAt: row.item_updatedAt,
            category: {
              id: row.category_id,
              name: row.category_name,
              slug: row.category_slug
            },
            isFeatured: !!row.featured_id
          });
        }

        // Track featured items
        if (row.featured_id) {
          featuredItemIds.add(row.item_id);
        }
      }
    });

    // Convert map to arrays
    const categories = Array.from(categoryMap.values());
    
    // Flatten all items for backward compatibility
    const items = categories.flatMap(cat => 
      cat.items.map((item: any) => ({
        ...item,
        categoryId: cat.id
      }))
    );

    // Get featured dishes in order
    const featuredDishes = items
      .filter(item => item.isFeatured)
      .sort((a, b) => {
        const aOrder = result.rows.find((r: any) => r.item_id === a.id && r.featured_id)?.featured_order || 0;
        const bOrder = result.rows.find((r: any) => r.item_id === b.id && r.featured_id)?.featured_order || 0;
        return aOrder - bOrder;
      });

    return NextResponse.json({
      categories,
      items,
      featuredDishes,
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
