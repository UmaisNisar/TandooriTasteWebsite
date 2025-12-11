// Edge-compatible Supabase client for Edge Runtime
// This uses @supabase/supabase-js which is fully compatible with Edge Runtime
import { createClient } from '@supabase/supabase-js';

// Type definitions for Supabase nested select responses
type FeaturedDishRow = {
  id: string;
  menuItemId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type MenuItemRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  FeaturedDish?: FeaturedDishRow[];
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  MenuItem?: MenuItemRow[];
};

// Get Supabase credentials from environment variables
function getSupabaseConfig() {
  // Option 1: Direct Supabase credentials (preferred)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY,
    };
  }

  // Option 2: Extract from DATABASE_URL (for backward compatibility)
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl.replace('postgresql://', 'https://'));
      const hostname = url.hostname;
      
      // Extract project ref from hostname (e.g., irmgycjvcqmrfairlzut.supabase.co -> irmgycjvcqmrfairlzut)
      const projectRef = hostname.split('.')[0];
      
      // Construct Supabase URL
      const supabaseUrl = `https://${projectRef}.supabase.co`;
      
      // For Supabase, we need the anon key or service role key
      // Service role key has full access, anon key has restricted access
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
      
      if (supabaseKey) {
        return {
          url: supabaseUrl,
          key: supabaseKey,
        };
      }
    } catch (e) {
      console.error('[SUPABASE-EDGE] Error parsing DATABASE_URL:', e);
    }
  }

  throw new Error(
    'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY, ' +
    'or SUPABASE_SERVICE_ROLE_KEY in environment variables. ' +
    'You can find these in your Supabase project settings under API.'
  );
}

// Create Supabase client (edge-compatible)
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    supabaseClient = createClient(config.url, config.key, {
      auth: {
        persistSession: false, // Edge Runtime doesn't support session persistence
      },
    });
  }
  return supabaseClient;
}

// Get Supabase client instance
export function getSupabase() {
  return getSupabaseClient();
}

// Execute raw SQL query using Supabase's REST API
// For complex queries with JOINs, we'll convert them to use Supabase's query builder
export async function queryEdge(text: string, params?: any[]): Promise<any> {
  try {
    const client = getSupabaseClient();
    const config = getSupabaseConfig();
    
    // For complex JOIN queries, use Supabase's REST API with PostgREST syntax
    // PostgREST supports JOINs via nested select: select=table1(*),table2(*)
    
    // Check if it's a JOIN query
    const trimmed = text.trim().toUpperCase();
    const hasJoin = trimmed.includes('JOIN');
    
    if (hasJoin) {
      // For JOIN queries, we'll use Supabase's query builder with nested selects
      // This is the PostgREST way of doing joins
      
      // Parse the query to extract table names and relationships
      // This is a simplified parser - for production, use a proper SQL parser
      
      // Extract main table (FROM clause)
      const fromMatch = text.match(/FROM\s+"?(\w+)"?\s+(\w+)?/i);
      if (!fromMatch) {
        throw new Error('Could not parse FROM clause in JOIN query');
      }
      
      const mainTable = fromMatch[1];
      const mainAlias = fromMatch[2] || mainTable;
      
      // For the menu endpoint query, we can use Supabase's nested select
      // Example: client.from('Category').select('*, MenuItem(*), FeaturedDish(*)')
      
      // Since we can't easily parse complex SQL, we'll use a simpler approach:
      // Use the REST API directly with PostgREST syntax
      
      // For now, let's use Supabase's query builder for known query patterns
      // The menu query pattern: Category LEFT JOIN MenuItem LEFT JOIN FeaturedDish
      if (mainTable === 'Category' && text.includes('MenuItem') && text.includes('FeaturedDish')) {
        const { data, error } = await client
          .from('Category')
          .select(`
            *,
            MenuItem (
              *,
              FeaturedDish (*)
            )
          `)
          .order('name', { ascending: true }) as { data: CategoryRow[] | null; error: any };
        
        if (error) throw error;
        
        // Transform the nested structure to match the expected flat structure
        const rows: any[] = [];
        if (data) {
          for (const category of data) {
            if (category.MenuItem && Array.isArray(category.MenuItem)) {
              for (const menuItem of category.MenuItem) {
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
                  featured_id: menuItem.FeaturedDish?.[0]?.id || null,
                  featured_order: menuItem.FeaturedDish?.[0]?.order || null,
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
        
        return {
          rows,
          rowCount: rows.length,
        };
      }
      
      // For other JOIN queries, throw an error suggesting to use Supabase's query builder
      throw new Error(
        'Complex JOIN queries should use Supabase\'s query builder. ' +
        'Use client.from(table).select(\'*, relatedTable(*)\') for joins. ' +
        'Query: ' + text.substring(0, 100)
      );
    }
    
    // For simple SELECT queries, use Supabase's query builder
    const isSelect = trimmed.startsWith('SELECT');
    if (isSelect) {
      const fromMatch = text.match(/FROM\s+"?(\w+)"?/i);
      if (fromMatch) {
        const tableName = fromMatch[1];
        let query = client.from(tableName).select('*');
        
        // Parse WHERE clause
        const whereMatch = text.match(/WHERE\s+(.+?)(?:\s+ORDER|\s*$)/i);
        if (whereMatch && params) {
          const whereClause = whereMatch[1];
          // Simple WHERE parsing - for production, use Supabase's query builder methods
          // For now, we'll select all and filter in memory for simple cases
        }
        
        // Parse ORDER BY
        const orderMatch = text.match(/ORDER\s+BY\s+"?(\w+)"?(?:\s+(ASC|DESC))?/i);
        if (orderMatch) {
          const orderColumn = orderMatch[1];
          const orderDir = (orderMatch[2] || 'ASC').toLowerCase() === 'asc';
          query = query.order(orderColumn, { ascending: orderDir });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return {
          rows: data || [],
          rowCount: Array.isArray(data) ? data.length : 0,
        };
      }
    }
    
    throw new Error('Unsupported query type. Use Supabase\'s query builder for best results.');
  } catch (error: any) {
    console.error('[SUPABASE-EDGE] Query error:', error.message);
    console.error('[SUPABASE-EDGE] Query:', text.substring(0, 200));
    throw error;
  }
}

// Export for compatibility
export { queryEdge as query };
