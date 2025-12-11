import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-edge";

// Use Edge Runtime for maximum performance
export const runtime = 'edge';
export const revalidate = 30; // Cache for 30 seconds

// Type definitions for Supabase nested select response
type FeaturedDish = {
  id: string;
  menuItemId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  FeaturedDish?: FeaturedDish[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  MenuItem?: MenuItem[];
};

// Unified menu endpoint - returns all categories, items, and featured dishes in one query
export async function GET() {
  try {
    const supabase = getSupabase();
    
    // Fetch categories with menu items and featured dishes using Supabase's nested select
    // Supabase uses PostgREST syntax: select='*, MenuItem(*, FeaturedDish(*))'
    const { data: categoriesData, error } = await supabase
      .from('Category')
      .select(`
        *,
        MenuItem (
          *,
          FeaturedDish (*)
        )
      `)
      .order('name', { ascending: true }) as { data: Category[] | null; error: any };

    if (error) throw error;

    // Transform nested structure to flat structure for backward compatibility
    const rows: any[] = [];
    if (categoriesData) {
      for (const category of categoriesData) {
        if (category.MenuItem && Array.isArray(category.MenuItem)) {
          for (const menuItem of category.MenuItem) {
            const featuredDish = menuItem.FeaturedDish && Array.isArray(menuItem.FeaturedDish) 
              ? menuItem.FeaturedDish[0] 
              : null;
            
            rows.push({
              category_id: category.id,
              category_name: category.name,
              category_slug: category.slug,
              category_createdAt: category.createdAt,
              category_updatedAt: category.updatedAt,
              item_id: menuItem.id,
              item_name: menuItem.name,
              item_description: menuItem.description,
              item_price: menuItem.price,
              item_imageUrl: menuItem.imageUrl,
              item_createdAt: menuItem.createdAt,
              item_updatedAt: menuItem.updatedAt,
              featured_id: featuredDish?.id || null,
              featured_order: featuredDish?.order || null,
            });
          }
        } else {
          // Category with no menu items
          rows.push({
            category_id: category.id,
            category_name: category.name,
            category_slug: category.slug,
            category_createdAt: category.createdAt,
            category_updatedAt: category.updatedAt,
            item_id: null,
            item_name: null,
            item_description: null,
            item_price: null,
            item_imageUrl: null,
            item_createdAt: null,
            item_updatedAt: null,
            featured_id: null,
            featured_order: null,
          });
        }
      }
    }

    const result = { rows, rowCount: rows.length };

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
